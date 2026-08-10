import { NextResponse } from "next/server";
import { savePass } from "@/lib/passStore";

export const runtime = "nodejs";

const MAX_DATA_URL_CHARS = 5_500_000;

function parseDataUrl(value: unknown): { type: string; buffer: Buffer } | null {
  const raw = String(value || "");
  if (!raw.startsWith("data:image/") || raw.length > MAX_DATA_URL_CHARS) return null;
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(raw);
  if (!match) return null;
  return { type: match[1], buffer: Buffer.from(match[2], "base64") };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Only the ID card / PFP frame — never the wide OG composite banner.
    const card = parseDataUrl(body.imageBase64);

    if (!card) {
      return NextResponse.json(
        { error: "A generated image is required" },
        { status: 400 }
      );
    }

    const name = String(body.name || "").trim().slice(0, 60);
    const title = String(body.title || "").trim().slice(0, 80);
    const mode = body.mode === "pfp" ? "pfp" : "id";

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const id = await savePass({
      card: card.buffer,
      contentType: card.type,
      meta: { name, title, mode },
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Share save failed", error);
    return NextResponse.json(
      {
        error:
          "Could not prepare the share link. Try Download, then attach the image on X.",
      },
      { status: 500 }
    );
  }
}
