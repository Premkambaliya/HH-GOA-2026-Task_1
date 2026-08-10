import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type PassMeta = {
  name: string;
  title: string;
  mode: "id" | "pfp";
  createdAt: string;
};

export type StoredPass = {
  id: string;
  meta: PassMeta;
  card: Buffer;
  og: Buffer;
  contentType: string;
};

const LOCAL_ROOT = path.join(process.cwd(), ".data", "passes");

function newId() {
  return randomBytes(12).toString("hex");
}

function onNetlify() {
  return Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_BLOBS_CONTEXT ||
      process.env.NETLIFY_DEV
  );
}

async function saveLocal(
  id: string,
  card: Buffer,
  meta: PassMeta,
  contentType: string
) {
  const dir = path.join(LOCAL_ROOT, id);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "card.bin"), card);
  // Keep og.bin as a copy for older readers.
  await fs.writeFile(path.join(dir, "og.bin"), card);
  await fs.writeFile(
    path.join(dir, "meta.json"),
    JSON.stringify({ ...meta, contentType })
  );
}

async function loadLocal(id: string): Promise<StoredPass | null> {
  try {
    const dir = path.join(LOCAL_ROOT, id);
    const raw = await fs.readFile(path.join(dir, "meta.json"), "utf8");
    const parsed = JSON.parse(raw) as PassMeta & { contentType?: string };
    const card = await fs.readFile(path.join(dir, "card.bin"));
    let og = card;
    try {
      og = await fs.readFile(path.join(dir, "og.bin"));
    } catch {
      /* card-only is fine */
    }
    return {
      id,
      meta: {
        name: parsed.name,
        title: parsed.title,
        mode: parsed.mode === "pfp" ? "pfp" : "id",
        createdAt: parsed.createdAt,
      },
      card,
      og,
      contentType: parsed.contentType || "image/jpeg",
    };
  } catch {
    return null;
  }
}

async function getBlobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("passes");
}

async function saveBlobs(
  id: string,
  card: Buffer,
  meta: PassMeta,
  contentType: string
) {
  const store = await getBlobStore();
  // Copy into a standalone ArrayBuffer (Netlify Blobs rejects TypedArray views).
  const bytes = new Uint8Array(card);
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  );

  await Promise.all([
    store.set(`pass/${id}/card`, ab, { metadata: { contentType } }),
    store.setJSON(`pass/${id}/meta`, { ...meta, contentType }),
  ]);
}

async function loadBlobs(id: string): Promise<StoredPass | null> {
  try {
    const store = await getBlobStore();
    const meta = (await store.get(`pass/${id}/meta`, {
      type: "json",
    })) as (PassMeta & { contentType?: string }) | null;
    if (!meta) return null;

    let card = await store.get(`pass/${id}/card`, { type: "arrayBuffer" });
    // Older shares stored a separate og blob — fall back to it.
    if (!card) {
      card = await store.get(`pass/${id}/og`, { type: "arrayBuffer" });
    }
    if (!card) return null;

    const buf = Buffer.from(card);
    return {
      id,
      meta: {
        name: meta.name,
        title: meta.title,
        mode: meta.mode === "pfp" ? "pfp" : "id",
        createdAt: meta.createdAt,
      },
      card: buf,
      og: buf,
      contentType: meta.contentType || "image/jpeg",
    };
  } catch (error) {
    console.error("Blob load failed", error);
    return null;
  }
}

export async function savePass(input: {
  card: Buffer;
  og?: Buffer;
  meta: Omit<PassMeta, "createdAt">;
  contentType: string;
}): Promise<string> {
  const id = newId();
  const meta: PassMeta = { ...input.meta, createdAt: new Date().toISOString() };

  if (onNetlify()) {
    try {
      await saveBlobs(id, input.card, meta, input.contentType);
      return id;
    } catch (error) {
      console.error("Blob save failed, falling back to local", error);
    }
  }

  await saveLocal(id, input.card, meta, input.contentType);
  return id;
}

export async function loadPass(id: string): Promise<StoredPass | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;

  if (onNetlify()) {
    const fromBlobs = await loadBlobs(id);
    if (fromBlobs) return fromBlobs;
  }

  return loadLocal(id);
}
