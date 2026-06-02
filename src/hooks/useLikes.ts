"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "@/types/video";
import type { LikeState, LikesMap } from "@/lib/likesStore";

/** Type guard for a single LikeState received from the API. */
function isLikeState(value: unknown): value is LikeState {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.liked === "boolean" && typeof entry.likesCount === "number"
  );
}

/** Builds the initial map from mock videos (used before/if the API responds). */
function buildBaseState(videos: Video[]): LikesMap {
  const base: LikesMap = {};
  for (const video of videos) {
    base[video.id] = { liked: false, likesCount: video.likesCount };
  }
  return base;
}

/** Narrows an unknown fetched payload into a LikesMap, dropping bad entries. */
function parseLikesMap(payload: unknown): LikesMap {
  if (typeof payload !== "object" || payload === null) return {};
  const map: LikesMap = {};
  for (const [id, value] of Object.entries(payload as Record<string, unknown>)) {
    if (isLikeState(value)) map[id] = value;
  }
  return map;
}

interface UseLikesResult {
  /** Current per-video like state, keyed by video id. */
  likes: LikesMap;
  /** Toggles like for a video with optimistic update + server reconciliation. */
  toggleLike: (id: string) => void;
  /** Whether a toggle request is currently in flight for the given id. */
  isPending: (id: string) => boolean;
}

/**
 * Manages like state for the whole feed.
 *
 * - Seeds from mock base immediately (so the UI renders without a flash).
 * - Loads persisted state from `GET /api/likes` and merges it over the base.
 * - On toggle: applies an optimistic update, POSTs to `/api/likes/[id]`,
 *   reconciles with the server's authoritative count, and rolls back on error.
 * - Guards against double-fire while a request for the same id is in flight.
 */
export function useLikes(videos: Video[]): UseLikesResult {
  const [likes, setLikes] = useState<LikesMap>(() => buildBaseState(videos));

  // Tracks ids with an in-flight POST so we can ignore repeat clicks.
  const pendingRef = useRef<Set<string>>(new Set());
  // Bumps to re-render when pending set changes (so disabled state updates).
  const [, forcePendingTick] = useState(0);

  // Load persisted server state once on mount and merge over the base.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/likes", { cache: "no-store" });
        if (!res.ok) return;
        const data: unknown = await res.json();
        const serverMap = parseLikesMap(data);
        if (cancelled) return;
        setLikes((prev) => ({ ...prev, ...serverMap }));
      } catch {
        // Network/parse failure: keep the mock base state silently.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const isPending = useCallback((id: string) => pendingRef.current.has(id), []);

  const toggleLike = useCallback((id: string) => {
    // Ignore if a request for this id is already running.
    if (pendingRef.current.has(id)) return;

    let snapshot: LikeState | undefined;

    // Optimistic update from the latest state.
    setLikes((prev) => {
      const current = prev[id];
      if (!current) return prev; // Unknown id: nothing to do.
      snapshot = current;
      const liked = !current.liked;
      const likesCount = current.likesCount + (liked ? 1 : -1);
      return { ...prev, [id]: { liked, likesCount } };
    });

    if (!snapshot) return; // Bail if the id wasn't in state.

    const rollbackTo = snapshot;
    pendingRef.current.add(id);
    forcePendingTick((n) => n + 1);

    (async () => {
      try {
        const res = await fetch(`/api/likes/${encodeURIComponent(id)}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: unknown = await res.json();
        if (!isLikeState(data)) throw new Error("Invalid response shape");

        // Reconcile with the server's authoritative state.
        setLikes((prev) => ({ ...prev, [id]: data }));
      } catch {
        // Roll back to the pre-click snapshot on any failure.
        setLikes((prev) => ({ ...prev, [id]: rollbackTo }));
      } finally {
        pendingRef.current.delete(id);
        forcePendingTick((n) => n + 1);
      }
    })();
  }, []);

  return { likes, toggleLike, isPending };
}
