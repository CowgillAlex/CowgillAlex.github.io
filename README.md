# alexco.dev

Personal site built with SvelteKit 3, Svelte 5 and TypeScript. The static build is for GitHub Pages at `www.alexco.dev`.

## Development

Use Node 24, or Node 22.17 or newer.

```sh
nvm use
npm ci
npm run dev
```

`npm run check` checks TypeScript and Svelte. `npm test` checks the tool logic. `npm run build` creates `build/`, including redirects for the old tool URLs. `npm run preview` serves that output locally.

## Content

The main pages live in `src/routes/`. Home combines the introduction, public work and contact details; `/about/` redirects there. The home page intentionally stays short. Projects opens local pages at `/projects/tumbler/` and `/projects/paper-minecraft/`, each with an overview and external project links.

Add posts as `src/content/writing/a-post-slug.md`, with YAML frontmatter:

```yaml
---
title: A post title
description: A short description.
date: "2026-10-07"
draft: true
---
```

Write Markdown below the frontmatter. Set `draft: false` to include the post in the Writing list and prerender its page. Drafts are excluded from public output. The included example is a draft. Only trusted repository-authored Markdown is supported, including raw HTML.

The contextual table of contents collects the current page's h2 and h3 headings. It appears when there are at least two headings. At widths of 1024px and above, it stays beside the content and follows the page as you scroll. On narrower screens, an icon opens the overlay drawer. Main navigation always stays in the header.

Fonts are self-hosted in `static/fonts/`, with the supplied Switzer license. Dark mode is the default; the theme button saves an explicit preference in local storage.

The exam clock deliberately uses a separate minimal white page, with the time, local date and an editable centre number below it. Its light appearance does not change the saved site theme.

Tools also include the utilities from the former `19alexandercowgill.github.io` site: meta tags, UV coordinates, Markdown conversion, single-line text, DuckDuckGo lookup, the five NEA language tools, and the three neural-network experiments. Existing Markov and substitution cipher pages serve both sites' versions. Former `/misc/` and `/English/nea/` paths redirect to their new pages on this domain; the separate education domain is unchanged.

The language classifiers run in a worker and download their pinned Hugging Face models on the first analysis. TensorFlow loads only when training or loading a generator model. Image and video experiments train at 64 × 64 pixels, keep uploaded files local, and save models in IndexedDB. Their training curves show loss. The original image experiment's pixel-change measurement was not a confidence estimate and is not presented as one here.

## Existing files

The original HTML, scripts, assets and game submodule remain in the repository. SvelteKit uses `src/` and `static/`; it does not publish the root HTML files automatically.

The build copies the Scratch project archive to its original `/projects/scratch/` URLs, with its existing supporting assets and styles. Those pages retain their old presentation and analytics. The archive is not featured in the new Projects list. Its history remains separate from Java Paper Minecraft.

The rebuilt utilities have redirects from their old URLs. The discontinued widget, local Ollama page, old test page and old posts are retained in the repository and excluded from the new public build. The Java project changelogs and any new articles still need an editorial pass before being published here.

## GitHub Pages

The workflow checks pull requests and builds and deploys `master`. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Keep the existing custom domain `www.alexco.dev`. The build contains `CNAME`, `.nojekyll` and a SvelteKit `404.html` fallback.

No production deployment happens from the local development commands.
