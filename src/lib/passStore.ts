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

async function saveLocal(
  id: string,
  card: Buffer,
  og: Buffer,
  meta: PassMeta,
  contentType: string
) {
  const dir = path.join(LOCAL_ROOT, id);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "card.bin"), card);
  await fs.writeFile(path.join(dir, "og.bin"), og);
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
    const og = await fs.readFile(path.join(dir, "og.bin"));
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

async function saveBlobs(
  id: string,
  card: Buffer,
  og: Buffer,
  meta: PassMeta,
  contentType: string
) {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore("passes");
  const cardBytes = Uint8Array.from(card);
  const ogBytes = Uint8Array.from(og);

  await Promise.all([
    store.set(`pass/${id}/card`, cardBytes.buffer, {
      metadata: { contentType },
    }),
    store.set(`pass/${id}/og`, ogBytes.buffer, {
      metadata: { contentType },
    }),
    store.setJSON(`pass/${id}/meta`, { ...meta, contentType }),
  ]);
}

async function loadBlobs(id: string): Promise<StoredPass | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("passes");
    const meta = (await store.get(`pass/${id}/meta`, {
      type: "json",
    })) as (PassMeta & { contentType?: string }) | null;
    if (!meta) return null;

    const [card, og] = await Promise.all([
      store.get(`pass/${id}/card`, { type: "arrayBuffer" }),
      store.get(`pass/${id}/og`, { type: "arrayBuffer" }),
    ]);
    if (!card || !og) return null;

    return {
      id,
      meta: {
        name: meta.name,
        title: meta.title,
        mode: meta.mode === "pfp" ? "pfp" : "id",
        createdAt: meta.createdAt,
      },
      card: Buffer.from(card),
      og: Buffer.from(og),
      contentType: meta.contentType || "image/jpeg",
    };
  } catch {
    return null;
  }
}

function onNetlify() {
  return Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_BLOBS_CONTEXT ||
      process.env.NETLIFY_DEV
  );
}

export async function savePass(input: {
  card: Buffer;
  og: Buffer;
  meta: Omit<PassMeta, "createdAt">;
  contentType: string;
}): Promise<string> {
  const id = newId();
  const meta: PassMeta = { ...input.meta, createdAt: new Date().toISOString() };

  if (onNetlify()) {
    await saveBlobs(id, input.card, input.og, meta, input.contentType);
  } else {
    await saveLocal(id, input.card, input.og, meta, input.contentType);
  }

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
