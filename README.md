# Warden landing

A concise product site for Warden: set a daily task, see how much recorded time went toward it, and review where the rest of the day went.

Built with React, TypeScript, and Vite. All activity shown on the site is synthetic example data; the website does not capture screens or call the Warden backend.

## Development

Use Node.js 24, matching `.nvmrc` and CI (Vite requires at least Node.js 22.12).

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

The build type-checks the project and writes static files to `dist/`. The Vite base is relative (`./`), so the same build can be hosted at a domain root or a repository subpath. Fonts and icons are bundled locally.

Repository: [sepezho/warden-landing](https://github.com/sepezho/warden-landing). Work lives on `main`.

## CI and GitHub Pages

[CI and deployment runs](https://github.com/sepezho/warden-landing/actions/workflows/pages.yml)

Pull requests run a locked dependency install, Prettier validation, TypeScript checking, and a production build. Pull requests never deploy. Pushes to `main` run the same checks and publish only the resulting `dist/` artifact through GitHub's official Pages actions. The workflow can also be run manually from Actions.

**One-time owner setup:** in [Settings → Pages](https://github.com/sepezho/warden-landing/settings/pages), set **Source → GitHub Actions**. A collaborator with write access cannot necessarily enable Pages. After enabling it, rerun the workflow. If the `github-pages` environment requires approval, approve the deployment there.

The default deployment URL is **https://sepezho.github.io/warden-landing/**. This URL becomes available only after a successful deployment; a green build alone does not mean publication succeeded. No custom domain is configured.

Actions are pinned to commit SHAs. The build has read-only repository access; only the deployment job has `pages: write` and `id-token: write`. No personal access token or repository secret is required. Production deployments are serialized rather than cancelled midway.

Run the CI checks locally before pushing:

```sh
npm ci
npm run format:check
npm run build
```

To roll back, revert the unwanted source commit on `main`; CI will rebuild and deploy that revision. Do not publish the source directory or commit `dist/`.

## Design and behavior

- One interactive daily summary, concise feature descriptions, and expandable product details.
- Light and dark themes, a system preference, and a locally saved theme choice.
- Responsive layout, keyboard controls, visible focus, and reduced-motion support.
- The same green W mark used in the native Warden app.
- No analytics, remote form submissions, or runtime CDN dependencies.

The score is the share of recorded active time related to the chosen task, not a measurement of work quality. Example values are illustrative. Local AI can misclassify activity. The current native app requires Apple Silicon, macOS 26+, and source access; there is no public binary download linked here.

Deleting screenshot images in Warden retains recognized text, activity history, and AI memory. Model and dependency downloads, and an optional connected Asana account, use the network; screen analysis runs locally.

## Design references

The redesign applies clear product descriptions, concrete examples, and less visual noise:

- [Nielsen Norman Group: homepage usability](https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/)
- [Linear: a calmer interface](https://linear.app/now/behind-the-latest-design-refresh)
- [Vitsœ: Dieter Rams’ principles of good design](https://www.vitsoe.com/us/about/good-design)

Font license files are included in `public/licenses/` and the built site.
