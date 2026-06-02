# TikTok-style Vertical Video Feed

Ứng dụng feed video cuộn dọc kiểu TikTok, xây bằng **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS**.

## Tính năng

- **Cuộn dọc full-screen** với scroll-snap (mỗi video chiếm trọn màn hình; PC hiển thị khung 9:16 căn giữa).
- **Click vào video** để Play/Pause.
- **Auto-play khi cuộn** — video tự phát khi vào tầm nhìn, tự dừng khi cuộn qua (IntersectionObserver).
- **Nút Tim (Like)** đổi màu đỏ + tăng/giảm số like, **lưu bền qua API thật** (file JSON ở server).
- **Thanh điều hướng** responsive: sidebar trái trên PC, bottom nav trên mobile.

## Chạy dự án

```bash
pnpm install
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Logic Play/Pause khi cuộn trang

Tự động phát/dừng video dựa trên **[IntersectionObserver API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API)** — KHÔNG dùng `scroll` event polling (nặng và dễ giật).

**1. Hook `useInView`** ([src/hooks/useInView.ts](src/hooks/useInView.ts)) bọc IntersectionObserver, theo dõi 1 phần tử và trả về `inView = true` khi phần tử hiển thị **≥ 60%** viewport:

```ts
const observer = new IntersectionObserver(
  ([entry]) => {
    setInView(entry.isIntersecting && entry.intersectionRatio >= threshold); // threshold = 0.6
  },
  { threshold }
);
observer.observe(node);
```

**2. `VideoCard`** ([src/components/VideoCard.tsx](src/components/VideoCard.tsx)) dùng `inView` để điều khiển thẻ `<video>`:

```ts
const { ref: containerRef, inView } = useInView<HTMLDivElement>({ threshold: 0.6 });

useEffect(() => {
  if (inView) {
    el.play();            // cuộn tới → tự phát
  } else {
    el.pause();           // cuộn qua → dừng
    el.currentTime = 0;   // reset về đầu video
  }
}, [inView]);
```

**Tóm tắt luồng:**

1. Mỗi video card được IntersectionObserver theo dõi với `threshold: 0.6`.
2. Khi card chiếm **≥ 60%** viewport → `inView` chuyển `true` → `video.play()`.
3. Khi cuộn qua, độ hiển thị tụt dưới 60% → `inView` chuyển `false` → `video.pause()` và reset `currentTime = 0`.
4. Observer được `disconnect()` khi component unmount để tránh memory leak.

> Video được set `muted` + `playsInline` để trình duyệt không chặn autoplay; có nút bật/tắt tiếng riêng.

## Cấu trúc chính

```
src/
├── app/
│   ├── page.tsx              # Trang feed
│   └── api/likes/            # Route Handlers: GET map like, POST toggle like
├── components/
│   ├── VideoFeed.tsx         # Container scroll-snap
│   ├── VideoCard.tsx         # Video + overlay + auto play/pause
│   ├── ActionBar.tsx         # Tim / Bình luận / Chia sẻ
│   └── NavBar.tsx            # Sidebar (PC) / Bottom nav (mobile)
├── hooks/
│   ├── useInView.ts          # IntersectionObserver cho auto-play
│   └── useLikes.ts           # Đồng bộ trạng thái like với API
├── lib/likesStore.ts         # Đọc/ghi file JSON lưu like
└── data/mockVideos.ts        # Dữ liệu giả (3 video)
```

> Trạng thái like lưu ở `likes.store.json` (root, đã gitignore), seed từ `mockVideos.ts` ở lần gọi API đầu tiên. Đổi `likesCount` trong mock thì xoá file này để seed lại.
