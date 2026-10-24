# coltexeditor.github.io

The website of [ColTex](https://github.com/Lewen-Cai/coltex), a self-hosted collaborative LaTeX editor with a built-in AI agent: <https://coltexeditor.github.io>.

- **Home page** in ColTex's 14 interface languages, with a tour of ColTex playing at the top.
- **Documentation**: ColTex's own help, in every language.
- **Demo** (`/demo/`): ColTex's real web app running in the browser, with nothing on a server.
- **`/install.sh`**: the installer of the latest release, for `curl -fsSL https://coltexeditor.github.io/install.sh | bash`.

## How it is built

The site is [Astro](https://astro.build). The installer, the documentation and the version come from ColTex's latest `vX.Y.Z` tag (`scripts/sync.mjs`, a sparse checkout run before every build), so a new release reaches the site without a change here.

The demo is ColTex's web app at the version in `demo/VERSION`, built by `scripts/demo.mjs` from a checkout of that tag with `demo/` copied in:

- `demo/src/mock/` answers the app's `/api` requests in the browser (`window.fetch` and `EventSource` are wrapped before the app starts): people, projects, comments, history, the AI agent's steps and drafts, settings and administration, all made up.
- `demo/src/collab.ts` replaces the collaboration module: the documents live in the tab.
- `demo/project/` is the sample paper. Every state of it the tour makes was built in ColTex's compiler image (`scripts/demo-compile.mjs`); the PDFs and diagnostics are in `demo/compiled/`. Other text can't be compiled in the demo.
- `demo/src/tour.ts` is the tour (`/demo/?tour`), played on the real interface.

Nothing is sent anywhere: the demo has no server, no accounts and no model; everything resets on reload.

```sh
pnpm install
node scripts/demo.mjs   # the demo into public/demo (needs git and network)
pnpm dev                # http://localhost:4321
pnpm build              # dist/
```

`.github/workflows/pages.yml` builds and publishes the site on every push to `main`, and every hour when ColTex has a newer release than the site shows.

## Licence

AGPL-3.0, like ColTex: the demo is ColTex's web app (including code ported from Overleaf, AGPL-3.0) together with `demo/`, and this repository is its source. ColTex's [NOTICE](https://github.com/Lewen-Cai/coltex/blob/main/NOTICE) lists the code it ports from others.
