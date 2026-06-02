import { NextResponse } from "next/server";
import { getAllLikes } from "@/lib/likesStore";

// This handler reads/writes the filesystem, so it must run on Node, not Edge.
export const runtime = "nodejs";
// Like state is mutable per request — never cache or statically render it.
export const dynamic = "force-dynamic";

/**
 * GET /api/likes
 * Returns the full likes map: { [id]: { liked, likesCount } }.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const likes = await getAllLikes();
    return NextResponse.json(likes, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Không thể đọc trạng thái lượt thích." },
      { status: 500 }
    );
  }
}
