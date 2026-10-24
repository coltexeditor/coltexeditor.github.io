import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex: ein selbst gehosteter kollaborativer LaTeX-Editor',
    description:
      'ColTex ist ein selbst gehosteter kollaborativer LaTeX-Editor mit integriertem KI-Agenten: eine Alternative zu Overleaf, die auf Ihrem eigenen Server läuft.',
  },
  nav: {
    docs: 'Dokumentation',
    language: 'Sprache',
    theme: 'Zwischen hell und dunkel wechseln',
  },
  hero: {
    tagline: 'Ein selbst gehosteter kollaborativer LaTeX-Editor mit integriertem KI-Agenten.',
    points: ['Ihr Server', 'Ihre Konten', 'Ihre Daten', 'Zusammenarbeit in Echtzeit', 'Open Source (AGPL-3.0)'],
    copy: 'Kopieren',
    copied: 'Kopiert',
    replay: 'Erneut abspielen',
    github: 'Auf GitHub ansehen',
  },
  install: {
    title: 'Installation',
    steps: [
      'Führen Sie den Befehl auf einem Linux- oder macOS-Rechner mit Docker aus. Unter Linux kann das Installationsprogramm Docker einrichten.',
      'Wählen Sie die TeX-Live-Edition mit den Pfeiltasten. Das Installationsprogramm lädt die vorgefertigten Images (x86-64 oder ARM64) herunter und startet ColTex.',
      'Öffnen Sie http://<server>:3690 und erstellen Sie das Administratorkonto.',
    ],
    recommended: 'Empfohlen: 2 CPU-Kerne und mindestens 4 GB Arbeitsspeicher.',
  },
  docs: {
    title: 'Dokumentation',
    onThisPage: 'Auf dieser Seite',
  },
  tour: {
    chapters: ['Anmelden', 'Arbeitsbereich', 'Schreiben', 'Visueller Editor', 'Zusammenarbeit', 'KI-Agent', 'Prüfen', 'Literatur', 'Verlauf', 'Einstellungen', 'Verwaltung'],
    try: 'Demo ausprobieren',
    note: 'Die Demo läuft vollständig in Ihrem Browser.',
  },
  why: {
    title: 'Warum ColTex?',
    lead: 'ColTex ist eine Alternative zu Overleaf für eine Arbeitsgruppe, ein Labor oder nur für Sie selbst und läuft auf einem Rechner unter Ihrer Kontrolle: einem Desktop-PC im Labor, einem Heimserver oder einer Cloud-Maschine.',
    items: [
      {
        title: 'Alles bleibt auf Ihrem Server',
        text: 'Projekte, Verlauf, Konten und Kompilieraufträge verlassen ihn nie. TeX läuft in einem abgeschotteten Container ohne Internetzugang.',
      },
      {
        title: 'Für gemeinsames Schreiben gebaut',
        text: 'Mehrere Personen bearbeiten dieselbe Datei gleichzeitig, mit Kommentaren, Änderungsnachverfolgung, Chat und Versionsverlauf.',
      },
      {
        title: 'Ein KI-Agent, der an Ihrem Projekt arbeitet',
        text: 'Er liest die Dateien und das Kompilierprotokoll, entwirft Änderungen, kompiliert sie testweise und zeigt Ihnen einen Diff. Nichts wird geschrieben, bevor Sie es übernehmen.',
      },
      {
        title: 'Ein Befehl zur Installation, keine Ports zu öffnen',
        text: 'Tailscale und Cloudflare Tunnel sind für den Fernzugriff eingebaut.',
      },
    ],
  },
  features: {
    title: 'Funktionen',
    groups: [
      {
        title: 'Schreiben und Kompilieren',
        items: [
          'Code-Editor und ein visueller Editor mit Tabelleneditor, Abbildungsdialog, Werkzeugleiste, Symbolpalette, Gliederung und Brotkrümelnavigation.',
          'LaTeX-Vervollständigung, Codeprüfung, Formelvorschau, Rechtschreibprüfung in vielen Sprachen, Wortzählung, projektweites Suchen und Ersetzen, Vim- oder Emacs-Tastenbelegung.',
          'Kompiliert mit latexmk auf einem vollständigen TeX Live. Die Engine (pdfLaTeX, XeLaTeX oder LuaLaTeX) wird anhand des Dokuments gewählt, auch für Chinesisch.',
          'PDF-Vorschau mit SyncTeX in beide Richtungen, auch in einem separaten Fenster. Kompilierfehler werden im Quelltext unterstrichen, mit verständlichen Hinweisen.',
          'Literatur: aus Ihren .bib-Dateien zitieren, Einträge aus Crossref und arXiv oder per DOI hinzufügen oder eine Zotero-Bibliothek synchron halten.',
        ],
      },
      {
        title: 'Zusammenarbeit',
        items: [
          'Bearbeitung in Echtzeit mit den Cursorn aller, Kommentare mit @-Erwähnungen, Änderungsnachverfolgung, Projekt-Chat und Benachrichtigungen.',
          'Rollen pro Projekt: Eigentümer, Bearbeiter, Prüfer (nur Vorschläge) und Betrachter.',
          'Versionsverlauf wie bei git: automatische Versionen, mit einer Nachricht gespeicherte Versionen und das Zurücknehmen der Änderungen einer einzelnen Version.',
          'Git-Zugriff: ein Projekt klonen, lokal daran arbeiten und zurückpushen.',
        ],
      },
      {
        title: 'KI-Agent',
        items: [
          'Fragen Sie zu LaTeX, Ihrem Projekt oder Ihrem Text, oder lassen Sie ihn Kompilierfehler beheben. Er entwirft Änderungen in einer privaten Kopie, kompiliert sie testweise und zeigt einen Diff.',
          'Beim Übernehmen wird zuerst eine Version gespeichert und neu kompiliert; verschlechtert sich der Build, wird die Änderung zurückgerollt.',
          'API-Schlüssel (Anthropic, OpenAI, DeepSeek, Google, OpenRouter und weitere), Anmeldung mit einem Abonnement (Claude, ChatGPT, GitHub Copilot und weitere) oder Ihr eigener Server (Ollama, vLLM, LM Studio).',
          'Skills, die Sie schreiben oder importieren, Berechtigungen von Manuell bis Vollzugriff und Ihr eigener Agent (Claude Code, Codex, Cursor…) über MCP.',
        ],
      },
      {
        title: 'Projekte und Verwaltung',
        items: [
          'Vorlagen für IEEE, ACM, Springer LNCS, Elsevier, REVTeX und arXiv sowie die Umwandlung von einer Zeitschriftenvorlage in eine andere.',
          'Import und Export von Overleaf-ZIP-Dateien, verknüpfte Dateien, Tags, Archiv und Papierkorb.',
          'Keine öffentliche Registrierung: Konten entstehen über Einladungslinks.',
          'Überwachung, WebDAV-Backups, lokaler oder S3-kompatibler Speicher, Designs und eine Oberfläche in 14 Sprachen.',
        ],
      },
    ],
  },
  editions: {
    title: 'Zwei TeX-Live-Editionen',
    lead: 'Beide enthalten alle TeX-Live-Pakete und kompilieren dieselben Dokumente. Die Edition Full fügt die Handbücher und Quellen hinzu, die auch der KI-Agent lesen kann.',
    head: ['Edition', 'Download', 'Festplatte (ColTex gesamt)', 'Benötigter freier Speicher'],
    rows: [
      ['Standard (Voreinstellung)', 'etwa 3 GB', 'etwa 12 GB', '20 GB'],
      ['Full (--edition full)', 'etwa 8 GB', 'etwa 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Häufige Fragen',
    categories: [
      {
        title: 'Allgemein',
        items: [
          {
            q: 'Ist ColTex kostenlos?',
            a: 'Ja. Es ist Open Source unter der AGPL-3.0 und läuft auf Ihrem eigenen Rechner. KI-Anbieter, die Sie verbinden, rechnen selbst mit Ihnen ab.',
          },
          {
            q: 'Was unterscheidet es von Overleaf?',
            a: 'Es funktioniert ganz ähnlich wie Overleaf: der Quelltext neben dem PDF, Kommentare, Änderungsnachverfolgung und Verlauf. Es läuft auf einem Server unter Ihrer Kontrolle, und ein KI-Agent ist integriert.',
          },
          {
            q: 'Gibt es eine gehostete Version?',
            a: 'Nein. ColTex läuft auf einem Rechner unter Ihrer Kontrolle. Wenn Sie sich zuerst umsehen möchten, probieren Sie die Demo auf dieser Website; sie läuft in Ihrem Browser.',
          },
        ],
      },
      {
        title: 'Installation',
        items: [
          {
            q: 'Was brauche ich für den Betrieb?',
            a: 'Einen Linux- oder macOS-Rechner mit Docker (unter Linux kann das Installationsprogramm es einrichten) und etwa 20 GB freien Speicherplatz. Empfohlen sind 2 CPU-Kerne und mindestens 4 GB Arbeitsspeicher.',
          },
          {
            q: 'Welche TeX-Live-Edition soll ich wählen?',
            a: 'Standard enthält alle Pakete und kompiliert dieselben Dokumente. Full fügt die Handbücher und Quellen der Pakete hinzu, die auch der KI-Agent lesen kann, für etwa 11 GB mehr. Sie können später mit coltex edition full wechseln.',
          },
          {
            q: 'Läuft es unter Windows?',
            a: 'Das Installationsprogramm läuft unter Linux und macOS. Unter Windows installieren Sie ColTex auf einem Linux-Rechner oder -Server und öffnen es im Browser.',
          },
          {
            q: 'Kann ich meine eigene Domain mit HTTPS verwenden?',
            a: 'Ja. Installieren Sie mit --domain tex.example.org, dann holt das mitgelieferte Caddy die Zertifikate. Lassen Sie die Domain auf den Server zeigen und öffnen Sie die Ports 80 und 443.',
          },
          {
            q: 'Wie aktualisiere ich?',
            a: 'Führen Sie coltex update aus. Es holt die neueste Version; Ihre Einstellungen und Daten bleiben erhalten.',
          },
        ],
      },
      {
        title: 'Schreiben und Zusammenarbeit',
        items: [
          {
            q: 'Kann ich meine Overleaf-Projekte mitnehmen?',
            a: 'Ja. Importieren Sie die ZIP-Datei eines Projekts aus Overleaf; ColTex exportiert ZIP-Dateien auf dieselbe Weise.',
          },
          {
            q: 'Können mehrere Personen gleichzeitig bearbeiten?',
            a: 'Ja, mit den Cursorn aller, Kommentaren, Änderungsnachverfolgung und einem Projekt-Chat. Jedes Projekt hat Eigentümer, Bearbeiter, Prüfer (nur Vorschläge) und Betrachter.',
          },
          {
            q: 'Wie erreichen andere es von außen?',
            a: 'Schalten Sie Tailscale oder Cloudflare Tunnel unter Einstellungen → Netzwerk ein, ohne Ports zu öffnen. Ein Server mit eigener Domain kann HTTPS mit --domain verwenden.',
          },
          {
            q: 'Kann ich mit Git an einem Projekt arbeiten?',
            a: 'Ja. Klonen Sie es mit einem persönlichen Token, arbeiten Sie lokal daran und pushen Sie zurück; inzwischen im Browser gemachte Änderungen werden zusammengeführt.',
          },
          {
            q: 'Kompiliert es Chinesisch, Japanisch und Koreanisch?',
            a: 'Ja. Die Engine wird anhand des Dokuments gewählt, daher kompilieren Dokumente mit ctex und xeCJK ohne weitere Einstellung mit XeLaTeX.',
          },
        ],
      },
      {
        title: 'KI-Agent',
        items: [
          {
            q: 'Braucht der KI-Agent ein Abonnement?',
            a: 'Er braucht ein Modell: einen API-Schlüssel, die Anmeldung mit einem Abonnement oder Ihren eigenen OpenAI-kompatiblen Server. Alles andere funktioniert ohne.',
          },
          {
            q: 'Welche Modelle kann er verwenden?',
            a: 'API-Schlüssel (Anthropic, OpenAI, DeepSeek, Google, OpenRouter und weitere), Anmeldungen mit einem Abonnement (Claude, ChatGPT, GitHub Copilot und weitere) oder Ihren eigenen Server wie Ollama, vLLM oder LM Studio. Der Administrator verbindet sie.',
          },
          {
            q: 'Gelangen meine Texte zum KI-Anbieter?',
            a: 'Nur was der Agent für eine Ihrer Anfragen liest, und nur zum Anbieter des gewählten Modells. Mit einem Modell auf Ihrem eigenen Server verlässt nichts den Server.',
          },
          {
            q: 'Kann der KI-Agent meine Dateien ohne Rückfrage ändern?',
            a: 'Nur wenn Sie es erlauben. Bei Manuell sind seine Änderungen ein Entwurf, den Sie prüfen und übernehmen; beim Übernehmen wird zuerst eine Version gespeichert, und eine Änderung, die den Build verschlechtert, wird zurückgerollt.',
          },
        ],
      },
      {
        title: 'Daten und Sicherheit',
        items: [
          {
            q: 'Wo werden meine Daten gespeichert?',
            a: 'Auf Ihrem Server: die Datenbank und die Projektdateien, auf seiner Festplatte oder in S3-kompatiblem Speicher. Projekte, Verlauf, Konten und Kompilieraufträge verlassen ihn nie.',
          },
          {
            q: 'Kann ich Backups erstellen?',
            a: 'Ja. Einstellungen → Speicher & Backups sendet Datenbank, Dateien und Verlauf nach Zeitplan in einen WebDAV-Ordner, verschlüsselt, wenn Sie ein Passwort festlegen.',
          },
          {
            q: 'Ist das Kompilieren sicher?',
            a: 'TeX läuft in einem eigenen Container ohne Internetzugang, mit schreibgeschütztem System, ohne zusätzliche Rechte und mit Limits für Arbeitsspeicher und Prozesse.',
          },
          {
            q: 'Wer kann ein Konto erstellen?',
            a: 'Niemand durch Registrierung. Konten entstehen über Einladungslinks, die der Systemadministrator oder ein Admin für sein Team weitergibt.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Bereitgestellt mit GitHub Pages',
  },
} satisfies typeof en
