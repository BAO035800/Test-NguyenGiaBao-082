"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import type { Video } from "@/types/video";
import { useInView } from "@/hooks/useInView";
import { ActionBar } from "@/components/ActionBar";

interface VideoCardProps {
  video: Video;
  /** Shared muted state across the feed. */
  muted: boolean;
  /** Toggles the shared muted state. */
  onToggleMuted: () => void;
  /** Whether the current user liked this video (server-backed). */
  liked: boolean;
  /** Current like count to display (already reflects `liked`). */
  likeCount: number;
  /** Whether a like toggle request is in flight (disables the button). */
  likePending: boolean;
  /** Toggles the like state (optimistic + persisted to the backend). */
  onToggleLike: () => void;
}

/**
 * A single full-screen video card with auto-play-on-scroll, tap-to-toggle
 * play/pause, like state, and a right-side action bar.
 */
export function VideoCard({
  video,
  muted,
  onToggleMuted,
  liked,
  likeCount,
  likePending,
  onToggleLike,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: containerRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.6,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play when the card scrolls into view; pause + reset when it leaves.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (inView) {
      const playPromise = el.play();
      // play() returns a promise that can reject if autoplay is blocked.
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [inView]);

  // Keep the shared muted state in sync with the actual element.
  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  /** Toggles play/pause via the video element (clicking the video). */
  const handleTogglePlay = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      el.pause();
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative flex h-[100dvh] w-full snap-start items-center justify-center bg-black"
    >
      {/* 9:16 frame: full-bleed on mobile, centered letterboxed frame on desktop. */}
      <div className="relative h-full w-full overflow-hidden bg-black md:h-[100dvh] md:w-auto md:aspect-[9/16]">
        {/* Clicking the video toggles play/pause. */}
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        >
          {/* Paused overlay icon. */}
          {!isPlaying && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Play
                className="h-20 w-20 fill-white/80 text-white/80 drop-shadow-lg"
                aria-hidden="true"
              />
            </span>
          )}
        </button>

        <video
          ref={videoRef}
          src={video.videoUrl}
          className="h-full w-full object-cover md:object-contain"
          loop
          muted={muted}
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Gradient overlay for legibility of bottom text. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Mute / unmute toggle. */}
        <button
          type="button"
          onClick={onToggleMuted}
          aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {muted ? (
            <VolumeX className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        {/* Author + description. */}
        <div className="absolute bottom-6 left-4 right-20 z-20 text-white">
          <p className="text-base font-bold drop-shadow">{video.authorName}</p>
          <p className="mt-1 text-sm leading-snug drop-shadow">
            {video.description}
          </p>
        </div>

        {/* Right-side action bar. */}
        <div className="absolute bottom-6 right-3 z-20">
          <ActionBar
            liked={liked}
            likeCount={likeCount}
            likePending={likePending}
            onToggleLike={onToggleLike}
          />
        </div>
      </div>
    </section>
  );
}
