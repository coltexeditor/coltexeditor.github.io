import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex：自行架設的協作 LaTeX 編輯器',
    description: 'ColTex 是自行架設的協作 LaTeX 編輯器，內建 AI 代理：可以取代 Overleaf，執行在你自己的伺服器上。',
  },
  nav: {
    docs: '文件',
    language: '語言',
    theme: '切換淺色和深色',
  },
  hero: {
    tagline: '自行架設的協作 LaTeX 編輯器，內建 AI 代理。',
    points: ['你的伺服器', '你的帳號', '你的資料', '即時協作', '開放原始碼（AGPL-3.0）'],
    copy: '複製',
    copied: '已複製',
    replay: '重新播放',
    github: '在 GitHub 上查看',
  },
  install: {
    title: '安裝',
    steps: [
      '在裝有 Docker 的 Linux 或 macOS 電腦上執行這個指令。在 Linux 上，安裝程式可以代為安裝 Docker。',
      '用方向鍵選擇 TeX Live 版本。安裝程式會下載預先建置的映像檔（x86-64 或 ARM64）並啟動 ColTex。',
      '開啟 http://<伺服器>:3690，建立管理員帳號。',
    ],
    recommended: '建議：至少 2 個 CPU 核心和 4 GB 記憶體。',
  },
  docs: {
    title: '說明文件',
    onThisPage: '本頁內容',
  },
  tour: {
    chapters: ['登入', '工作區', '撰寫', '視覺化編輯器', '協作', 'AI 代理', '審閱', '參考文獻', '版本記錄', '設定', '管理'],
    try: '試用示範',
    note: '示範完全在你的瀏覽器中執行。',
  },
  why: {
    title: '為什麼選擇 ColTex？',
    lead: 'ColTex 是 Overleaf 的替代方案，適合研究團隊、實驗室或個人使用，執行在你自己掌控的電腦上：實驗室的桌上型電腦、家中的伺服器或雲端主機都可以。',
    items: [
      {
        title: '所有資料都留在你的伺服器上',
        text: '專案、版本記錄、帳號和編譯工作都不會離開它。TeX 在無法連上網際網路的沙箱容器中執行。',
      },
      {
        title: '為共同撰寫而設計',
        text: '多人可以同時編輯同一個檔案，並有註解、追蹤修訂、聊天和版本記錄。',
      },
      {
        title: '直接處理你專案的 AI 代理',
        text: '它會閱讀檔案和編譯記錄檔、起草修改、試編譯，再把差異呈現給你。在你套用之前，什麼都不會寫入。',
      },
      {
        title: '一個指令即可安裝，不需要開放連接埠',
        text: '內建 Tailscale 和 Cloudflare Tunnel，方便遠端存取。',
      },
    ],
  },
  features: {
    title: '功能',
    groups: [
      {
        title: '撰寫與編譯',
        items: [
          '原始碼編輯器和視覺化編輯器，包含表格編輯器、插圖對話框、工具列、符號面板、大綱和路徑導覽。',
          'LaTeX 自動完成、語法檢查、公式預覽、多語言拼字檢查、字數統計、整個專案的搜尋與取代，以及 Vim 或 Emacs 按鍵配置。',
          '在完整的 TeX Live 上以 latexmk 編譯。引擎（pdfLaTeX、XeLaTeX 或 LuaLaTeX）會依文件自動選擇，包括中文。',
          'PDF 預覽支援雙向 SyncTeX，也可以在獨立視窗中開啟。編譯錯誤會在原始碼中加上底線，並附上淺顯易懂的提示。',
          '參考文獻：從你的 .bib 檔案引用，從 Crossref 和 arXiv 或以 DOI 新增條目，或與 Zotero 文獻庫保持同步。',
        ],
      },
      {
        title: '協作',
        items: [
          '即時編輯並顯示每個人的游標，支援 @提及 的註解、追蹤修訂、專案聊天和通知。',
          '每個專案的角色：擁有者、編輯者、審閱者（只能提出建議）和檢視者。',
          '像 git 一樣的版本記錄：自動保存的版本、附說明手動儲存的版本，以及撤銷某個版本的變更。',
          'Git 存取：clone 專案、在本機處理，再 push 回來。',
        ],
      },
      {
        title: 'AI 代理',
        items: [
          '詢問 LaTeX、你的專案或寫作上的問題，或讓它修正編譯錯誤。它會在私人副本中起草修改、試編譯並顯示差異。',
          '套用前會先儲存一個版本並重新編譯；如果編譯結果變差，變更會自動復原。',
          'API 金鑰（Anthropic、OpenAI、DeepSeek、Google、OpenRouter 等）、訂閱帳號登入（Claude、ChatGPT、GitHub Copilot 等），或你自己的伺服器（Ollama、vLLM、LM Studio）。',
          '自己撰寫或匯入的 Skill、從手動到完整存取的權限，以及透過 MCP 連接你自己的代理（Claude Code、Codex、Cursor…）。',
        ],
      },
      {
        title: '專案與管理',
        items: [
          'IEEE、ACM、Springer LNCS、Elsevier、REVTeX 和 arXiv 範本，以及在期刊範本之間轉換。',
          'Overleaf zip 匯入與匯出、連結檔案、標籤、封存和垃圾桶。',
          '沒有公開註冊：帳號只能透過邀請連結建立。',
          '監控、WebDAV 備份、本機或 S3 相容儲存空間、主題，以及 14 種語言的介面。',
        ],
      },
    ],
  },
  editions: {
    title: '兩種 TeX Live 版本',
    lead: '兩者都包含所有 TeX Live 套件，能編譯的文件相同。完整版另外包含手冊和原始碼，AI 代理也可以閱讀它們。',
    head: ['版本', '下載量', '磁碟占用（整個 ColTex）', '建議可用空間'],
    rows: [
      ['標準版（預設）', '約 3 GB', '約 12 GB', '20 GB'],
      ['完整版（--edition full）', '約 8 GB', '約 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: '常見問題',
    categories: [
      {
        title: '一般',
        items: [
          {
            q: 'ColTex 免費嗎？',
            a: '是的。它以 AGPL-3.0 授權開放原始碼，執行在你自己的機器上。你連接的 AI 供應商會自行向你收費。',
          },
          {
            q: '它和 Overleaf 有什麼不同？',
            a: '用起來和 Overleaf 很像：原始碼在 PDF 旁邊，有註解、追蹤修訂和版本記錄。它執行在你掌控的伺服器上，並內建 AI 代理。',
          },
          {
            q: '有線上託管的版本嗎？',
            a: '沒有。ColTex 執行在你掌控的電腦上。想先看看的話，可以試用本網站上的示範；它在你的瀏覽器中執行。',
          },
        ],
      },
      {
        title: '安裝',
        items: [
          {
            q: '執行它需要什麼？',
            a: '一台裝有 Docker 的 Linux 或 macOS 電腦（在 Linux 上，安裝程式可以代為安裝），以及約 20 GB 的可用磁碟空間。建議至少 2 個 CPU 核心和 4 GB 記憶體。',
          },
          {
            q: '應該選擇哪個 TeX Live 版本？',
            a: '標準版包含所有套件，能編譯的文件相同。完整版另外包含套件的手冊和原始碼，AI 代理也可以閱讀它們，約多占 11 GB。之後可以用 coltex edition full 切換。',
          },
          {
            q: '可以在 Windows 上執行嗎？',
            a: '安裝程式支援 Linux 和 macOS。使用 Windows 時，請把 ColTex 安裝在 Linux 電腦或伺服器上，再用瀏覽器開啟。',
          },
          {
            q: '可以使用自己的網域和 HTTPS 嗎？',
            a: '可以。以 --domain tex.example.org 安裝，內附的 Caddy 會取得憑證。請將網域指向伺服器，並開放連接埠 80 和 443。',
          },
          {
            q: '要如何更新？',
            a: '執行 coltex update。它會取得最新版本；你的設定和資料都會保留。',
          },
        ],
      },
      {
        title: '撰寫與協作',
        items: [
          {
            q: '可以搬移我的 Overleaf 專案嗎？',
            a: '可以。從 Overleaf 匯入專案 zip；ColTex 也會以相同的方式匯出 zip。',
          },
          {
            q: '可以多人同時編輯嗎？',
            a: '可以，並會顯示每個人的游標，還有註解、追蹤修訂和專案聊天。每個專案都有擁有者、編輯者、審閱者（只能提出建議）和檢視者。',
          },
          {
            q: '其他人要如何從外部連線？',
            a: '在「設定 → 網路」中開啟 Tailscale 或 Cloudflare Tunnel，不需要開放連接埠。擁有自己網域的伺服器可以用 --domain 啟用 HTTPS。',
          },
          {
            q: '可以用 Git 處理專案嗎？',
            a: '可以。用個人權杖 clone 專案、在本機處理，再 push 回來；這段期間在瀏覽器中所做的編輯會自動合併。',
          },
          {
            q: '能編譯中文、日文和韓文嗎？',
            a: '可以。引擎會依文件自動選擇，因此 ctex 和 xeCJK 文件不需任何設定就會以 XeLaTeX 編譯。',
          },
        ],
      },
      {
        title: 'AI 代理',
        items: [
          {
            q: 'AI 代理需要訂閱嗎？',
            a: '它需要一個模型：API 金鑰、訂閱帳號登入，或你自己的 OpenAI 相容伺服器。其他功能都不需要。',
          },
          {
            q: '它可以使用哪些模型？',
            a: 'API 金鑰（Anthropic、OpenAI、DeepSeek、Google、OpenRouter 等）、訂閱帳號登入（Claude、ChatGPT、GitHub Copilot 等），或你自己的伺服器，例如 Ollama、vLLM 或 LM Studio。由管理員負責連接。',
          },
          {
            q: '我寫的內容會傳給 AI 供應商嗎？',
            a: '只會傳送代理為了處理你的要求而讀取的內容，而且只傳給你所選模型的供應商。使用你自己伺服器上的模型時，任何內容都不會離開伺服器。',
          },
          {
            q: 'AI 代理會不經詢問就修改我的檔案嗎？',
            a: '除非你允許，否則不會。在手動模式下，它的修改是一份草稿，由你審閱後套用；套用前會先儲存一個版本，讓編譯結果變差的修改會被復原。',
          },
        ],
      },
      {
        title: '資料與安全性',
        items: [
          {
            q: '我的資料存放在哪裡？',
            a: '在你的伺服器上：資料庫和專案檔案，存放在它的磁碟或 S3 相容儲存空間中。專案、版本記錄、帳號和編譯工作都不會離開它。',
          },
          {
            q: '可以備份嗎？',
            a: '可以。「設定 → 儲存空間與備份」會依排程把資料庫、檔案和版本記錄傳送到 WebDAV 資料夾；設定密碼後還會加密。',
          },
          {
            q: '編譯安全嗎？',
            a: 'TeX 在獨立的容器中執行，無法連上網際網路，系統為唯讀、沒有額外權限，記憶體和程序數量也受到限制。',
          },
          {
            q: '誰可以建立帳號？',
            a: '沒有人能自行註冊。帳號只能透過邀請連結建立，連結由系統管理員發出，或由管理員發給自己的團隊。',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: '由 GitHub Pages 提供支援',
  },
} satisfies typeof en
