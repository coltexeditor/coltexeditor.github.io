export default {
  meta: {
    title: 'ColTex: a self-hosted collaborative LaTeX editor',
    description:
      'ColTex is a self-hosted collaborative LaTeX editor with a built-in AI agent: an alternative to Overleaf that runs on your own server.',
  },
  nav: {
    docs: 'Docs',
    language: 'Language',
    theme: 'Switch between light and dark',
  },
  hero: {
    tagline: 'A self-hosted collaborative LaTeX editor with a built-in AI agent.',
    points: ['Your server', 'Your accounts', 'Your data', 'Real-time collaboration', 'Open source (AGPL-3.0)'],
    copy: 'Copy',
    copied: 'Copied',
    replay: 'Replay',
    github: 'View on GitHub',
  },
  install: {
    title: 'Install',
    steps: [
      'Run the command on a Linux or macOS machine with Docker. On Linux the installer can set Docker up.',
      'Pick the TeX Live edition with the arrow keys. The installer downloads the prebuilt images (x86-64 or ARM64) and starts ColTex.',
      'Open http://<server>:3690 and create the administrator account.',
    ],
    recommended: 'Recommended: 2 CPU cores and 4 GB of memory or more.',
  },
  docs: {
    title: 'Documentation',
    onThisPage: 'On this page',
  },
  tour: {
    chapters: ['Sign in', 'Workspace', 'Writing', 'Visual editor', 'Collaboration', 'AI agent', 'Review', 'References', 'History', 'Settings', 'Administration'],
    try: 'Try the demo',
    note: 'The demo runs entirely in your browser.',
  },
  why: {
    title: 'Why ColTex?',
    lead: 'ColTex is an alternative to Overleaf for a research group, a lab or just yourself, running on a computer you control: a desktop in the lab, a home server or a cloud machine.',
    items: [
      {
        title: 'Everything stays on your server',
        text: 'Projects, history, accounts and compile jobs never leave it. TeX runs in a sandboxed container without internet access.',
      },
      {
        title: 'Built for writing together',
        text: 'Several people edit the same file at once, with comments, track changes, chat and version history.',
      },
      {
        title: 'An AI agent that works on your project',
        text: 'It reads the files and the compile log, drafts changes, test-compiles them, and shows you a diff. Nothing is written until you apply it.',
      },
      {
        title: 'One command to install, no ports to open',
        text: 'Tailscale and Cloudflare Tunnel are built in for remote access.',
      },
    ],
  },
  features: {
    title: 'Features',
    groups: [
      {
        title: 'Writing and Compiling',
        items: [
          'Source editor and a visual editor with a table editor, figure dialog, toolbar, symbol palette, outline and breadcrumbs.',
          'LaTeX completions, a code check, equation preview, spell checking in many languages, word count, project-wide search and replace, Vim or Emacs keys.',
          'Compiles with latexmk on a complete TeX Live. The engine (pdfLaTeX, XeLaTeX or LuaLaTeX) is picked from the document, Chinese included.',
          'PDF preview with SyncTeX in both directions, also in a separate window. Compile errors are underlined in the source, with plain-language hints.',
          'References: cite from your .bib files, add entries from Crossref and arXiv or by DOI, or keep a Zotero library in sync.',
        ],
      },
      {
        title: 'Collaboration',
        items: [
          "Real-time editing with everyone's cursors, comments with @mentions, track changes, project chat and notifications.",
          'Roles per project: owner, editor, reviewer (suggestions only) and viewer.',
          "Version history like git: automatic versions, versions saved with a message, and undoing one version's changes.",
          'Git access: clone a project, work on it locally and push back.',
        ],
      },
      {
        title: 'AI Agent',
        items: [
          'Ask about LaTeX, your project or your writing, or let it fix compile errors. It drafts changes in a private copy, test-compiles them and shows a diff.',
          'Applying saves a version first and recompiles; if the build gets worse, the change is rolled back.',
          'API keys (Anthropic, OpenAI, DeepSeek, Google, OpenRouter and more), subscription sign-in (Claude, ChatGPT, GitHub Copilot and more), or your own server (Ollama, vLLM, LM Studio).',
          'Skills you write or import, permissions from Manual to Full access, and your own agent (Claude Code, Codex, Cursor…) over MCP.',
        ],
      },
      {
        title: 'Projects and Administration',
        items: [
          'Templates for IEEE, ACM, Springer LNCS, Elsevier, REVTeX and arXiv, and conversion from one journal template to another.',
          'Overleaf zip import and export, linked files, tags, archive and trash.',
          'No public sign-up: accounts come from invitation links.',
          'Monitoring, WebDAV backups, local or S3-compatible storage, themes, and an interface in 14 languages.',
        ],
      },
    ],
  },
  editions: {
    title: 'Two TeX Live Editions',
    lead: 'Both have every TeX Live package and compile the same documents. The full edition adds the manuals and sources, which the AI agent can also read.',
    head: ['Edition', 'Download', 'Disk (all of ColTex)', 'Free space to have'],
    rows: [
      ['Standard (default)', 'about 3 GB', 'about 12 GB', '20 GB'],
      ['Full (--edition full)', 'about 8 GB', 'about 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    categories: [
      {
        title: 'General',
        items: [
          {
            q: 'Is ColTex free?',
            a: 'Yes. It is open source under the AGPL-3.0 and runs on your own machine. AI providers you connect bill you themselves.',
          },
          {
            q: 'How is it different from Overleaf?',
            a: 'It works much like Overleaf: the source beside the PDF, comments, track changes and history. It runs on a server you control, and an AI agent is built in.',
          },
          {
            q: 'Is there a hosted version?',
            a: 'No. ColTex runs on a computer you control. To look around first, try the demo on this site; it runs in your browser.',
          },
        ],
      },
      {
        title: 'Installation',
        items: [
          {
            q: 'What do I need to run it?',
            a: 'A Linux or macOS machine with Docker (on Linux the installer can set it up) and about 20 GB of free disk. 2 CPU cores and 4 GB of memory or more are recommended.',
          },
          {
            q: 'Which TeX Live edition should I choose?',
            a: 'Standard has every package and compiles the same documents. Full adds the packages’ manuals and sources, which the AI agent can also read, for about 11 GB more. You can switch later with coltex edition full.',
          },
          {
            q: 'Does it run on Windows?',
            a: 'The installer runs on Linux and macOS. On Windows, install ColTex on a Linux machine or server and open it in the browser.',
          },
          {
            q: 'Can I use my own domain with HTTPS?',
            a: 'Yes. Install with --domain tex.example.org and the bundled Caddy gets the certificates. Point the domain at the server and open ports 80 and 443.',
          },
          {
            q: 'How do I update?',
            a: 'Run coltex update. It gets the latest release; your settings and data stay.',
          },
        ],
      },
      {
        title: 'Writing and Collaboration',
        items: [
          {
            q: 'Can I bring my Overleaf projects?',
            a: 'Yes. Import a project zip from Overleaf; ColTex exports zips the same way.',
          },
          {
            q: 'Can several people edit at once?',
            a: 'Yes, with everyone’s cursors, comments, track changes and a project chat. Each project has owners, editors, reviewers (suggestions only) and viewers.',
          },
          {
            q: 'How do others reach it from outside?',
            a: 'Turn on Tailscale or Cloudflare Tunnel in Settings → Network, with no ports to open. A server with its own domain can use HTTPS with --domain.',
          },
          {
            q: 'Can I work on a project with Git?',
            a: 'Yes. Clone it with a personal token, work on it locally and push back; edits made in the browser meanwhile are merged.',
          },
          {
            q: 'Does it compile Chinese, Japanese and Korean?',
            a: 'Yes. The engine is picked from the document, so ctex and xeCJK documents compile with XeLaTeX without any setting.',
          },
        ],
      },
      {
        title: 'AI Agent',
        items: [
          {
            q: 'Does the AI agent need a subscription?',
            a: 'It needs a model: an API key, a subscription sign-in or your own OpenAI-compatible server. Everything else works without one.',
          },
          {
            q: 'Which models can it use?',
            a: 'API keys (Anthropic, OpenAI, DeepSeek, Google, OpenRouter and more), subscription sign-ins (Claude, ChatGPT, GitHub Copilot and more), or your own server such as Ollama, vLLM or LM Studio. The administrator connects them.',
          },
          {
            q: 'Does my writing go to the AI provider?',
            a: 'Only what the agent reads for a request you make, and only to the provider of the model you picked. With a model on your own server, nothing leaves it.',
          },
          {
            q: 'Can the AI agent change my files without asking?',
            a: 'Not unless you allow it. In Manual, its changes are a draft you review and apply; applying saves a version first, and a change that makes the build worse is rolled back.',
          },
        ],
      },
      {
        title: 'Data and Security',
        items: [
          {
            q: 'Where is my data kept?',
            a: 'On your server: the database and the project files, on its disk or in S3-compatible storage. Projects, history, accounts and compile jobs never leave it.',
          },
          {
            q: 'Can I back it up?',
            a: 'Yes. Settings → Storage & backups sends the database, the files and the history to a WebDAV folder on a schedule, encrypted if you set a password.',
          },
          {
            q: 'Is compiling safe?',
            a: 'TeX runs in a container of its own without internet access, with a read-only system, no extra privileges and limits on memory and processes.',
          },
          {
            q: 'Who can create an account?',
            a: 'No one by signing up. Accounts come from invitation links that the system administrator, or an admin for their team, passes on.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Powered by GitHub Pages',
  },
}
