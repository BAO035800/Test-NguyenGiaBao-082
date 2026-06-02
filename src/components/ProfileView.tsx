"use client";

import { Heart } from "lucide-react";
import type { Video } from "@/types/video";

interface ProfileViewProps {
  /** Videos shown in the profile's thumbnail grid. */
  videos: Video[];
}

/** A single fake profile stat (label + value). */
interface ProfileStat {
  label: string;
  value: string;
}

const PROFILE_STATS: ProfileStat[] = [
  { label: "Đang theo dõi", value: "128" },
  { label: "Người theo dõi", value: "8.4K" },
  { label: "Lượt thích", value: "92.1K" },
];

/** Display name and handle for the mock profile. */
const DISPLAY_NAME = "Nguyễn Gia Bảo";
const USERNAME = "@nguyengiabao";
const BIO = "Nhà sáng tạo nội dung 🎬 · Yêu công nghệ & du lịch ✈️";

/** Builds avatar initials from a display name (max 2 chars). */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Mock profile page ("Hồ sơ").
 * - Placeholder avatar (initials), display name, handle, bio.
 * - Fake stats row + non-functional "Chỉnh sửa hồ sơ" button.
 * - Grid of the user's video thumbnails (reuses mock videos).
 */
export function ProfileView({ videos }: ProfileViewProps) {
  const initials = getInitials(DISPLAY_NAME);

  return (
    <div className="h-[100dvh] w-full overflow-y-auto bg-black pb-24 text-white md:pb-8">
      <div className="mx-auto w-full max-w-3xl px-4 pt-6">
        {/* Header label. */}
        <h1 className="text-xl font-bold">Hồ sơ</h1>

        {/* Profile header. */}
        <div className="mt-4 flex flex-col items-center text-center">
          {/* Placeholder avatar with initials. */}
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-2xl font-bold text-white"
            aria-hidden="true"
          >
            {initials}
          </div>

          <p className="mt-3 text-lg font-bold">{USERNAME}</p>
          <p className="text-sm text-white/60">{DISPLAY_NAME}</p>
          <p className="mt-2 max-w-md text-sm text-white/80">{BIO}</p>

          {/* Stats row. */}
          <dl className="mt-4 flex items-center gap-8">
            {PROFILE_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-lg font-bold">{stat.value}</dd>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </dl>

          {/* Mock "Edit profile" button. */}
          <button
            type="button"
            className="mt-5 rounded-lg border border-white/20 bg-white/5 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>

        {/* User's video thumbnail grid. */}
        <h2 className="mt-8 text-sm font-semibold text-white/70">Video</h2>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {videos.map((video) => (
            <li key={video.id}>
              <article className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-white/5">
                <video
                  src={video.videoUrl}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                  // No autoplay: acts as a static first-frame thumbnail.
                  tabIndex={-1}
                  aria-hidden="true"
                />

                {/* Gradient for legibility. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Like count overlay. */}
                <div className="pointer-events-none absolute bottom-1.5 left-1.5 flex items-center gap-1 text-xs font-semibold text-white drop-shadow">
                  <Heart className="h-3.5 w-3.5 fill-white" aria-hidden="true" />
                  <span>{video.likesCount}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
