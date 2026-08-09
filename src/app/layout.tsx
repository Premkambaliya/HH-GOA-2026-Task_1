import type { Metadata } from "next";
import localFont from "next/font/local";
import { Imbue, Plus_Jakarta_Sans } from "next/font/google";
import { siteUrl } from "@/lib/baseUrl";
import "./globals.css";

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Imbue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const mono = localFont({
  src: [
    { path: "../../public/fonts/victor-mono-400.woff2", weight: "400" },
    { path: "../../public/fonts/victor-mono-500.woff2", weight: "500" },
    { path: "../../public/fonts/victor-mono-600.woff2", weight: "600" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "FrameInGoa · HH Goa 2026 Signal Pass",
  description:
    "Less noise. More signal. Upload a photo, get your Hacker House Goa 2026 Builder ID or PFP frame — download and share with #FrameInGoa.",
  openGraph: {
    title: "FrameInGoa · HH Goa 2026",
    description:
      "Official-feel Builder ID + PFP frame generator for Hacker House Goa 2026. #FrameInGoa",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameInGoa · HH Goa 2026",
    description:
      "Builder ID + PFP frame generator for Hacker House Goa 2026. #FrameInGoa",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
