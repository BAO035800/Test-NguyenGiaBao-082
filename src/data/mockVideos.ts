import type { Video } from "@/types/video";

/**
 * Static mock feed. Client-side only — no backend involved.
 * Video URLs are stable public sample assets.
 */
export const mockVideos: Video[] = [
  {
    id: "1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    authorName: "@bigbuckbunny",
    description: "Chú thỏ to lớn dạo chơi trong rừng xanh 🐰🌳",
    likesCount: 12,
  },
  {
    id: "2",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    authorName: "@fridayvibes",
    description: "Cuối tuần rồi, thư giãn thôi nào 🌆🚗",
    likesCount: 95,
  },
  {
    id: "3",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    authorName: "@sintel",
    description: "Trailer phim hoạt hình Sintel đầy cảm xúc ⚔️",
    likesCount: 40,
  },
];
