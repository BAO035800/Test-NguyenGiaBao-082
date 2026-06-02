import { AppShell } from "@/components/AppShell";
import { mockVideos } from "@/data/mockVideos";

export default function Home() {
  // Server component: passes the mock data into the client shell, which owns
  // the active-tab state and switches between the feed / explore / profile views.
  return <AppShell videos={mockVideos} />;
}
