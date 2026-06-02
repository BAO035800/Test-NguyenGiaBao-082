import type { Metadata } from "next";
import { VideoFeed } from "@/components/VideoFeed";
import { mockVideos } from "@/data/mockVideos";

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default function Home() {
  // Server component: renders the (client) vertical scroll-snap feed. The
  // sidebar-offset content wrapper lives in the root layout.
  return <VideoFeed videos={mockVideos} />;
}
