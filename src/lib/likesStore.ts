/**
 * Server-only likes store backed by a JSON file at the repo root.
 *
 * Shape on disk:
 *   { "<videoId>": { "liked": boolean, "likesCount": number } }
 *
 * This module must never be imported from client components — it touches
 * `fs/promises` and `process.cwd()`, which only exist on the server.
 */
import { promises as fs } from "fs";
import path from "path";
import { mockVideos } from "@/data/mockVideos";

/** Per-video like state persisted on the server. */
export interface LikeState {
  /** Whether the (single demo) user has liked this video. */
  liked: boolean;
  /** Current like count, already reflecting `liked`. */
  likesCount: number;
}

/** Full map of video id -> like state. */
export type LikesMap = Record<string, LikeState>;

/** Absolute path to the writable JSON store (repo root, outside src/). */
const STORE_PATH = path.join(process.cwd(), "likes.store.json");

/**
 * In-process mutex. Because each request does a read-modify-write cycle, we
 * serialize all store access through a single promise chain to avoid lost
 * updates between concurrent requests in the same Node process. This is good
 * enough for a single-instance demo (it does not guard against multiple
 * processes writing the same file).
 */
let writeLock: Promise<unknown> = Promise.resolve();

/** Runs `task` after any in-flight store operation completes. */
function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = writeLock.then(task, task);
  // Keep the chain alive but swallow errors so one failure doesn't poison the lock.
  writeLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

/** Builds the default map seeded from mock videos (liked: false). */
function seedFromMocks(): LikesMap {
  const seed: LikesMap = {};
  for (const video of mockVideos) {
    seed[video.id] = { liked: false, likesCount: video.likesCount };
  }
  return seed;
}

/** Type guard for a single persisted LikeState entry. */
function isLikeState(value: unknown): value is LikeState {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.liked === "boolean" && typeof entry.likesCount === "number"
  );
}

/** Persists the given map to disk (pretty-printed for easy inspection). */
async function writeStore(map: LikesMap): Promise<void> {
  await fs.writeFile(STORE_PATH, JSON.stringify(map, null, 2), "utf-8");
}

/**
 * Reads the store from disk. If the file is missing or unreadable/corrupt,
 * seeds it from the mock videos and writes the seed back out.
 */
async function readStore(): Promise<LikesMap> {
  let raw: string;
  try {
    raw = await fs.readFile(STORE_PATH, "utf-8");
  } catch {
    // File does not exist yet (or cannot be read): seed and persist.
    const seed = seedFromMocks();
    await writeStore(seed);
    return seed;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt JSON: rebuild from seed.
    const seed = seedFromMocks();
    await writeStore(seed);
    return seed;
  }

  if (typeof parsed !== "object" || parsed === null) {
    const seed = seedFromMocks();
    await writeStore(seed);
    return seed;
  }

  // Normalize: keep only valid entries, and backfill any mock videos that
  // are missing from the file (e.g. new videos added since last write).
  const map: LikesMap = {};
  for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (isLikeState(value)) map[id] = value;
  }

  let mutated = false;
  for (const video of mockVideos) {
    if (!map[video.id]) {
      map[video.id] = { liked: false, likesCount: video.likesCount };
      mutated = true;
    }
  }
  if (mutated) await writeStore(map);

  return map;
}

/** Returns the full likes map. */
export function getAllLikes(): Promise<LikesMap> {
  return withLock(readStore);
}

/**
 * Toggles the like state for `id`, persists the change, and returns the new
 * state. Throws if the id is unknown so the route can map it to a 404.
 */
export function toggleLike(id: string): Promise<LikeState> {
  return withLock(async () => {
    const map = await readStore();
    const current = map[id];
    if (!current) {
      throw new UnknownVideoError(id);
    }

    const liked = !current.liked;
    const likesCount = current.likesCount + (liked ? 1 : -1);
    const next: LikeState = { liked, likesCount };

    map[id] = next;
    await writeStore(map);
    return next;
  });
}

/** Thrown by `toggleLike` when the video id is not present in the store. */
export class UnknownVideoError extends Error {
  constructor(id: string) {
    super(`Unknown video id: ${id}`);
    this.name = "UnknownVideoError";
  }
}
