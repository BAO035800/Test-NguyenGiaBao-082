"use client";

import { useMemo } from "react";
import { Search, Heart } from "lucide-react";
import type { Video } from "@/types/video";

interface ExploreViewProps {
  /** Source videos used to build the discovery grid. */
  videos: Video[];
}

/** A single derived discovery tile (videos repeated to fill the grid). */
interface ExploreTile {
  /** Unique key for the tile (base id + repeat index). */
  key: string;
  video: Video;
  /** Mock like count, varied per tile so the grid looks alive. */
  likeCount: number;
}

/** Mock trending hashtags shown as chips (non-functional). */
const TRENDING_TAGS = [
  "xuhuong",
  "giaitri",
  "amnhac",
  "dulich",
  "anuong",
  "thucung",
];

/** Formats large counts as compact strings, e.g. 12500 -> "12.5K". */
function formatCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
}

/**
 * Mock discovery page ("Khám phá").
 * - Non-functional search bar + trending hashtag chips at the top.
 * - Responsive grid of tiles derived from the mock videos (repeated to fill).
 *
 * Tiles use muted, non-autoplaying <video> elements (preload metadata) so the
 * first frame acts as a thumbnail without playing offscreen audio.
 */
export function ExploreView({ videos }: ExploreViewProps) {
  // Derive ~12 tiles by repeating the source videos, varying mock like counts.
  const tiles = useMemo<ExploreTile[]>(() => {
    const TILE_COUNT = 12;
    const result: ExploreTile[] = [];
    for (let i = 0; i < TILE_COUNT; i += 1) {
      const video = videos[i % videos.length];
      result.push({
        key: `${video.id}-${i}`,
        video,
        // Deterministic pseudo-random count so it stays stable across renders.
        likeCount: video.likesCount * (i + 3) + i * 137,
      });
    }
    return result;
  }, [videos]);

  return (
    <div className="h-[100dvh] w-full overflow-y-auto bg-black pb-24 text-white md:pb-8">
      <div className="mx-auto w-full max-w-5xl px-4 pt-6">
        {/* Header label. */}
        <h1 className="text-xl font-bold">Khám phá</h1>

        {/* Mock search bar (non-functional). */}
        <div className="mt-4">
          <label htmlFor="explore-search" className="sr-only">
            Tìm kiếm
          </label>
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5">
            <Search className="h-5 w-5 shrink-0 text-white/60" aria-hidden="true" />
            <input
              id="explore-search"
              type="search"
              placeholder="Tìm kiếm video, người dùng, hashtag…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Trending hashtag chips. */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-white/70">Thịnh hành</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {TRENDING_TAGS.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  #{tag}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Discovery grid. */}
        <ul className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {tiles.map(({ key, video, likeCount }) => (
            <li key={key}>
              <article className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-white/5">
                <video
                  src={video.videoUrl}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                  // No autoplay: acts as a static first-frame thumbnail.
                  tabIndex={-1}
                  aria-hidden="true"
                />

                {/* Gradient for legibility of overlaid text. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Like count overlay (bottom-left). */}
                <div className="pointer-events-none absolute bottom-1.5 left-1.5 flex items-center gap-1 text-xs font-semibold text-white drop-shadow">
                  <Heart className="h-3.5 w-3.5 fill-white" aria-hidden="true" />
                  <span>{formatCount(likeCount)}</span>
                </div>

                {/* Author name overlay (bottom). */}
                <p className="pointer-events-none absolute inset-x-1.5 bottom-6 truncate text-xs font-medium text-white/90 drop-shadow">
                  {video.authorName}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
