import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex: um editor de LaTeX colaborativo e auto-hospedado',
    description:
      'O ColTex é um editor de LaTeX colaborativo e auto-hospedado, com agente de IA integrado: uma alternativa ao Overleaf que roda no seu próprio servidor.',
  },
  nav: {
    docs: 'Documentação',
    language: 'Idioma',
    theme: 'Alternar entre claro e escuro',
  },
  hero: {
    tagline: 'Um editor de LaTeX colaborativo e auto-hospedado, com agente de IA integrado.',
    points: ['Seu servidor', 'Suas contas', 'Seus dados', 'Colaboração em tempo real', 'Código aberto (AGPL-3.0)'],
    copy: 'Copiar',
    copied: 'Copiado',
    replay: 'Repetir',
    github: 'Ver no GitHub',
  },
  install: {
    title: 'Instalação',
    steps: [
      'Execute o comando em uma máquina Linux ou macOS com Docker. No Linux, o instalador pode configurar o Docker.',
      'Escolha a edição do TeX Live com as setas do teclado. O instalador baixa as imagens pré-compiladas (x86-64 ou ARM64) e inicia o ColTex.',
      'Abra http://<servidor>:3690 e crie a conta de administrador.',
    ],
    recommended: 'Recomendado: 2 núcleos de CPU e 4 GB de memória ou mais.',
  },
  docs: {
    title: 'Documentação',
    onThisPage: 'Nesta página',
  },
  tour: {
    chapters: ['Entrar', 'Área de trabalho', 'Escrita', 'Editor visual', 'Colaboração', 'Agente de IA', 'Revisão', 'Referências', 'Histórico', 'Configurações', 'Administração'],
    try: 'Experimentar a demonstração',
    note: 'A demonstração roda inteiramente no seu navegador.',
    position: 'Posição no tour',
  },
  why: {
    title: 'Por que o ColTex?',
    lead: 'O ColTex é uma alternativa ao Overleaf para um grupo de pesquisa, um laboratório ou só para você, rodando em um computador que você controla: um desktop no laboratório, um servidor em casa ou uma máquina na nuvem.',
    items: [
      {
        title: 'Tudo fica no seu servidor',
        text: 'Projetos, histórico, contas e compilações nunca saem dele. O TeX roda em um contêiner isolado, sem acesso à internet.',
      },
      {
        title: 'Feito para escrever em conjunto',
        text: 'Várias pessoas editam o mesmo arquivo ao mesmo tempo, com comentários, controle de alterações, chat e histórico de versões.',
      },
      {
        title: 'Um agente de IA que trabalha no seu projeto',
        text: 'Ele lê os arquivos e o log de compilação, rascunha alterações, faz uma compilação de teste e mostra um diff. Nada é gravado até você aplicar.',
      },
      {
        title: 'Um comando para instalar, nenhuma porta para abrir',
        text: 'Tailscale e Cloudflare Tunnel vêm integrados para acesso remoto.',
      },
    ],
  },
  features: {
    title: 'Recursos',
    groups: [
      {
        title: 'Escrita e compilação',
        items: [
          'Editor de código e editor visual com editor de tabelas, janela de figuras, barra de ferramentas, paleta de símbolos, estrutura do documento e trilha de navegação.',
          'Preenchimento automático de LaTeX, verificação de código, pré-visualização de equações, verificação ortográfica em muitos idiomas, contagem de palavras, busca e substituição em todo o projeto, atalhos de Vim ou Emacs.',
          'Compila com latexmk em um TeX Live completo. O motor (pdfLaTeX, XeLaTeX ou LuaLaTeX) é escolhido a partir do documento, inclusive para chinês.',
          'Pré-visualização do PDF com SyncTeX nos dois sentidos, também em uma janela separada. Os erros de compilação ficam sublinhados no código, com dicas em linguagem simples.',
          'Referências: cite a partir dos seus arquivos .bib, adicione entradas do Crossref e do arXiv ou por DOI, ou mantenha uma biblioteca do Zotero sincronizada.',
        ],
      },
      {
        title: 'Colaboração',
        items: [
          'Edição em tempo real com os cursores de todos, comentários com @menções, controle de alterações, chat do projeto e notificações.',
          'Funções por projeto: proprietário, editor, revisor (só sugestões) e leitor.',
          'Histórico de versões como no git: versões automáticas, versões salvas com uma mensagem e reversão das alterações de uma versão.',
          'Acesso via Git: clone um projeto, trabalhe nele localmente e envie de volta com push.',
        ],
      },
      {
        title: 'Agente de IA',
        items: [
          'Pergunte sobre LaTeX, seu projeto ou sua escrita, ou deixe que ele corrija os erros de compilação. Ele rascunha as alterações em uma cópia privada, faz uma compilação de teste e mostra um diff.',
          'Aplicar salva uma versão antes e recompila; se a compilação piorar, a alteração é revertida.',
          'Chaves de API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter e outros), login de assinatura (Claude, ChatGPT, GitHub Copilot e outros) ou seu próprio servidor (Ollama, vLLM, LM Studio).',
          'Skills que você escreve ou importa, permissões de Manual a Acesso total, e seu próprio agente (Claude Code, Codex, Cursor…) via MCP.',
        ],
      },
      {
        title: 'Projetos e administração',
        items: [
          'Modelos para IEEE, ACM, Springer LNCS, Elsevier, REVTeX e arXiv, e conversão de um modelo de periódico para outro.',
          'Importação e exportação de zip do Overleaf, arquivos vinculados, etiquetas, arquivo e lixeira.',
          'Sem cadastro público: as contas vêm de links de convite.',
          'Monitoramento, backups via WebDAV, armazenamento local ou compatível com S3, temas e interface em 14 idiomas.',
        ],
      },
    ],
  },
  editions: {
    title: 'Duas edições do TeX Live',
    lead: 'As duas têm todos os pacotes do TeX Live e compilam os mesmos documentos. A edição full acrescenta os manuais e os códigos-fonte, que o agente de IA também pode ler.',
    head: ['Edição', 'Download', 'Disco (todo o ColTex)', 'Espaço livre recomendado'],
    rows: [
      ['Standard (padrão)', 'cerca de 3 GB', 'cerca de 12 GB', '20 GB'],
      ['Full (--edition full)', 'cerca de 8 GB', 'cerca de 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Perguntas frequentes',
    categories: [
      {
        title: 'Geral',
        items: [
          {
            q: 'O ColTex é gratuito?',
            a: 'Sim. Ele é código aberto sob a AGPL-3.0 e roda na sua própria máquina. Os provedores de IA que você conectar cobram diretamente de você.',
          },
          {
            q: 'Qual a diferença em relação ao Overleaf?',
            a: 'Ele funciona de forma muito parecida com o Overleaf: o código ao lado do PDF, comentários, controle de alterações e histórico. Ele roda em um servidor que você controla e tem um agente de IA integrado.',
          },
          {
            q: 'Existe uma versão hospedada?',
            a: 'Não. O ColTex roda em um computador que você controla. Para conhecer antes, experimente a demonstração neste site; ela roda no seu navegador.',
          },
        ],
      },
      {
        title: 'Instalação',
        items: [
          {
            q: 'Do que eu preciso para rodá-lo?',
            a: 'Uma máquina Linux ou macOS com Docker (no Linux, o instalador pode configurá-lo) e cerca de 20 GB livres em disco. Recomendam-se 2 núcleos de CPU e 4 GB de memória ou mais.',
          },
          {
            q: 'Qual edição do TeX Live devo escolher?',
            a: 'A standard tem todos os pacotes e compila os mesmos documentos. A full acrescenta os manuais e os códigos-fonte dos pacotes, que o agente de IA também pode ler, por cerca de 11 GB a mais. Você pode trocar depois com coltex edition full.',
          },
          {
            q: 'Funciona no Windows?',
            a: 'O instalador roda no Linux e no macOS. No Windows, instale o ColTex em uma máquina ou servidor Linux e abra-o no navegador.',
          },
          {
            q: 'Posso usar meu próprio domínio com HTTPS?',
            a: 'Sim. Instale com --domain tex.example.org e o Caddy incluído obtém os certificados. Aponte o domínio para o servidor e abra as portas 80 e 443.',
          },
          {
            q: 'Como eu atualizo?',
            a: 'Execute coltex update. Ele baixa a versão mais recente; suas configurações e seus dados são mantidos.',
          },
        ],
      },
      {
        title: 'Escrita e colaboração',
        items: [
          {
            q: 'Posso trazer meus projetos do Overleaf?',
            a: 'Sim. Importe o zip de um projeto do Overleaf; o ColTex exporta zips do mesmo jeito.',
          },
          {
            q: 'Várias pessoas podem editar ao mesmo tempo?',
            a: 'Sim, com os cursores de todos, comentários, controle de alterações e chat do projeto. Cada projeto tem proprietários, editores, revisores (só sugestões) e leitores.',
          },
          {
            q: 'Como outras pessoas o acessam de fora?',
            a: 'Ative o Tailscale ou o Cloudflare Tunnel em Configurações → Rede, sem abrir portas. Um servidor com domínio próprio pode usar HTTPS com --domain.',
          },
          {
            q: 'Posso trabalhar em um projeto com Git?',
            a: 'Sim. Clone-o com um token pessoal, trabalhe nele localmente e envie de volta com push; as edições feitas no navegador nesse meio-tempo são mescladas.',
          },
          {
            q: 'Ele compila chinês, japonês e coreano?',
            a: 'Sim. O motor é escolhido a partir do documento, então documentos com ctex e xeCJK compilam com XeLaTeX sem nenhuma configuração.',
          },
        ],
      },
      {
        title: 'Agente de IA',
        items: [
          {
            q: 'O agente de IA precisa de uma assinatura?',
            a: 'Ele precisa de um modelo: uma chave de API, um login de assinatura ou seu próprio servidor compatível com OpenAI. Todo o resto funciona sem isso.',
          },
          {
            q: 'Quais modelos ele pode usar?',
            a: 'Chaves de API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter e outros), logins de assinatura (Claude, ChatGPT, GitHub Copilot e outros) ou seu próprio servidor, como Ollama, vLLM ou LM Studio. O administrador os conecta.',
          },
          {
            q: 'Meu texto vai para o provedor de IA?',
            a: 'Só o que o agente lê para um pedido seu, e só para o provedor do modelo que você escolheu. Com um modelo no seu próprio servidor, nada sai dele.',
          },
          {
            q: 'O agente de IA pode alterar meus arquivos sem perguntar?',
            a: 'Não, a menos que você permita. No Manual, as alterações dele são um rascunho que você revisa e aplica; aplicar salva uma versão antes, e uma alteração que piora a compilação é revertida.',
          },
        ],
      },
      {
        title: 'Dados e segurança',
        items: [
          {
            q: 'Onde ficam meus dados?',
            a: 'No seu servidor: o banco de dados e os arquivos dos projetos, no disco dele ou em um armazenamento compatível com S3. Projetos, histórico, contas e compilações nunca saem dele.',
          },
          {
            q: 'Posso fazer backup?',
            a: 'Sim. Configurações → Armazenamento e backups envia o banco de dados, os arquivos e o histórico para uma pasta WebDAV de forma agendada, com criptografia se você definir uma senha.',
          },
          {
            q: 'Compilar é seguro?',
            a: 'O TeX roda em um contêiner próprio, sem acesso à internet, com sistema somente leitura, sem privilégios extras e com limites de memória e de processos.',
          },
          {
            q: 'Quem pode criar uma conta?',
            a: 'Ninguém por cadastro. As contas vêm de links de convite repassados pelo administrador do sistema ou por um administrador para a própria equipe.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Hospedado no GitHub Pages',
  },
} satisfies typeof en
