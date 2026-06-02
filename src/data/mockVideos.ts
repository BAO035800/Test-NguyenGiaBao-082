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
    likesCount: 1284,
  },
  {
    id: "2",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    authorName: "@sintel",
    description: "Trailer phim hoạt hình Sintel đầy cảm xúc ⚔️",
    likesCount: 9532,
  },
  {
    id: "3",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    authorName: "@elephantsdream",
    description: "Giấc mơ của loài voi — một thế giới siêu thực 🐘✨",
    likesCount: 4410,
  },
  {
    id: "4",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    authorName: "@chromecast",
    description: "Cùng bùng cháy với những khoảnh khắc rực lửa 🔥",
    likesCount: 762,
  },
  {
    id: "5",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    authorName: "@funtime",
    description: "Niềm vui không có giới hạn, xem là ghiền 🎉",
    likesCount: 18230,
  },
];
