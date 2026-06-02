"use client";

import { useState } from "react";
import type { Video } from "@/types/video";
import { VideoCard } from "@/components/VideoCard";

interface VideoFeedProps {
  videos: Video[];
}

/**
 * Vertical scroll-snap feed. Each card snaps one-at-a-time to full screen.
 * Mute state is shared across all cards so toggling once applies everywhere.
 */
export function VideoFeed({ videos }: VideoFeedProps) {
  const [muted, setMuted] = useState(true);

  return (
    <div className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth no-scrollbar bg-black">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          muted={muted}
          onToggleMuted={() => setMuted((prev) => !prev)}
        />
      ))}
    </div>
  );
}
