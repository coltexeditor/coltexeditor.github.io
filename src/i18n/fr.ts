import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex : un éditeur LaTeX collaboratif auto-hébergé',
    description:
      'ColTex est un éditeur LaTeX collaboratif auto-hébergé avec un agent IA intégré : une alternative à Overleaf qui fonctionne sur votre propre serveur.',
  },
  nav: {
    docs: 'Documentation',
    language: 'Langue',
    theme: 'Basculer entre clair et sombre',
  },
  hero: {
    tagline: 'Un éditeur LaTeX collaboratif auto-hébergé, avec un agent IA intégré.',
    points: ['Votre serveur', 'Vos comptes', 'Vos données', 'Collaboration en temps réel', 'Open source (AGPL-3.0)'],
    copy: 'Copier',
    copied: 'Copié',
    replay: 'Rejouer',
    github: 'Voir sur GitHub',
  },
  install: {
    title: 'Installation',
    steps: [
      'Lancez la commande sur une machine Linux ou macOS avec Docker. Sous Linux, l’installateur peut installer Docker.',
      'Choisissez l’édition de TeX Live avec les touches fléchées. L’installateur télécharge les images précompilées (x86-64 ou ARM64) et démarre ColTex.',
      'Ouvrez http://<serveur>:3690 et créez le compte administrateur.',
    ],
    recommended: 'Recommandé : 2 cœurs de CPU et 4 Go de mémoire ou plus.',
  },
  docs: {
    title: 'Documentation',
    onThisPage: 'Sur cette page',
  },
  tour: {
    chapters: ['Se connecter', 'Espace de travail', 'Rédaction', 'Éditeur visuel', 'Collaboration', 'Agent IA', 'Relecture', 'Références', 'Historique', 'Paramètres', 'Administration'],
    try: 'Essayer la démo',
    note: 'La démo fonctionne entièrement dans votre navigateur.',
  },
  why: {
    title: 'Pourquoi ColTex ?',
    lead: 'ColTex est une alternative à Overleaf pour une équipe de recherche, un laboratoire ou vous seul, qui fonctionne sur un ordinateur que vous contrôlez : un poste du labo, un serveur à la maison ou une machine dans le cloud.',
    items: [
      {
        title: 'Tout reste sur votre serveur',
        text: 'Les projets, l’historique, les comptes et les compilations n’en sortent jamais. TeX s’exécute dans un conteneur isolé, sans accès à Internet.',
      },
      {
        title: 'Conçu pour écrire à plusieurs',
        text: 'Plusieurs personnes modifient le même fichier en même temps, avec commentaires, suivi des modifications, discussion et historique des versions.',
      },
      {
        title: 'Un agent IA qui travaille sur votre projet',
        text: 'Il lit les fichiers et le journal de compilation, rédige des modifications, les compile pour essai et vous montre un diff. Rien n’est écrit tant que vous ne l’appliquez pas.',
      },
      {
        title: 'Une seule commande pour installer, aucun port à ouvrir',
        text: 'Tailscale et Cloudflare Tunnel sont intégrés pour l’accès à distance.',
      },
    ],
  },
  features: {
    title: 'Fonctionnalités',
    groups: [
      {
        title: 'Écrire et compiler',
        items: [
          'Éditeur de code et éditeur visuel avec éditeur de tableaux, boîte de dialogue des figures, barre d’outils, palette de symboles, plan et fil d’Ariane.',
          'Complétions LaTeX, vérification du code, aperçu des équations, vérification orthographique dans de nombreuses langues, nombre de mots, recherche et remplacement dans tout le projet, raccourcis Vim ou Emacs.',
          'Compilation avec latexmk sur un TeX Live complet. Le moteur (pdfLaTeX, XeLaTeX ou LuaLaTeX) est choisi d’après le document, chinois compris.',
          'Aperçu PDF avec SyncTeX dans les deux sens, y compris dans une fenêtre séparée. Les erreurs de compilation sont soulignées dans la source, avec des explications en langage clair.',
          'Références : citez depuis vos fichiers .bib, ajoutez des entrées depuis Crossref et arXiv ou par DOI, ou gardez une bibliothèque Zotero synchronisée.',
        ],
      },
      {
        title: 'Collaboration',
        items: [
          'Édition en temps réel avec les curseurs de chacun, commentaires avec @mentions, suivi des modifications, discussion du projet et notifications.',
          'Rôles par projet : propriétaire, éditeur, relecteur (suggestions uniquement) et lecteur.',
          'Historique des versions à la manière de git : versions automatiques, versions enregistrées avec un message, et annulation des modifications d’une version.',
          'Accès Git : clonez un projet, travaillez-y en local et poussez vos modifications.',
        ],
      },
      {
        title: 'Agent IA',
        items: [
          'Posez des questions sur LaTeX, votre projet ou votre rédaction, ou laissez-le corriger les erreurs de compilation. Il rédige les modifications dans une copie privée, les compile pour essai et affiche un diff.',
          'L’application enregistre d’abord une version et recompile ; si la compilation se dégrade, la modification est annulée.',
          'Clés API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter et d’autres), connexion par abonnement (Claude, ChatGPT, GitHub Copilot et d’autres), ou votre propre serveur (Ollama, vLLM, LM Studio).',
          'Des skills que vous écrivez ou importez, des autorisations de Manuel à Accès complet, et votre propre agent (Claude Code, Codex, Cursor…) via MCP.',
        ],
      },
      {
        title: 'Projets et administration',
        items: [
          'Modèles pour IEEE, ACM, Springer LNCS, Elsevier, REVTeX et arXiv, et conversion d’un modèle de revue à un autre.',
          'Import et export de zip Overleaf, fichiers liés, étiquettes, archive et corbeille.',
          'Pas d’inscription publique : les comptes viennent de liens d’invitation.',
          'Surveillance, sauvegardes WebDAV, stockage local ou compatible S3, thèmes, et une interface en 14 langues.',
        ],
      },
    ],
  },
  editions: {
    title: 'Deux éditions de TeX Live',
    lead: 'Les deux contiennent tous les packages de TeX Live et compilent les mêmes documents. L’édition full ajoute les manuels et les sources, que l’agent IA peut aussi lire.',
    head: ['Édition', 'Téléchargement', 'Disque (tout ColTex)', 'Espace libre à prévoir'],
    rows: [
      ['Standard (par défaut)', 'environ 3 Go', 'environ 12 Go', '20 Go'],
      ['Full (--edition full)', 'environ 8 Go', 'environ 23 Go', '35 Go'],
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    categories: [
      {
        title: 'Général',
        items: [
          {
            q: 'ColTex est-il gratuit ?',
            a: 'Oui. Il est open source sous licence AGPL-3.0 et fonctionne sur votre propre machine. Les fournisseurs d’IA que vous connectez vous facturent eux-mêmes.',
          },
          {
            q: 'En quoi est-il différent d’Overleaf ?',
            a: 'Il fonctionne un peu comme Overleaf : la source à côté du PDF, les commentaires, le suivi des modifications et l’historique. Il tourne sur un serveur que vous contrôlez, et un agent IA est intégré.',
          },
          {
            q: 'Existe-t-il une version hébergée ?',
            a: 'Non. ColTex fonctionne sur un ordinateur que vous contrôlez. Pour le découvrir d’abord, essayez la démo de ce site ; elle fonctionne dans votre navigateur.',
          },
        ],
      },
      {
        title: 'Installation',
        items: [
          {
            q: 'De quoi ai-je besoin pour le faire fonctionner ?',
            a: 'Une machine Linux ou macOS avec Docker (sous Linux, l’installateur peut l’installer) et environ 20 Go d’espace disque libre. 2 cœurs de CPU et 4 Go de mémoire ou plus sont recommandés.',
          },
          {
            q: 'Quelle édition de TeX Live choisir ?',
            a: 'Standard contient tous les packages et compile les mêmes documents. Full ajoute les manuels et les sources des packages, que l’agent IA peut aussi lire, pour environ 11 Go de plus. Vous pouvez changer plus tard avec coltex edition full.',
          },
          {
            q: 'Fonctionne-t-il sous Windows ?',
            a: 'L’installateur fonctionne sous Linux et macOS. Sous Windows, installez ColTex sur une machine ou un serveur Linux et ouvrez-le dans le navigateur.',
          },
          {
            q: 'Puis-je utiliser mon propre domaine avec HTTPS ?',
            a: 'Oui. Installez avec --domain tex.example.org et le Caddy fourni obtient les certificats. Faites pointer le domaine vers le serveur et ouvrez les ports 80 et 443.',
          },
          {
            q: 'Comment mettre à jour ?',
            a: 'Lancez coltex update. La commande récupère la dernière version publiée ; vos réglages et vos données sont conservés.',
          },
        ],
      },
      {
        title: 'Rédaction et collaboration',
        items: [
          {
            q: 'Puis-je reprendre mes projets Overleaf ?',
            a: 'Oui. Importez le zip d’un projet Overleaf ; ColTex exporte les zips de la même façon.',
          },
          {
            q: 'Plusieurs personnes peuvent-elles modifier en même temps ?',
            a: 'Oui, avec les curseurs de chacun, les commentaires, le suivi des modifications et une discussion de projet. Chaque projet a des propriétaires, des éditeurs, des relecteurs (suggestions uniquement) et des lecteurs.',
          },
          {
            q: 'Comment les autres y accèdent-ils depuis l’extérieur ?',
            a: 'Activez Tailscale ou Cloudflare Tunnel dans Paramètres → Réseau, sans port à ouvrir. Un serveur avec son propre domaine peut utiliser HTTPS avec --domain.',
          },
          {
            q: 'Puis-je travailler sur un projet avec Git ?',
            a: 'Oui. Clonez-le avec un jeton personnel, travaillez-y en local et poussez vos modifications ; celles faites entre-temps dans le navigateur sont fusionnées.',
          },
          {
            q: 'Compile-t-il le chinois, le japonais et le coréen ?',
            a: 'Oui. Le moteur est choisi d’après le document : les documents ctex et xeCJK compilent avec XeLaTeX sans aucun réglage.',
          },
        ],
      },
      {
        title: 'Agent IA',
        items: [
          {
            q: 'L’agent IA nécessite-t-il un abonnement ?',
            a: 'Il lui faut un modèle : une clé API, une connexion par abonnement ou votre propre serveur compatible OpenAI. Tout le reste fonctionne sans.',
          },
          {
            q: 'Quels modèles peut-il utiliser ?',
            a: 'Des clés API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter et d’autres), des connexions par abonnement (Claude, ChatGPT, GitHub Copilot et d’autres), ou votre propre serveur comme Ollama, vLLM ou LM Studio. L’administrateur les connecte.',
          },
          {
            q: 'Mes textes sont-ils envoyés au fournisseur d’IA ?',
            a: 'Seulement ce que l’agent lit pour une demande que vous faites, et seulement au fournisseur du modèle choisi. Avec un modèle sur votre propre serveur, rien n’en sort.',
          },
          {
            q: 'L’agent IA peut-il modifier mes fichiers sans demander ?',
            a: 'Pas sans votre accord. En Manuel, ses modifications forment un brouillon que vous relisez et appliquez ; l’application enregistre d’abord une version, et une modification qui dégrade la compilation est annulée.',
          },
        ],
      },
      {
        title: 'Données et sécurité',
        items: [
          {
            q: 'Où sont conservées mes données ?',
            a: 'Sur votre serveur : la base de données et les fichiers des projets, sur son disque ou dans un stockage compatible S3. Les projets, l’historique, les comptes et les compilations n’en sortent jamais.',
          },
          {
            q: 'Puis-je le sauvegarder ?',
            a: 'Oui. Paramètres → Stockage et sauvegardes envoie la base de données, les fichiers et l’historique vers un dossier WebDAV selon une planification, chiffrés si vous définissez un mot de passe.',
          },
          {
            q: 'La compilation est-elle sûre ?',
            a: 'TeX s’exécute dans son propre conteneur sans accès à Internet, avec un système en lecture seule, sans privilèges supplémentaires et avec des limites de mémoire et de processus.',
          },
          {
            q: 'Qui peut créer un compte ?',
            a: 'Personne par inscription. Les comptes viennent de liens d’invitation transmis par l’administrateur système, ou par un administrateur pour son équipe.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Hébergé par GitHub Pages',
  },
} satisfies typeof en
