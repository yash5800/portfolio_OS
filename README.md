# pixelify.me — desktop portfolio

A macOS-inspired desktop portfolio: glass windows, a magnifying dock, desktop
icons, spotlight search and a working terminal. Built with React 19, Vite and
Tailwind CSS 4.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview the build
npm run lint
```

## Everything is data

All content lives in `src/data/*.json`. Edit a file, save, and the desktop
updates — no component changes needed for content.

| File | What it controls |
| --- | --- |
| `src/data/site.json` | Brand, logo, boot screen, desktop icons, dock, welcome copy |
| `src/data/profile.json` | Name, role, bio, avatar, stats, skills, social links |
| `src/data/projects.json` | Project list + image base URL |
| `src/data/packages.json` | npm packages, install command, usage snippet |
| `src/data/wallpapers.json` | Gradient and image wallpapers + default |
| `src/data/apps.json` | App titles, icons, tints, window sizes, dock visibility |

### Add a project

Append an object to `items` in `src/data/projects.json`:

```json
{
  "title": "My next project",
  "description": "One paragraph, or use { \"head\", \"points\", \"footer\" }.",
  "duration": { "start": "Nov 2026", "end": "Dec 2026" },
  "liveLink": "https://example.com",
  "github": "https://github.com/you/repo",
  "images": ["screenshot.png"],
  "skills": ["React", "Node.js"],
  "contributors": [{ "name": "You", "role": "Developer" }]
}
```

`images` are resolved against `imageBase` (currently the raw GitHub content
path). A missing image is hidden instead of showing a broken icon.

### Add a package

Append to `src/data/packages.json` with `name`, `version`, `description`,
`install`, `usage`, `npmUrl`, optional `downloadsBadge` and `tags`.

### Add a wallpaper

Add to `items` in `src/data/wallpapers.json`:

```json
{ "id": "graphite", "name": "Graphite", "type": "gradient",
  "value": "radial-gradient(...), linear-gradient(...)" }
```

or point at a file in `public/wallpapers`:

```json
{ "id": "harbour", "name": "Harbour", "type": "image", "src": "wallpapers/8.webp" }
```

Change `default` to the id that should load first.

### Add a desktop icon or dock item

In `src/data/site.json`:

```json
{ "id": "resume", "label": "Résumé", "icon": "folder",
  "action": { "type": "link", "href": "https://example.com/resume.pdf" } }
```

- `icon` can be an app id (`projects`, `terminal`, `settings`, `about`,
  `contact`, `packages`), the special `brand` logo, or any key from
  `src/libs/iconMap.js`.
- `action.type` is `"app"` with an `app` id, or `"link"` with an `href`.
- Dock items support `{ "type": "app", "app": "..." }`,
  `{ "type": "link", ... }` and `{ "type": "divider" }`.
- An app with `"dock": true` in `apps.json` is added to the dock
automatically, just left of the first divider (before the GitHub link).

### Add an entirely new app

1. Add metadata to `src/data/apps.json` (`id`, `title`, `icon`, `tint`, `size`,
   `dock`, optional `hidden`).
2. Create the component in `src/apps/YourApp.jsx` (it receives `payload` and
   `windowId`).
3. Register it in `src/apps/registry.jsx`.
4. Optionally reference the app id from `site.json` desktop icons or dock.

## Desktop features

- **Window manager** — drag, resize, maximize, minimize and close with spring
  animations; windows keep their state when minimized.
- **Dock** — distance-based magnification, launch bounce, running indicators,
  click to focus or restore.
- **Spotlight** — `Ctrl`/`Cmd` + `K`, searches apps, projects, packages and
  actions. Arrow keys + `Enter`.
- **Terminal** — `help`, `projects`, `project <name>`, `open <app>`,
  `wallpaper <id>`, `theme <id>`, `neofetch`, `history`, and more.
- **Settings** — wallpaper, accent color and reduce-motion toggle, stored in
  `localStorage`.
- **Installable PWA** — `public/manifest.webmanifest` + `public/sw.js` ship the
  app under the name **pixelify.me** with its own logo, so it can be installed
  to the desktop or home screen.

## Deployment

`vite.config.js` defaults `base` to `/portfolio_OS/` for the existing GitHub
Pages deployment. Build for a root domain (e.g. pixelify.me) with:

```bash
VITE_BASE=/ npm run build
```

## Brand assets

`public/brand/pixelify.svg` is the source mark; PNGs for the manifest and
apple-touch icon are generated from it.

```bash
cd public/brand
magick -background none pixelify.svg -resize 512x512 pixelify-512.png
magick -background none pixelify.svg -resize 192x192 pixelify-192.png
magick -background none pixelify.svg -resize 180x180 apple-touch-icon.png
magick -size 512x512 xc:'#070b14' \( pixelify.svg -resize 410x410 \) \
  -gravity center -composite pixelify-maskable-512.png
```
