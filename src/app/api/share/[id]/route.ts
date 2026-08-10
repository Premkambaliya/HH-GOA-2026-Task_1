import { NextResponse } from "next/server";
import { loadPass } from "@/lib/passStore";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** Meta for the share page — runs in a function so Netlify Blobs work reliably. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const pass = await loadPass(id);
  if (!pass) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    id: pass.id,
    name: pass.meta.name,
    title: pass.meta.title,
    mode: pass.meta.mode,
    contentType: pass.contentType,
    imageUrl: `/api/share/${id}/image`,
  });
}
