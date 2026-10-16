# Warden site

A responsive marketing site and field guide for Warden, a local AI activity companion for macOS. Built with React, TypeScript, and Vite. The public site uses only synthetic example data; it never captures the visitor’s screen.

## Develop

Use Node.js 22.12+ (Node 24 LTS recommended).

```sh
npm ci
npm run dev
```

Open the URL Vite prints, including the `/warden-site/` base path.

```sh
npm run build
npm run preview
```

The build runs strict TypeScript checks and creates the static `dist/` directory. React, icons, scripts, and font files are bundled locally. There are no runtime CDN dependencies, analytics, or remote form/API submissions. Interactive examples use only local page state.

## Publish on GitHub Pages

The repository is designed for `https://sepezho.github.io/warden-site/`. Vite’s `base` is `/warden-site/` in `vite.config.ts`. If the repository name or hosting path changes, update that value.

The GitHub Actions workflow in `.github/workflows/pages.yml` builds and deploys from `main`. In the repository settings, select **Pages → Source → GitHub Actions**. Push to `main` or run the workflow manually. Only the built static files are published.

## Content and interactions

- A synthetic product example has keyboard-accessible Overview, History, Memory, and Models tabs.
- Overview shows five time categories with explanations and expandable timeline episodes.
- The daily-intention example updates the Overview locally in page state. Refreshing resets it.
- History filters an example OCR archive and displays an honest empty state.
- Memory provides topic selection, zoom, rotation, and fit controls.
- Models explains the three default model roles without pretending to perform downloads.
- The field guide includes installation requirements, goal score semantics, model management, permissions, optional Asana, and data retention.
- The setup copy button uses the Clipboard API and provides a manual-copy message if unavailable.
- Mobile navigation, documentation chapters, and FAQ controls have accessible states. Motion respects `prefers-reduced-motion`.

## Accuracy and source access

The current Warden app repository requires source access. This site does not claim a public app download, an app license, or a verified binary release. Its setup command is explicitly for people with repository access. Review this wording if a public release becomes available.

Product claims were checked against the Warden working tree on October 16, 2026. Warden’s analysis is local; dependency/model downloads and explicitly connected Asana use the network. Docker Desktop and Ollama may have separate update or analytics settings. Deleting stored screenshot images does not also delete retained OCR, history, or AI memory.

Demo time values are illustrative, not measurements from a user. The overview’s 192 on-focus minutes out of 266 recorded minutes rounds to 72%. No customer counts, benchmark claims, or testimonials are invented.

## Design references

The site uses a restrained ivory, ink, and green palette, self-hosted DM Sans and Instrument Serif, and a product-led narrative. Official references informed the structure, not copied assets or copy:

- [Linear](https://linear.app/) — demonstrate the product early and connect capabilities to real workflows.
- [Raycast](https://www.raycast.com/) — make a Mac utility tangible through concrete interactions.
- [Apple: Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy) — explain access and controls in context.
- [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — arrow-key navigation and selected-panel relationships.

All product illustrations are authored in HTML, CSS, and SVG. Fonts are packaged from Fontsource; their license files are included in `public/licenses/` and the published build.
