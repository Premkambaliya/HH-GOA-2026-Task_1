# FrameInGoa — HH Goa 2026 Signal Pass

Builder ID + PFP frame generator for the [Hacker House Goa 2026](https://hhgoa.com/) shortlisting task.
Upload a photo, get a branded graphic, download it or post it to X — **no login, no MongoDB**.

## Features

- **Format A:** Square PFP frame with selectable accent colors
- **Format B:** Residency Signal Pass ID card (name, stack, skills, generated builder title, QR)
- Photo pan, pinch-to-zoom, scroll-zoom and a zoom slider
- HEIC / HEIF (iPhone) support, converted in the browser
- Instant client-side rendering
- Download as a real PNG/JPEG on laptop, tablet, and phone
- Share to X with `#FrameInGoa`:
  - **Phones:** attaches the real image via the system share sheet
  - **Desktop:** stores the graphic in Netlify Blobs (or local `.data` in dev) and opens a pre-filled tweet whose link preview shows the graphic

## Setup

```bash
npm install
npm run dev
```

No `.env` required. Open http://localhost:3000

## Deploy to Netlify

1. Push to GitHub → Netlify **Import an existing project**
2. Build settings come from `netlify.toml` (Node 20, `npm run build`)
3. Optional: set `NEXT_PUBLIC_BASE_URL` to your live URL / custom domain
4. Deploy — Blobs are enabled automatically for the share preview

```bash
npm i -g netlify-cli
netlify init
netlify deploy --build --prod
```

## Required flow (covered)

1. Upload JPG / PNG / HEIC  
2. Fill name + stack fields (ID mode)  
3. Live preview updates instantly  
4. Download a real image file  
5. Share to X with pre-filled caption + `#FrameInGoa` and a working image preview  
6. No login / signup wall  
