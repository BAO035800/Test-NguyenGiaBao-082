"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";

interface ActionBarProps {
  /** Whether the current user liked this video. */
  liked: boolean;
  /** Like count to display (already reflects the liked state). */
  likeCount: number;
  /** Whether a like request is in flight (disables the button). */
  likePending: boolean;
  /** Toggle handler for the like button. */
  onToggleLike: () => void;
}

/** Formats large numbers compactly, e.g. 18230 -> "18.2K". */
function formatCount(count: number): string {
  if (count < 1000) return String(count);
  if (count < 1_000_000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

/**
 * Right-aligned vertical stack of engagement actions for a video card.
 */
export function ActionBar({
  liked,
  likeCount,
  likePending,
  onToggleLike,
}: ActionBarProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Like */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={onToggleLike}
          disabled={likePending}
          aria-pressed={liked}
          aria-busy={likePending}
          aria-label={liked ? "Bỏ thích" : "Thích"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Heart
            className={`h-7 w-7 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
        <span className="text-xs font-semibold text-white drop-shadow">
          {formatCount(likeCount)}
        </span>
      </div>

      {/* Comment */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label="Bình luận"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-transform hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
        <span className="text-xs font-semibold text-white drop-shadow">
          Bình luận
        </span>
      </div>

      {/* Share */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label="Chia sẻ"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-transform hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Share2 className="h-7 w-7" />
        </button>
        <span className="text-xs font-semibold text-white drop-shadow">
          Chia sẻ
        </span>
      </div>
    </div>
  );
}
