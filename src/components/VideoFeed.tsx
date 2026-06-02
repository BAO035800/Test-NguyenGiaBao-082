"use client";

import { useState } from "react";
import type { Video } from "@/types/video";
import { VideoCard } from "@/components/VideoCard";
import { useLikes } from "@/hooks/useLikes";

interface VideoFeedProps {
  videos: Video[];
}

/**
 * Vertical scroll-snap feed. Each card snaps one-at-a-time to full screen.
 * Mute state is shared across all cards so toggling once applies everywhere.
 * Like state is loaded from / persisted to the backend via `useLikes`.
 */
export function VideoFeed({ videos }: VideoFeedProps) {
  const [muted, setMuted] = useState(true);
  const { likes, toggleLike, isPending } = useLikes(videos);

  return (
    <div className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth no-scrollbar bg-black">
      {videos.map((video) => {
        // Fall back to the mock base if server state hasn't loaded for this id.
        const likeState = likes[video.id] ?? {
          liked: false,
          likesCount: video.likesCount,
        };

        return (
          <VideoCard
            key={video.id}
            video={video}
            muted={muted}
            onToggleMuted={() => setMuted((prev) => !prev)}
            liked={likeState.liked}
            likeCount={likeState.likesCount}
            likePending={isPending(video.id)}
            onToggleLike={() => toggleLike(video.id)}
          />
        );
      })}
    </div>
  );
}
