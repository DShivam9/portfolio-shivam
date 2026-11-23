# Portfolio Rebuild Plan — Shivam Diwan

> **Workflow Rule**: Update this plan whenever new requirements arrive. Record only confirmed decisions — no guesswork. **Do not write/edit application code until explicitly told to code.**

---

## 1. Confirmed Requirements (What I Understood)

- **Workflow**: Go section by section. Never one-shot. **Only code when told to code.** Keep code clean, structured, minimal files (Ponytail).
- **Color Scheme**: Strict monochrome black & white only — deep obsidian black (`#060607`), surface (`#0E0E10`), soft off-white (`#F0F0F2`). No color accents.
- **Icons**: **`lucide-react` only** across the entire site (replace text badges like `GH`/`IN` with real Lucide icons).
- **Navbar**: **Blended seamlessly into the `max-w-3xl` hairline-rail layout** (sticky top bar whose vertical rails connect directly to the page rails — remove detached floating box).
- **Originality (No 1:1 Chanh Dai Clone)**:
  - Keep the calm, crisp monochrome architectural feeling, but **change the signature motifs** so it looks unmistakably Shivam's:
    - **Drop** the empty dot-grid `SD` banner.
    - **Drop** diagonal hatched (`///`) divider strips → replace with **precision `+` corner registration marks** at rail intersections + clean negative-space band (Swiss drafting aesthetic).
    - **Flip** the profile header composition: left-weighted editorial identity (name + blur-crossfade role + 1-line summary + live IST clock) with the portrait anchored cleanly in a **right** hairline column (instead of left-square-avatar clone).
    - **Photos**: Keep full natural color (NO grayscale/B&W filter). Cycle through all 4 photos in `public/about/` with a **quick, snappy circular `clip-path` iris animation** (`circle(0% at 50% 50%) → circle(75% at 50% 50%)`, `320ms` `--ease-out`, click-to-next + gentle interval).
    - **Tighten** Overview into a crisp horizontal 3-cell fact strip (Education, Copy Email, Resume PDF) + clean 3-cell Lucide icon link row (GitHub, LinkedIn, Phone/Email) instead of a 6-row clone grid.
- **Typography**: Drop Geist / Geist Mono. Target **Söhne** (primary sans) paired with **IBM Plex Mono** (crisp technical mono).
  - *Note*: Söhne is commercial (Klim Type Foundry, not on Google Fonts) and not in `public/fonts/` yet. If user provides `.woff2` files → wire via `next/font/local`. Otherwise fallback to closest free crisp neo-grotesque (`Instrument Sans` or `Hanken Grotesk`) + `IBM Plex Mono`.
- **Copy Voice**: Factual, concrete, human engineer tone with real resume metrics. Zero buzzwords or movie-character prose.
- **Motion (Emil Kowalski bar)**: Calm, smooth, organic micro-interactions (`cubic-bezier(0.23, 1, 0.32, 1)` `ease-out`, gliding nav highlight, blur-crossfades, smooth accordions). Zero 3D game-tilt, zero robotic wipes.

### Permanent Bans (Never Repeat)
- NO status dots / glowing "open to roles" pills.
- NO generic 50/50 left-text + right-photo dev-template hero.
- NO twin rounded-full CTA pills.
- NO detached floating navbar clashing with vertical rails.
- NO Chanh Dai 1:1 motifs (empty dot-grid monogram banner, diagonal `///` hatch dividers, text-initial `GH`/`IN` boxes).
- NO color accents.
- NO 3D pointer-tilt, NO robotic `ease-in-out` shutter wipes.

---

## 2. Locked Monochrome Palette

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#060607` | Main canvas (deep obsidian black) |
| `--color-surface` | `#0E0E10` | Floating bar / elevated frames |
| `--color-surface-hover` | `#17171A` | Interactive button/row hover |
| `--color-border` | `rgba(240, 240, 242, 0.09)` | Hairline vertical rails & section dividers |
| `--color-border-strong` | `rgba(240, 240, 242, 0.20)` | Floating bar & button borders |
| `--color-text` | `#F0F0F2` | Primary text & high-contrast fill |
| `--color-text-secondary` | `#9A9AA3` | Body copy & inactive nav buttons |
| `--color-text-muted` | `#5C5C66` | Dates, metadata, indices |

---

## 3. Preserved Assets & Source Data

- **Resume**: `public/MAIN_RESUME.pdf`
- **Personal Photos**: `public/about/` (`trip_photo_1.jpeg` + 3 photos)
- **Project Screenshots**: `public/projects/` (`retrorift.png`, `snipcast.png`, `heicstudio.png`)
- **Project Links**: `src/constants/projects.ts`
- **Profile / Socials**: `src/constants/profile.ts`

---

## 4. Section-by-Section Plan (Centered Hairline-Rail Architecture)

### Step 0 — Foundation & Blended Rail Navbar
- [x] Deep obsidian monochrome palette in `src/app/globals.css`.
- [ ] **Navbar**: Blend sticky navbar directly into the `max-w-3xl` vertical hairline rails (`sticky top-0`, continuous `border-x` + `border-b`, gliding spring hover highlight, Lucide icons, zero detached floating box).
- [ ] **Dividers**: Replace `.hatch-pattern` & `.dot-grid` with precision `+` corner registration marks (`SectionDivider.tsx`) at rail intersections + quiet negative-space spacer.

### Section 1 — Original Architectural Header + Fact Strip (No 1:1 Clone)
- [ ] Drop empty `SD` dot-grid banner.
- [ ] Asymmetric inside-rail header: Left = `Hyderabad, IN` + live IST clock, `Shivam Diwan` (`text-3xl sm:text-4xl`), blur-crossfade role line, 1-sentence grounded summary; Right = full-color portrait cell (`aspect-[4/5]`, zero grayscale) cycling all 4 `public/about/` photos via quick snappy `clip-path: circle()` reveal (`320ms` `--ease-out`, auto + click-to-cycle).
- [ ] Compact 3-cell fact row (GITAM B.Tech CSBS 9.0, 1-click Copy Email, Resume PDF) + 3-cell Lucide icon link bar (`Github`, `Linkedin`, `Phone`).
- [ ] Consolidate micro-files cleanly (Ponytail: keep file count lean, zero bloat).

### Section 2 — About
- [ ] Tight, factual 2–3 short paragraphs with bold key nouns (interface craft, full-stack systems, AI-assisted engineering) + clean monochrome photo strip from `public/about/` (optional toggle/strip — confirm with user).

### Section 3 — Projects
- [ ] Smooth collapsible accordion rows (first expanded by default) inside hairline rails:
  - **Abyss** (2026 – Present) — 23 copy-paste React components, Next.js, TypeScript, Tailwind, WebGL.
  - **RetroRift** (Jan – Apr 2026) — 50+ games, 100+ users, WebAssembly, IndexedDB async ZIP cache, Firebase Auth/Firestore.
  - **UK Wind Power Trading & Forecast Desk** (Sep 2026) — 1,488 half-hour periods, FastAPI + pandas + React + Docker, 25 pytest tests (82% coverage).
  - **Campusly** (2025 – 2026) — 4 user roles, 10+ tables, React, Node, Express, PostgreSQL, Prisma.
  - Optional "Show more" for SnipCast & HEIC Studio.
  - *(Need Live Site / GitHub URLs for Abyss & UK Wind Desk when we get to Section 3.)*

### Section 4 — Skills (Single Self-Contained Section)
- [ ] Clean single-frame grouped grid synced to `MAIN_RESUME.pdf` (Languages, Frameworks, Databases, AI Tools, DevOps) + AWS Cloud Practitioner Essentials certification row. Zero scroll bloat.

### Section 5 — Contact & Footer
- [ ] Direct, grounded closing block (email copy, GitHub, LinkedIn, Resume download) + minimal human footer line.
