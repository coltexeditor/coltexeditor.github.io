import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex: un editor LaTeX collaborativo self-hosted',
    description:
      'ColTex è un editor LaTeX collaborativo self-hosted con un agente IA integrato: un’alternativa a Overleaf che gira sul tuo server.',
  },
  nav: {
    docs: 'Documentazione',
    language: 'Lingua',
    theme: 'Passa dal tema chiaro a quello scuro',
  },
  hero: {
    tagline: 'Un editor LaTeX collaborativo self-hosted con un agente IA integrato.',
    points: ['Il tuo server', 'I tuoi account', 'I tuoi dati', 'Collaborazione in tempo reale', 'Open source (AGPL-3.0)'],
    copy: 'Copia',
    copied: 'Copiato',
    replay: 'Riproduci di nuovo',
    github: 'Vedi su GitHub',
  },
  install: {
    title: 'Installazione',
    steps: [
      'Esegui il comando su una macchina Linux o macOS con Docker. Su Linux l’installer può configurare Docker.',
      'Scegli l’edizione di TeX Live con i tasti freccia. L’installer scarica le immagini precompilate (x86-64 o ARM64) e avvia ColTex.',
      'Apri http://<server>:3690 e crea l’account amministratore.',
    ],
    recommended: 'Consigliati: 2 core di CPU e almeno 4 GB di memoria.',
  },
  docs: {
    title: 'Documentazione',
    onThisPage: 'In questa pagina',
  },
  tour: {
    chapters: ['Accedi', 'Area di lavoro', 'Scrittura', 'Editor visuale', 'Collaborazione', 'Agente IA', 'Revisione', 'Bibliografia', 'Cronologia', 'Impostazioni', 'Amministrazione'],
    try: 'Prova la demo',
    note: 'La demo gira interamente nel tuo browser.',
    position: 'Posizione nel tour',
  },
  why: {
    title: 'Perché ColTex?',
    lead: 'ColTex è un’alternativa a Overleaf per un gruppo di ricerca, un laboratorio o anche solo per te, in esecuzione su un computer che controlli tu: un desktop in laboratorio, un server di casa o una macchina nel cloud.',
    items: [
      {
        title: 'Tutto resta sul tuo server',
        text: 'Progetti, cronologia, account e compilazioni non ne escono mai. TeX gira in un container isolato senza accesso a internet.',
      },
      {
        title: 'Pensato per scrivere insieme',
        text: 'Più persone modificano lo stesso file contemporaneamente, con commenti, revisioni, chat e cronologia delle versioni.',
      },
      {
        title: 'Un agente IA che lavora sul tuo progetto',
        text: 'Legge i file e il log di compilazione, prepara le modifiche, le compila di prova e ti mostra un diff. Non viene scritto nulla finché non le applichi.',
      },
      {
        title: 'Un solo comando per installare, nessuna porta da aprire',
        text: 'Tailscale e Cloudflare Tunnel sono integrati per l’accesso remoto.',
      },
    ],
  },
  features: {
    title: 'Funzionalità',
    groups: [
      {
        title: 'Scrivere e compilare',
        items: [
          'Editor del codice ed editor visuale con editor di tabelle, finestra delle figure, barra degli strumenti, tavolozza dei simboli, struttura e percorso di navigazione.',
          'Completamenti LaTeX, controllo del codice, anteprima delle equazioni, controllo ortografico in molte lingue, conteggio parole, ricerca e sostituzione in tutto il progetto, tasti Vim o Emacs.',
          'Compila con latexmk su un TeX Live completo. Il motore (pdfLaTeX, XeLaTeX o LuaLaTeX) viene scelto in base al documento, cinese compreso.',
          'Anteprima PDF con SyncTeX in entrambe le direzioni, anche in una finestra separata. Gli errori di compilazione sono sottolineati nel sorgente, con suggerimenti in linguaggio semplice.',
          'Bibliografia: cita dai tuoi file .bib, aggiungi voci da Crossref e arXiv o tramite DOI, oppure tieni sincronizzata una libreria Zotero.',
        ],
      },
      {
        title: 'Collaborazione',
        items: [
          'Modifica in tempo reale con i cursori di tutti, commenti con @menzioni, rilevamento delle modifiche, chat del progetto e notifiche.',
          'Ruoli per progetto: proprietario, editor, revisore (solo suggerimenti) e visualizzatore.',
          'Cronologia delle versioni come in git: versioni automatiche, versioni salvate con un messaggio e annullamento delle modifiche di una singola versione.',
          'Accesso Git: clona un progetto, lavoraci in locale e fai push.',
        ],
      },
      {
        title: 'Agente IA',
        items: [
          'Chiedi di LaTeX, del tuo progetto o della tua scrittura, oppure fagli correggere gli errori di compilazione. Prepara le modifiche in una copia privata, le compila di prova e mostra un diff.',
          'L’applicazione salva prima una versione e ricompila; se la compilazione peggiora, la modifica viene annullata.',
          'Chiavi API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter e altri), accesso tramite abbonamento (Claude, ChatGPT, GitHub Copilot e altri) o il tuo server (Ollama, vLLM, LM Studio).',
          'Skill che scrivi o importi, permessi da Manuale ad Accesso completo e il tuo agente (Claude Code, Codex, Cursor…) tramite MCP.',
        ],
      },
      {
        title: 'Progetti e amministrazione',
        items: [
          'Modelli per IEEE, ACM, Springer LNCS, Elsevier, REVTeX e arXiv, e conversione da un modello di rivista a un altro.',
          'Importazione ed esportazione di zip Overleaf, file collegati, tag, archivio e cestino.',
          'Nessuna registrazione pubblica: gli account nascono da link di invito.',
          'Monitoraggio, backup WebDAV, archiviazione locale o compatibile S3, temi e un’interfaccia in 14 lingue.',
        ],
      },
    ],
  },
  editions: {
    title: 'Due edizioni di TeX Live',
    lead: 'Entrambe hanno tutti i pacchetti di TeX Live e compilano gli stessi documenti. L’edizione full aggiunge i manuali e i sorgenti, che può leggere anche l’agente IA.',
    head: ['Edizione', 'Download', 'Disco (tutto ColTex)', 'Spazio libero necessario'],
    rows: [
      ['Standard (predefinita)', 'circa 3 GB', 'circa 12 GB', '20 GB'],
      ['Full (--edition full)', 'circa 8 GB', 'circa 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Domande frequenti',
    categories: [
      {
        title: 'Generale',
        items: [
          {
            q: 'ColTex è gratuito?',
            a: 'Sì. È open source con licenza AGPL-3.0 e gira sulla tua macchina. I fornitori IA che colleghi ti fatturano direttamente.',
          },
          {
            q: 'In cosa è diverso da Overleaf?',
            a: 'Funziona in modo molto simile a Overleaf: il sorgente accanto al PDF, commenti, revisioni e cronologia. Gira su un server che controlli tu e ha un agente IA integrato.',
          },
          {
            q: 'Esiste una versione ospitata?',
            a: 'No. ColTex gira su un computer che controlli tu. Per dare prima un’occhiata, prova la demo su questo sito; gira nel tuo browser.',
          },
        ],
      },
      {
        title: 'Installazione',
        items: [
          {
            q: 'Cosa serve per eseguirlo?',
            a: 'Una macchina Linux o macOS con Docker (su Linux l’installer può configurarlo) e circa 20 GB di disco libero. Sono consigliati 2 core di CPU e almeno 4 GB di memoria.',
          },
          {
            q: 'Quale edizione di TeX Live scegliere?',
            a: 'Standard ha tutti i pacchetti e compila gli stessi documenti. Full aggiunge i manuali e i sorgenti dei pacchetti, che può leggere anche l’agente IA, per circa 11 GB in più. Puoi cambiare in seguito con coltex edition full.',
          },
          {
            q: 'Funziona su Windows?',
            a: 'L’installer funziona su Linux e macOS. Da Windows, installa ColTex su una macchina o un server Linux e aprilo nel browser.',
          },
          {
            q: 'Posso usare un mio dominio con HTTPS?',
            a: 'Sì. Installa con --domain tex.example.org e il Caddy incluso ottiene i certificati. Punta il dominio al server e apri le porte 80 e 443.',
          },
          {
            q: 'Come si aggiorna?',
            a: 'Esegui coltex update. Scarica l’ultima release; le tue impostazioni e i tuoi dati restano.',
          },
        ],
      },
      {
        title: 'Scrittura e collaborazione',
        items: [
          {
            q: 'Posso portare i miei progetti di Overleaf?',
            a: 'Sì. Importa lo zip di un progetto da Overleaf; ColTex esporta gli zip allo stesso modo.',
          },
          {
            q: 'Più persone possono modificare contemporaneamente?',
            a: 'Sì, con i cursori di tutti, commenti, revisioni e una chat del progetto. Ogni progetto ha proprietari, editor, revisori (solo suggerimenti) e visualizzatori.',
          },
          {
            q: 'Come lo raggiungono gli altri dall’esterno?',
            a: 'Attiva Tailscale o Cloudflare Tunnel in Impostazioni → Rete, senza aprire porte. Un server con un proprio dominio può usare HTTPS con --domain.',
          },
          {
            q: 'Posso lavorare a un progetto con Git?',
            a: 'Sì. Clonalo con un token personale, lavoraci in locale e fai push; le modifiche fatte nel frattempo nel browser vengono unite.',
          },
          {
            q: 'Compila cinese, giapponese e coreano?',
            a: 'Sì. Il motore viene scelto in base al documento, quindi i documenti ctex e xeCJK si compilano con XeLaTeX senza alcuna impostazione.',
          },
        ],
      },
      {
        title: 'Agente IA',
        items: [
          {
            q: 'L’agente IA richiede un abbonamento?',
            a: 'Richiede un modello: una chiave API, un accesso tramite abbonamento o il tuo server compatibile con OpenAI. Tutto il resto funziona senza.',
          },
          {
            q: 'Quali modelli può usare?',
            a: 'Chiavi API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter e altri), accessi tramite abbonamento (Claude, ChatGPT, GitHub Copilot e altri) o il tuo server, come Ollama, vLLM o LM Studio. Li collega l’amministratore.',
          },
          {
            q: 'I miei testi vanno al fornitore IA?',
            a: 'Solo ciò che l’agente legge per una tua richiesta, e solo al fornitore del modello che hai scelto. Con un modello sul tuo server, non esce nulla.',
          },
          {
            q: 'L’agente IA può modificare i miei file senza chiedere?',
            a: 'Non se non lo permetti. In Manuale, le sue modifiche sono una bozza che rivedi e applichi; l’applicazione salva prima una versione, e una modifica che peggiora la compilazione viene annullata.',
          },
        ],
      },
      {
        title: 'Dati e sicurezza',
        items: [
          {
            q: 'Dove sono conservati i miei dati?',
            a: 'Sul tuo server: il database e i file dei progetti, sul suo disco o in uno storage compatibile S3. Progetti, cronologia, account e compilazioni non ne escono mai.',
          },
          {
            q: 'Posso farne il backup?',
            a: 'Sì. Impostazioni → Archiviazione e backup invia database, file e cronologia a una cartella WebDAV secondo una pianificazione, crittografati se imposti una password.',
          },
          {
            q: 'La compilazione è sicura?',
            a: 'TeX gira in un container a sé senza accesso a internet, con un sistema in sola lettura, nessun privilegio aggiuntivo e limiti su memoria e processi.',
          },
          {
            q: 'Chi può creare un account?',
            a: 'Nessuno registrandosi. Gli account nascono da link di invito che l’amministratore di sistema, o un amministratore per il proprio team, passa ad altri.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Ospitato su GitHub Pages',
  },
} satisfies typeof en
