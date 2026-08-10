import type { Metadata } from "next";
import SharePassView from "@/components/SharePassView";
import { getBaseUrl } from "@/lib/baseUrl";
import { loadPass } from "@/lib/passStore";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const base = await getBaseUrl();
  const imageUrl = `${base}/api/share/${id}/image`;

  try {
    const pass = await loadPass(id);
    if (pass) {
      const title = `${pass.meta.name} — HH Goa 2026 Signal Pass`;
      const description =
        pass.meta.mode === "pfp"
          ? `${pass.meta.name} locked a PFP frame for Hacker House Goa 2026. #FrameInGoa`
          : `${pass.meta.title ? `${pass.meta.title} · ` : ""}${pass.meta.name} · #FrameInGoa`;
      const isPfp = pass.meta.mode === "pfp";

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `${base}/s/${id}`,
          images: [
            {
              url: imageUrl,
              width: isPfp ? 1080 : 760,
              height: isPfp ? 1080 : 1165,
              alt: title,
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [imageUrl],
        },
      };
    }
  } catch {
    /* Blobs may be unavailable during metadata — page still loads via API. */
  }

  return {
    title: "HH Goa 2026 Signal Pass",
    description: "Builder ID / PFP frame · #FrameInGoa",
    openGraph: {
      images: [{ url: imageUrl, width: 760, height: 1165 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}

export default async function SharePassPage({ params }: Props) {
  const { id } = await params;
  return <SharePassView id={id} />;
}
