import type { Metadata } from "next";
import { ProfileView } from "@/components/ProfileView";
import { mockVideos } from "@/data/mockVideos";

export const metadata: Metadata = {
  title: "Hồ sơ",
};

export default function ProfilePage() {
  return <ProfileView videos={mockVideos} />;
}
