import { VideoFeed } from "@/components/VideoFeed";
import { NavBar } from "@/components/NavBar";
import { mockVideos } from "@/data/mockVideos";

export default function Home() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* Feed offset to leave room for the desktop sidebar (mobile uses bottom nav). */}
      <div className="h-full w-full md:pl-20 lg:pl-56">
        <VideoFeed videos={mockVideos} />
      </div>
      <NavBar />
    </main>
  );
}
