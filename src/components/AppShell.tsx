"use client";

import { useState } from "react";
import type { Video } from "@/types/video";
import type { TabKey } from "@/types/tab";
import { VideoFeed } from "@/components/VideoFeed";
import { ExploreView } from "@/components/ExploreView";
import { ProfileView } from "@/components/ProfileView";
import { NavBar } from "@/components/NavBar";

interface AppShellProps {
  /** Mock videos shared by every view. */
  videos: Video[];
}

/**
 * Client shell that owns the active-tab state and renders the matching view in
 * the main content area, plus the controlled NavBar.
 *
 * Views are conditionally rendered (the simplest correct approach): switching
 * away from Home unmounts the feed, which pauses its videos and tears down the
 * IntersectionObserver. Returning to Home re-mounts it and auto-play re-inits
 * cleanly.
 */
export function AppShell({ videos }: AppShellProps) {
  const [active, setActive] = useState<TabKey>("home");

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* Content offset to leave room for the desktop sidebar (mobile uses
          the bottom nav). Each view fills this area and scrolls internally. */}
      <div className="h-full w-full md:pl-20 lg:pl-56">
        {active === "home" && <VideoFeed videos={videos} />}
        {active === "explore" && <ExploreView videos={videos} />}
        {active === "profile" && <ProfileView videos={videos} />}
      </div>

      <NavBar active={active} onSelect={setActive} />
    </main>
  );
}
