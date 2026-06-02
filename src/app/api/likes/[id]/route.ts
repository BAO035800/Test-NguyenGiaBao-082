import { NextResponse } from "next/server";
import { toggleLike, UnknownVideoError } from "@/lib/likesStore";

// Filesystem access requires the Node runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  // Next.js 16 provides route params as a Promise.
  params: Promise<{ id: string }>;
}

/**
 * POST /api/likes/[id]
 * Toggles the like state for the given video id and returns the new
 * { liked, likesCount }. Responds 404 if the id is unknown.
 */
export async function POST(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;

  try {
    const result = await toggleLike(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof UnknownVideoError) {
      return NextResponse.json(
        { error: `Không tìm thấy video với id "${id}".` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Không thể cập nhật lượt thích." },
      { status: 500 }
    );
  }
}
