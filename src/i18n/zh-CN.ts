import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex：自托管的协作 LaTeX 编辑器',
    description: 'ColTex 是自托管的协作 LaTeX 编辑器，内置 AI 智能体：可以替代 Overleaf，装在你自己的服务器上。',
  },
  nav: {
    docs: '文档',
    language: '语言',
    theme: '切换浅色和深色',
  },
  hero: {
    tagline: '自托管的协作 LaTeX 编辑器，内置 AI 智能体。',
    points: ['你的服务器', '你的账号', '你的数据', '实时协作', '开源（AGPL-3.0）'],
    copy: '复制',
    copied: '已复制',
    replay: '重新播放',
    github: '在 GitHub 上查看',
  },
  install: {
    title: '安装',
    steps: [
      '在装有 Docker 的 Linux 或 macOS 电脑上运行这条命令。Linux 上安装脚本可以帮你装 Docker。',
      '用方向键选择 TeX Live 版本。安装脚本会下载预先构建好的镜像（x86-64 或 ARM64）并启动 ColTex。',
      '打开 http://<服务器>:3690，创建管理员账号。',
    ],
    recommended: '推荐配置：2 核 CPU、4 GB 内存或更高。',
  },
  docs: {
    title: '帮助文档',
    onThisPage: '本页内容',
  },
  tour: {
    chapters: ['登录', '项目区', '写作', '可视化编辑', '协作', 'AI 智能体', '审阅', '参考文献', '历史版本', '设置', '管理'],
    try: '试用演示',
    note: '演示完全在你的浏览器里运行。',
  },
  why: {
    title: '为什么用 ColTex？',
    lead: 'ColTex 可以替代 Overleaf，适合课题组、实验室或个人使用，装在你自己掌控的电脑上：实验室的台式机、家里的服务器或云服务器都可以。',
    items: [
      {
        title: '所有东西都留在你的服务器上',
        text: '项目、历史版本、账号和编译任务都不会离开它。TeX 在一个隔离、不能联网的容器里编译。',
      },
      {
        title: '为多人一起写作而设计',
        text: '多人同时编辑同一个文件，有批注、修订、聊天和历史版本。',
      },
      {
        title: '在项目里干活的 AI 智能体',
        text: '它会读项目文件和编译日志，起草修改、试编译，再把差异给你看。你点应用之前，什么都不会写进项目。',
      },
      {
        title: '一条命令安装，不用开放端口',
        text: '内置 Tailscale 和 Cloudflare Tunnel，方便远程访问。',
      },
    ],
  },
  features: {
    title: '功能',
    groups: [
      {
        title: '写作与编译',
        items: [
          '源码编辑器和可视化编辑器，含表格编辑器、插图对话框、工具栏、符号面板、文档大纲和路径导航。',
          'LaTeX 自动补全、代码检查、公式预览、多语言拼写检查、字数统计、全项目搜索替换，支持 Vim 和 Emacs 键位。',
          '在完整的 TeX Live 上用 latexmk 编译，根据文档自动选择 pdfLaTeX、XeLaTeX 或 LuaLaTeX，支持中文。',
          'PDF 预览支持双向 SyncTeX，也可以在单独的窗口里打开。编译错误会在源码里标出，并附上通俗的提示。',
          '参考文献：从 .bib 里引用，从 Crossref、arXiv 或按 DOI 添加条目，或者和 Zotero 文献库保持同步。',
        ],
      },
      {
        title: '协作',
        items: [
          '实时多人编辑，能看到每个人的光标；带 @提及 的批注、修订、项目聊天和站内通知。',
          '项目角色：所有者、编辑者、审阅者（只能提建议）和只读成员。',
          '像 git 一样的历史版本：自动保存的版本、带说明手动保存的版本，以及撤销某一个版本的修改。',
          'Git 同步：把项目 clone 到本地编辑，再 push 回来。',
        ],
      },
      {
        title: 'AI 智能体',
        items: [
          '可以问 LaTeX、项目或写作上的问题，也可以让它修编译错误。它在私有副本里起草修改并试编译，然后展示差异。',
          '应用前会先保存一个版本，应用后重新编译；如果编译结果变差，会自动回滚。',
          'API Key（Anthropic、OpenAI、DeepSeek、Google、OpenRouter 等）、订阅账号登录（Claude、ChatGPT、GitHub Copilot 等），或者自己部署的服务（Ollama、vLLM、LM Studio）。',
          '自己写或导入的 Skill，从手动到完全访问的权限，以及通过 MCP 接入你自己的智能体（Claude Code、Codex、Cursor 等）。',
        ],
      },
      {
        title: '项目与管理',
        items: [
          'IEEE、ACM、Springer LNCS、Elsevier、REVTeX 和 arXiv 模板，以及把论文从一种期刊模板转换成另一种。',
          '导入、导出 Overleaf 的 zip，关联文件，标签、归档和回收站。',
          '不开放注册，只能凭邀请链接创建账号。',
          '运行监控、WebDAV 备份、本地或 S3 兼容存储、多种主题，界面支持 14 种语言。',
        ],
      },
    ],
  },
  editions: {
    title: '两个 TeX Live 版本',
    lead: '两个版本都包含 TeX Live 的全部宏包，能编译的文档一样。完整版加上了宏包手册和源码，AI 智能体还可以查阅它们。',
    head: ['版本', '下载量', '整个 ColTex 占用', '建议预留空间'],
    rows: [
      ['标准版（默认）', '约 3 GB', '约 12 GB', '20 GB'],
      ['完整版（--edition full）', '约 8 GB', '约 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: '常见问题',
    categories: [
      {
        title: '概览',
        items: [
          {
            q: 'ColTex 免费吗？',
            a: '免费。它以 AGPL-3.0 开源，运行在你自己的机器上。你接入的 AI 服务由服务商自己收费。',
          },
          {
            q: '它和 Overleaf 有什么不同？',
            a: '用起来和 Overleaf 很像：源码和 PDF 并排、批注、修订、历史版本都有。区别是它运行在你自己掌控的服务器上，并且内置 AI 智能体。',
          },
          {
            q: '有在线托管的版本吗？',
            a: '没有。ColTex 运行在你自己掌控的电脑上。想先看看，可以试试本站的演示，它完全在你的浏览器里运行。',
          },
        ],
      },
      {
        title: '安装与部署',
        items: [
          {
            q: '运行它需要什么？',
            a: '一台装有 Docker 的 Linux 或 macOS 电脑（Linux 上安装脚本可以帮你装 Docker），以及约 20 GB 的空闲磁盘。推荐 2 核 CPU、4 GB 内存或更高。',
          },
          {
            q: 'TeX Live 选哪个版本？',
            a: '标准版包含全部宏包，能编译的文档和完整版一样。完整版加上了宏包手册和源码，AI 智能体也能查阅，多占约 11 GB。以后可以用 coltex edition full 切换。',
          },
          {
            q: '能在 Windows 上运行吗？',
            a: '安装脚本支持 Linux 和 macOS。用 Windows 的话，把 ColTex 装在一台 Linux 电脑或服务器上，再用浏览器打开。',
          },
          {
            q: '能用自己的域名和 HTTPS 吗？',
            a: '能。安装时加上 --domain tex.example.org，自带的 Caddy 会自动申请证书。把域名指向服务器，并开放 80 和 443 端口。',
          },
          {
            q: '怎么更新？',
            a: '运行 coltex update。它会更新到最新版本，设置和数据都会保留。',
          },
        ],
      },
      {
        title: '写作与协作',
        items: [
          {
            q: '能把 Overleaf 的项目搬过来吗？',
            a: '能。从 Overleaf 下载项目的 zip 导入即可；ColTex 也能按同样的格式导出。',
          },
          {
            q: '能多人同时编辑吗？',
            a: '能，每个人的光标都看得到，还有批注、修订和项目聊天。每个项目分所有者、编辑者、审阅者（只能提建议）和只读成员。',
          },
          {
            q: '别人怎么从外面访问？',
            a: '在 设置 → 网络 里打开 Tailscale 或 Cloudflare Tunnel，不用开放端口。有自己域名的服务器可以用 --domain 开启 HTTPS。',
          },
          {
            q: '能用 Git 管理项目吗？',
            a: '能。用个人令牌把项目 clone 到本地编辑，再 push 回来；期间在浏览器里的修改会自动合并。',
          },
          {
            q: '能编译中文、日文和韩文吗？',
            a: '能。编译引擎根据文档自动选择，用 ctex 或 xeCJK 的文档会用 XeLaTeX 编译，不用另外设置。',
          },
        ],
      },
      {
        title: 'AI 智能体',
        items: [
          {
            q: 'AI 智能体需要订阅吗？',
            a: '它需要一个模型：API Key、订阅账号登录，或者自己部署的 OpenAI 兼容服务。其他功能都不依赖它。',
          },
          {
            q: '能用哪些模型？',
            a: 'API Key（Anthropic、OpenAI、DeepSeek、Google、OpenRouter 等）、订阅账号登录（Claude、ChatGPT、GitHub Copilot 等），或者自己部署的 Ollama、vLLM、LM Studio。由管理员接入。',
          },
          {
            q: '我写的内容会发给 AI 服务商吗？',
            a: '只有你发出请求时智能体读取的内容会发出，并且只发给你所选模型的服务商。用自己服务器上的模型时，什么都不会离开服务器。',
          },
          {
            q: 'AI 智能体会不经同意改我的文件吗？',
            a: '不会，除非你允许。手动模式下，它的修改是一份草稿，由你审阅后应用；应用前会先保存一个版本，编译结果变差的修改会自动回滚。',
          },
        ],
      },
      {
        title: '数据与安全',
        items: [
          {
            q: '我的数据存在哪里？',
            a: '存在你的服务器上：数据库和项目文件，放在本地磁盘或 S3 兼容存储里。项目、历史版本、账号和编译任务都不会离开它。',
          },
          {
            q: '能备份吗？',
            a: '能。在 设置 → 存储与备份 里设置后，会定时把数据库、文件和历史版本备份到 WebDAV 文件夹，设了密码就会加密。',
          },
          {
            q: '编译安全吗？',
            a: 'TeX 在一个单独的容器里运行：不能联网、系统只读、没有额外权限，内存和进程数都有限制。',
          },
          {
            q: '谁能创建账号？',
            a: '不开放注册。账号只能凭邀请链接创建，邀请链接由系统管理员（或管理员为自己的团队）发出。',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: '由 GitHub Pages 提供支持',
  },
} satisfies typeof en
