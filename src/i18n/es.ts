import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex: un editor de LaTeX colaborativo y autoalojado',
    description:
      'ColTex es un editor de LaTeX colaborativo y autoalojado, con un agente de IA integrado: una alternativa a Overleaf que se ejecuta en tu propio servidor.',
  },
  nav: {
    docs: 'Documentación',
    language: 'Idioma',
    theme: 'Cambiar entre claro y oscuro',
  },
  hero: {
    tagline: 'Un editor de LaTeX colaborativo y autoalojado, con un agente de IA integrado.',
    points: ['Tu servidor', 'Tus cuentas', 'Tus datos', 'Colaboración en tiempo real', 'Código abierto (AGPL-3.0)'],
    copy: 'Copiar',
    copied: 'Copiado',
    replay: 'Volver a reproducir',
    github: 'Ver en GitHub',
  },
  install: {
    title: 'Instalación',
    steps: [
      'Ejecuta el comando en una máquina Linux o macOS con Docker. En Linux, el instalador puede configurar Docker.',
      'Elige la edición de TeX Live con las flechas. El instalador descarga las imágenes precompiladas (x86-64 o ARM64) e inicia ColTex.',
      'Abre http://<servidor>:3690 y crea la cuenta de administrador.',
    ],
    recommended: 'Recomendado: 2 núcleos de CPU y 4 GB de memoria o más.',
  },
  docs: {
    title: 'Documentación',
    onThisPage: 'En esta página',
  },
  tour: {
    chapters: ['Iniciar sesión', 'Espacio de trabajo', 'Escritura', 'Editor visual', 'Colaboración', 'Agente de IA', 'Revisión', 'Referencias', 'Historial', 'Configuración', 'Administración'],
    try: 'Probar la demo',
    note: 'La demo se ejecuta por completo en tu navegador.',
  },
  why: {
    title: '¿Por qué ColTex?',
    lead: 'ColTex es una alternativa a Overleaf para un grupo de investigación, un laboratorio o para ti solo, que se ejecuta en un equipo que tú controlas: un ordenador del laboratorio, un servidor en casa o una máquina en la nube.',
    items: [
      {
        title: 'Todo se queda en tu servidor',
        text: 'Los proyectos, el historial, las cuentas y las compilaciones nunca salen de él. TeX se ejecuta en un contenedor aislado sin acceso a internet.',
      },
      {
        title: 'Pensado para escribir en equipo',
        text: 'Varias personas editan el mismo archivo a la vez, con comentarios, control de cambios, chat e historial de versiones.',
      },
      {
        title: 'Un agente de IA que trabaja en tu proyecto',
        text: 'Lee los archivos y el registro de compilación, prepara cambios, los compila de prueba y te muestra un diff. No se escribe nada hasta que lo apliques.',
      },
      {
        title: 'Un solo comando para instalar, sin abrir puertos',
        text: 'Tailscale y Cloudflare Tunnel vienen integrados para el acceso remoto.',
      },
    ],
  },
  features: {
    title: 'Funciones',
    groups: [
      {
        title: 'Escritura y compilación',
        items: [
          'Editor de código y editor visual con editor de tablas, diálogo de figuras, barra de herramientas, paleta de símbolos, esquema y ruta de navegación.',
          'Autocompletado de LaTeX, revisión de código, vista previa de ecuaciones, revisión ortográfica en muchos idiomas, recuento de palabras, búsqueda y reemplazo en todo el proyecto, teclas de Vim o Emacs.',
          'Compila con latexmk sobre un TeX Live completo. El motor (pdfLaTeX, XeLaTeX o LuaLaTeX) se elige a partir del documento, incluido el chino.',
          'Vista previa del PDF con SyncTeX en ambos sentidos, también en una ventana aparte. Los errores de compilación se subrayan en el código, con indicaciones en lenguaje sencillo.',
          'Referencias: cita desde tus archivos .bib, añade entradas desde Crossref y arXiv o por DOI, o mantén sincronizada una biblioteca de Zotero.',
        ],
      },
      {
        title: 'Colaboración',
        items: [
          'Edición en tiempo real con los cursores de todos, comentarios con @menciones, control de cambios, chat del proyecto y notificaciones.',
          'Roles por proyecto: propietario, editor, revisor (solo sugerencias) y lector.',
          'Historial de versiones como en git: versiones automáticas, versiones guardadas con un mensaje y la posibilidad de deshacer los cambios de una versión.',
          'Acceso por Git: clona un proyecto, trabaja en él en local y haz push de vuelta.',
        ],
      },
      {
        title: 'Agente de IA',
        items: [
          'Pregunta sobre LaTeX, tu proyecto o tu redacción, o deja que corrija errores de compilación. Prepara los cambios en una copia privada, los compila de prueba y muestra un diff.',
          'Al aplicar, primero se guarda una versión y se recompila; si la compilación empeora, el cambio se revierte.',
          'Claves de API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter y más), inicio de sesión con suscripción (Claude, ChatGPT, GitHub Copilot y más) o tu propio servidor (Ollama, vLLM, LM Studio).',
          'Skills que escribes o importas, permisos desde Manual hasta Acceso total, y tu propio agente (Claude Code, Codex, Cursor…) mediante MCP.',
        ],
      },
      {
        title: 'Proyectos y administración',
        items: [
          'Plantillas para IEEE, ACM, Springer LNCS, Elsevier, REVTeX y arXiv, y conversión de una plantilla de revista a otra.',
          'Importación y exportación de zip de Overleaf, archivos vinculados, etiquetas, archivo y papelera.',
          'Sin registro público: las cuentas se crean con enlaces de invitación.',
          'Monitorización, copias de seguridad en WebDAV, almacenamiento local o compatible con S3, temas y una interfaz en 14 idiomas.',
        ],
      },
    ],
  },
  editions: {
    title: 'Dos ediciones de TeX Live',
    lead: 'Ambas tienen todos los paquetes de TeX Live y compilan los mismos documentos. La edición full añade los manuales y las fuentes, que el agente de IA también puede leer.',
    head: ['Edición', 'Descarga', 'Disco (todo ColTex)', 'Espacio libre necesario'],
    rows: [
      ['Standard (predeterminada)', 'unos 3 GB', 'unos 12 GB', '20 GB'],
      ['Full (--edition full)', 'unos 8 GB', 'unos 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Preguntas frecuentes',
    categories: [
      {
        title: 'General',
        items: [
          {
            q: '¿ColTex es gratuito?',
            a: 'Sí. Es código abierto bajo la AGPL-3.0 y se ejecuta en tu propia máquina. Los proveedores de IA que conectes te facturan por su cuenta.',
          },
          {
            q: '¿En qué se diferencia de Overleaf?',
            a: 'Funciona de forma muy parecida a Overleaf: el código junto al PDF, comentarios, control de cambios e historial. Se ejecuta en un servidor que tú controlas e incluye un agente de IA.',
          },
          {
            q: '¿Hay una versión alojada?',
            a: 'No. ColTex se ejecuta en un equipo que tú controlas. Para echar un vistazo antes, prueba la demo de este sitio; se ejecuta en tu navegador.',
          },
        ],
      },
      {
        title: 'Instalación',
        items: [
          {
            q: '¿Qué necesito para ejecutarlo?',
            a: 'Una máquina Linux o macOS con Docker (en Linux el instalador puede configurarlo) y unos 20 GB de disco libre. Se recomiendan 2 núcleos de CPU y 4 GB de memoria o más.',
          },
          {
            q: '¿Qué edición de TeX Live elijo?',
            a: 'Standard tiene todos los paquetes y compila los mismos documentos. Full añade los manuales y las fuentes de los paquetes, que el agente de IA también puede leer, por unos 11 GB más. Puedes cambiar más tarde con coltex edition full.',
          },
          {
            q: '¿Funciona en Windows?',
            a: 'El instalador funciona en Linux y macOS. En Windows, instala ColTex en una máquina o un servidor Linux y ábrelo en el navegador.',
          },
          {
            q: '¿Puedo usar mi propio dominio con HTTPS?',
            a: 'Sí. Instala con --domain tex.example.org y el Caddy incluido obtiene los certificados. Apunta el dominio al servidor y abre los puertos 80 y 443.',
          },
          {
            q: '¿Cómo actualizo?',
            a: 'Ejecuta coltex update. Descarga la última versión; tu configuración y tus datos se conservan.',
          },
        ],
      },
      {
        title: 'Escritura y colaboración',
        items: [
          {
            q: '¿Puedo traer mis proyectos de Overleaf?',
            a: 'Sí. Importa el zip de un proyecto de Overleaf; ColTex exporta los zips del mismo modo.',
          },
          {
            q: '¿Pueden editar varias personas a la vez?',
            a: 'Sí, con los cursores de todos, comentarios, control de cambios y un chat del proyecto. Cada proyecto tiene propietarios, editores, revisores (solo sugerencias) y lectores.',
          },
          {
            q: '¿Cómo acceden otras personas desde fuera?',
            a: 'Activa Tailscale o Cloudflare Tunnel en Configuración → Red, sin abrir puertos. Un servidor con dominio propio puede usar HTTPS con --domain.',
          },
          {
            q: '¿Puedo trabajar en un proyecto con Git?',
            a: 'Sí. Clónalo con un token personal, trabaja en local y haz push de vuelta; las ediciones hechas mientras tanto en el navegador se combinan.',
          },
          {
            q: '¿Compila chino, japonés y coreano?',
            a: 'Sí. El motor se elige a partir del documento, así que los documentos con ctex y xeCJK compilan con XeLaTeX sin configurar nada.',
          },
        ],
      },
      {
        title: 'Agente de IA',
        items: [
          {
            q: '¿El agente de IA necesita una suscripción?',
            a: 'Necesita un modelo: una clave de API, un inicio de sesión con suscripción o tu propio servidor compatible con OpenAI. Todo lo demás funciona sin él.',
          },
          {
            q: '¿Qué modelos puede usar?',
            a: 'Claves de API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter y más), inicios de sesión con suscripción (Claude, ChatGPT, GitHub Copilot y más) o tu propio servidor, como Ollama, vLLM o LM Studio. El administrador los conecta.',
          },
          {
            q: '¿Mi texto llega al proveedor de IA?',
            a: 'Solo lo que el agente lee para una petición que haces, y solo al proveedor del modelo que elegiste. Con un modelo en tu propio servidor, nada sale de él.',
          },
          {
            q: '¿Puede el agente de IA cambiar mis archivos sin preguntar?',
            a: 'No, salvo que lo permitas. En Manual, sus cambios son un borrador que revisas y aplicas; al aplicar se guarda primero una versión, y un cambio que empeora la compilación se revierte.',
          },
        ],
      },
      {
        title: 'Datos y seguridad',
        items: [
          {
            q: '¿Dónde se guardan mis datos?',
            a: 'En tu servidor: la base de datos y los archivos de los proyectos, en su disco o en un almacenamiento compatible con S3. Los proyectos, el historial, las cuentas y las compilaciones nunca salen de él.',
          },
          {
            q: '¿Puedo hacer copias de seguridad?',
            a: 'Sí. Configuración → Almacenamiento y copias de seguridad envía la base de datos, los archivos y el historial a una carpeta WebDAV de forma programada, cifrados si defines una contraseña.',
          },
          {
            q: '¿Es seguro compilar?',
            a: 'TeX se ejecuta en un contenedor propio sin acceso a internet, con un sistema de solo lectura, sin privilegios adicionales y con límites de memoria y de procesos.',
          },
          {
            q: '¿Quién puede crear una cuenta?',
            a: 'Nadie mediante registro. Las cuentas se crean con enlaces de invitación que comparte el administrador del sistema, o un administrador para su equipo.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Alojado en GitHub Pages',
  },
} satisfies typeof en
