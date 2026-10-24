import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex: editor LaTeX kolaboratif yang di-hosting sendiri',
    description:
      'ColTex adalah editor LaTeX kolaboratif yang di-hosting sendiri dengan agen AI bawaan: alternatif Overleaf yang berjalan di server Anda sendiri.',
  },
  nav: {
    docs: 'Dokumentasi',
    language: 'Bahasa',
    theme: 'Beralih antara terang dan gelap',
  },
  hero: {
    tagline: 'Editor LaTeX kolaboratif yang di-hosting sendiri, dengan agen AI bawaan.',
    points: ['Server Anda', 'Akun Anda', 'Data Anda', 'Kolaborasi real-time', 'Sumber terbuka (AGPL-3.0)'],
    copy: 'Salin',
    copied: 'Disalin',
    replay: 'Putar ulang',
    github: 'Lihat di GitHub',
  },
  install: {
    title: 'Instalasi',
    steps: [
      'Jalankan perintah ini di mesin Linux atau macOS dengan Docker. Di Linux, penginstal dapat memasang Docker.',
      'Pilih edisi TeX Live dengan tombol panah. Penginstal mengunduh image siap pakai (x86-64 atau ARM64) dan menjalankan ColTex.',
      'Buka http://<server>:3690 dan buat akun administrator.',
    ],
    recommended: 'Disarankan: 2 inti CPU dan memori 4 GB atau lebih.',
  },
  docs: {
    title: 'Dokumentasi',
    onThisPage: 'Di halaman ini',
  },
  tour: {
    chapters: ['Masuk', 'Ruang kerja', 'Menulis', 'Editor visual', 'Kolaborasi', 'Agen AI', 'Tinjauan', 'Referensi', 'Riwayat', 'Pengaturan', 'Administrasi'],
    try: 'Coba demo',
    note: 'Demo ini berjalan sepenuhnya di peramban Anda.',
  },
  why: {
    title: 'Mengapa ColTex?',
    lead: 'ColTex adalah alternatif Overleaf untuk kelompok riset, laboratorium, atau untuk Anda sendiri, yang berjalan di komputer yang Anda kendalikan: komputer desktop di lab, server rumahan, atau mesin cloud.',
    items: [
      {
        title: 'Semuanya tetap di server Anda',
        text: 'Proyek, riwayat, akun, dan tugas kompilasi tidak pernah meninggalkannya. TeX berjalan di kontainer sandbox tanpa akses internet.',
      },
      {
        title: 'Dibuat untuk menulis bersama',
        text: 'Beberapa orang menyunting file yang sama sekaligus, dengan komentar, lacak perubahan, obrolan, dan riwayat versi.',
      },
      {
        title: 'Agen AI yang bekerja pada proyek Anda',
        text: 'Agen membaca file dan log kompilasi, membuat draf perubahan, mengompilasi uji, dan menampilkan diff kepada Anda. Tidak ada yang ditulis sampai Anda menerapkannya.',
      },
      {
        title: 'Satu perintah untuk instalasi, tanpa port yang perlu dibuka',
        text: 'Tailscale dan Cloudflare Tunnel sudah tersedia bawaan untuk akses jarak jauh.',
      },
    ],
  },
  features: {
    title: 'Fitur',
    groups: [
      {
        title: 'Menulis dan mengompilasi',
        items: [
          'Editor kode sumber dan editor visual dengan editor tabel, dialog gambar, bilah alat, palet simbol, kerangka, dan breadcrumb.',
          'Pelengkapan LaTeX, pemeriksaan kode, pratinjau persamaan, pemeriksaan ejaan dalam banyak bahasa, jumlah kata, cari dan ganti di seluruh proyek, tombol Vim atau Emacs.',
          'Kompilasi dengan latexmk di atas TeX Live lengkap. Mesinnya (pdfLaTeX, XeLaTeX, atau LuaLaTeX) dipilih berdasarkan dokumen, termasuk bahasa Tionghoa.',
          'Pratinjau PDF dengan SyncTeX dua arah, juga di jendela terpisah. Galat kompilasi digarisbawahi di kode sumber, dengan petunjuk dalam bahasa sehari-hari.',
          'Referensi: kutip dari file .bib Anda, tambahkan entri dari Crossref dan arXiv atau lewat DOI, atau jaga pustaka Zotero tetap tersinkron.',
        ],
      },
      {
        title: 'Kolaborasi',
        items: [
          'Penyuntingan real-time dengan kursor setiap orang, komentar dengan @sebutan, lacak perubahan, obrolan proyek, dan notifikasi.',
          'Peran per proyek: pemilik, editor, peninjau (hanya saran), dan pelihat.',
          'Riwayat versi seperti git: versi otomatis, versi yang disimpan dengan pesan, dan pengurungan perubahan satu versi.',
          'Akses Git: clone proyek, kerjakan secara lokal, lalu push kembali.',
        ],
      },
      {
        title: 'Agen AI',
        items: [
          'Tanyakan tentang LaTeX, proyek Anda, atau tulisan Anda, atau biarkan agen memperbaiki galat kompilasi. Agen membuat draf perubahan di salinan pribadi, mengompilasi uji, dan menampilkan diff.',
          'Penerapan menyimpan versi terlebih dahulu lalu mengompilasi ulang; jika hasil kompilasi memburuk, perubahan dikembalikan.',
          'Kunci API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter, dan lainnya), masuk dengan langganan (Claude, ChatGPT, GitHub Copilot, dan lainnya), atau server Anda sendiri (Ollama, vLLM, LM Studio).',
          'Skill yang Anda tulis atau impor, izin dari Manual hingga Akses penuh, dan agen Anda sendiri (Claude Code, Codex, Cursor…) melalui MCP.',
        ],
      },
      {
        title: 'Proyek dan administrasi',
        items: [
          'Templat untuk IEEE, ACM, Springer LNCS, Elsevier, REVTeX, dan arXiv, serta konversi dari satu templat jurnal ke templat lain.',
          'Impor dan ekspor zip Overleaf, file tertaut, tag, arsip, dan sampah.',
          'Tanpa pendaftaran publik: akun berasal dari tautan undangan.',
          'Pemantauan, cadangan WebDAV, penyimpanan lokal atau yang kompatibel dengan S3, tema, dan antarmuka dalam 14 bahasa.',
        ],
      },
    ],
  },
  editions: {
    title: 'Dua edisi TeX Live',
    lead: 'Keduanya berisi semua paket TeX Live dan mengompilasi dokumen yang sama. Edisi full menambahkan manual dan kode sumber, yang juga dapat dibaca agen AI.',
    head: ['Edisi', 'Unduhan', 'Disk (seluruh ColTex)', 'Ruang kosong yang diperlukan'],
    rows: [
      ['Standard (bawaan)', 'sekitar 3 GB', 'sekitar 12 GB', '20 GB'],
      ['Full (--edition full)', 'sekitar 8 GB', 'sekitar 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Pertanyaan umum',
    categories: [
      {
        title: 'Umum',
        items: [
          {
            q: 'Apakah ColTex gratis?',
            a: 'Ya. ColTex bersumber terbuka di bawah AGPL-3.0 dan berjalan di mesin Anda sendiri. Penyedia AI yang Anda hubungkan menagih Anda secara langsung.',
          },
          {
            q: 'Apa bedanya dengan Overleaf?',
            a: 'Cara kerjanya mirip Overleaf: kode sumber di samping PDF, komentar, lacak perubahan, dan riwayat. ColTex berjalan di server yang Anda kendalikan, dan agen AI sudah tersedia bawaan.',
          },
          {
            q: 'Apakah ada versi yang di-hosting?',
            a: 'Tidak. ColTex berjalan di komputer yang Anda kendalikan. Untuk melihat-lihat dulu, coba demo di situs ini; demo berjalan di peramban Anda.',
          },
        ],
      },
      {
        title: 'Instalasi',
        items: [
          {
            q: 'Apa yang saya perlukan untuk menjalankannya?',
            a: 'Mesin Linux atau macOS dengan Docker (di Linux, penginstal dapat memasangnya) dan ruang disk kosong sekitar 20 GB. Disarankan 2 inti CPU dan memori 4 GB atau lebih.',
          },
          {
            q: 'Edisi TeX Live mana yang sebaiknya saya pilih?',
            a: 'Standard berisi semua paket dan mengompilasi dokumen yang sama. Full menambahkan manual dan kode sumber paket, yang juga dapat dibaca agen AI, dengan tambahan sekitar 11 GB. Anda dapat beralih nanti dengan coltex edition full.',
          },
          {
            q: 'Apakah ColTex berjalan di Windows?',
            a: 'Penginstal berjalan di Linux dan macOS. Di Windows, pasang ColTex di mesin atau server Linux lalu buka di peramban.',
          },
          {
            q: 'Bisakah saya menggunakan domain sendiri dengan HTTPS?',
            a: 'Bisa. Pasang dengan --domain tex.example.org dan Caddy yang disertakan akan mendapatkan sertifikatnya. Arahkan domain ke server dan buka port 80 dan 443.',
          },
          {
            q: 'Bagaimana cara memperbarui?',
            a: 'Jalankan coltex update. Perintah ini mengambil rilis terbaru; pengaturan dan data Anda tetap ada.',
          },
        ],
      },
      {
        title: 'Menulis dan kolaborasi',
        items: [
          {
            q: 'Bisakah saya membawa proyek Overleaf saya?',
            a: 'Bisa. Impor zip proyek dari Overleaf; ColTex juga mengekspor zip dengan cara yang sama.',
          },
          {
            q: 'Bisakah beberapa orang menyunting sekaligus?',
            a: 'Bisa, dengan kursor setiap orang, komentar, lacak perubahan, dan obrolan proyek. Setiap proyek memiliki pemilik, editor, peninjau (hanya saran), dan pelihat.',
          },
          {
            q: 'Bagaimana orang lain menjangkaunya dari luar?',
            a: 'Aktifkan Tailscale atau Cloudflare Tunnel di Pengaturan → Jaringan, tanpa port yang perlu dibuka. Server dengan domainnya sendiri dapat menggunakan HTTPS dengan --domain.',
          },
          {
            q: 'Bisakah saya mengerjakan proyek dengan Git?',
            a: 'Bisa. Clone dengan token pribadi, kerjakan secara lokal, lalu push kembali; suntingan yang dibuat di peramban sementara itu digabungkan.',
          },
          {
            q: 'Apakah ColTex dapat mengompilasi bahasa Tionghoa, Jepang, dan Korea?',
            a: 'Bisa. Mesin dipilih berdasarkan dokumen, sehingga dokumen ctex dan xeCJK dikompilasi dengan XeLaTeX tanpa pengaturan apa pun.',
          },
        ],
      },
      {
        title: 'Agen AI',
        items: [
          {
            q: 'Apakah agen AI memerlukan langganan?',
            a: 'Agen AI memerlukan model: kunci API, masuk dengan langganan, atau server Anda sendiri yang kompatibel dengan OpenAI. Semua fitur lainnya berfungsi tanpanya.',
          },
          {
            q: 'Model apa saja yang dapat digunakan?',
            a: 'Kunci API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter, dan lainnya), masuk dengan langganan (Claude, ChatGPT, GitHub Copilot, dan lainnya), atau server Anda sendiri seperti Ollama, vLLM, atau LM Studio. Administrator yang menghubungkannya.',
          },
          {
            q: 'Apakah tulisan saya dikirim ke penyedia AI?',
            a: 'Hanya yang dibaca agen untuk permintaan yang Anda buat, dan hanya ke penyedia model yang Anda pilih. Dengan model di server Anda sendiri, tidak ada yang keluar dari server itu.',
          },
          {
            q: 'Bisakah agen AI mengubah file saya tanpa bertanya?',
            a: 'Tidak, kecuali Anda mengizinkannya. Dalam mode Manual, perubahannya berupa draf yang Anda tinjau dan terapkan; penerapan menyimpan versi terlebih dahulu, dan perubahan yang memperburuk hasil kompilasi dikembalikan.',
          },
        ],
      },
      {
        title: 'Data dan keamanan',
        items: [
          {
            q: 'Di mana data saya disimpan?',
            a: 'Di server Anda: basis data dan file proyek, di disk server atau di penyimpanan yang kompatibel dengan S3. Proyek, riwayat, akun, dan tugas kompilasi tidak pernah meninggalkannya.',
          },
          {
            q: 'Bisakah saya mencadangkannya?',
            a: 'Bisa. Pengaturan → Penyimpanan & cadangan mengirim basis data, file, dan riwayat ke folder WebDAV sesuai jadwal, terenkripsi jika Anda mengatur kata sandi.',
          },
          {
            q: 'Apakah kompilasi aman?',
            a: 'TeX berjalan di kontainernya sendiri tanpa akses internet, dengan sistem hanya baca, tanpa hak istimewa tambahan, serta batas memori dan proses.',
          },
          {
            q: 'Siapa yang dapat membuat akun?',
            a: 'Tidak ada yang bisa mendaftar sendiri. Akun berasal dari tautan undangan yang dibagikan oleh admin sistem, atau oleh admin untuk timnya.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Didukung oleh GitHub Pages',
  },
} satisfies typeof en
