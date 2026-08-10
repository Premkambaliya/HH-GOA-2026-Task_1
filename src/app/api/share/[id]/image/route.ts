import { NextResponse } from "next/server";
import { loadPass } from "@/lib/passStore";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const asDownload = new URL(request.url).searchParams.get("download") === "1";

  const pass = await loadPass(id);
  if (!pass) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Always serve the ID card / PFP frame alone.
  const bytes = pass.card;
  const slug =
    pass.meta.name.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-_]/g, "") ||
    "pass";
  const ext = pass.contentType.includes("png") ? "png" : "jpg";
  const fileName = `hh-goa-2026-${pass.meta.mode}-${slug}.${ext}`;

  const headers: Record<string, string> = {
    "Content-Type": pass.contentType,
    "Content-Length": String(bytes.byteLength),
    "Cache-Control": asDownload
      ? "no-store"
      : "public, max-age=31536000, immutable",
  };

  if (asDownload) {
    headers["Content-Disposition"] = `attachment; filename="${fileName}"`;
  }

  return new NextResponse(new Uint8Array(bytes), { headers });
}
