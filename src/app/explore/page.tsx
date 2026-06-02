import type { Metadata } from "next";
import { ExploreView } from "@/components/ExploreView";
import { mockVideos } from "@/data/mockVideos";

export const metadata: Metadata = {
  title: "Khám phá",
};

export default function ExplorePage() {
  return <ExploreView videos={mockVideos} />;
}
