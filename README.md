# Wolfborn — The First One (player)

Site estático de uma página para tocar o álbum e mostrar as letras — instalável como app no celular, com miniatura da capa quando o link é compartilhado. Sem build, sem dependências — é só HTML, CSS e JS puros, prontos para o GitHub Pages.

## Estrutura

```
wolfborn-player/
├── index.html
├── style.css
├── script.js
├── assets/
│   └── cover.png          ← a arte que você enviou
└── songs/
    ├── 1 - Born of Steel and Thunder.mp3   (você adiciona)
    ├── 1 - Born of Steel and Thunder.txt   (letra)
    ├── 2 - Escape the Shadow.mp3
    ├── 2 - Escape the Shadow.txt
    ├── 3 - Wolfborn.mp3
    ├── 3 - Wolfborn.txt
    ├── 4 - Fear the Dark.mp3
    └── 4 - Fear the Dark.txt
```

## Como adicionar as músicas

Os 4 arquivos `.txt` de letra já estão em `/songs` como placeholder — é só abrir cada um e colar a letra correspondente.

Falta você adicionar os `.mp3`. Regra única: **o nome do arquivo de áudio precisa ser idêntico ao nome do `.txt`**, só muda a extensão. Exemplo:

```
songs/3 - Wolfborn.mp3
songs/3 - Wolfborn.txt
```

Se quiser renomear faixas ou mudar a ordem, edite o array `ALBUM.tracks` no topo de `script.js` — o site é gerado a partir dessa lista, não precisa mexer no HTML.

## Testar localmente

Como o player carrega as letras via `fetch()`, abrir o `index.html` direto no navegador (com `file://`) não funciona — o navegador bloqueia essa leitura por segurança. Suba um servidor local simples na pasta do projeto:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

ou, com Node instalado:

```bash
npx serve .
```

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub e suba todo o conteúdo desta pasta (incluindo os `.mp3` depois de adicionados).
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, selecione a branch `main` e a pasta `/root`, e salve.
4. Em alguns minutos o site fica disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

Atenção: o GitHub tem um limite recomendado de 100 MB por arquivo (e o repositório fica pesado com áudio em alta qualidade). Se os `.mp3` forem grandes, vale exportá-los em torno de 192–256 kbps para manter o repositório leve.

## Personalizar

Todas as cores vêm de variáveis no topo de `style.css` (`:root`), então dá pra ajustar a identidade visual sem caçar valores espalhados pelo arquivo:

```css
--ink        /* fundo, preto quase puro */
--moon       /* dourado claro — títulos e texto principal */
--moon-dim   /* dourado apagado — texto secundário, bordas */
--ember      /* vermelho-fogo — botão de play */
--ember-bright /* laranja-fogo — destaques, faixa tocando */
--parchment  /* fundo do painel de letras */
```

## Instalar no celular (PWA)

O site agora é um app instalável (PWA). Um botão redondo aparece no canto superior direito:

- **Android / Chrome desktop**: o botão dispara o prompt nativo de instalação direto.
- **iPhone / Safari**: iOS não permite instalar via botão (limitação da Apple, não do site) — ao tocar no botão, aparece uma dica explicando o caminho manual: **Compartilhar → Adicionar à Tela de Início**.

O ícone instalado usa a arte do lobo recortada em círculo (`assets/icon-circle-*.png` e `assets/icon-maskable-*.png`). Se quiser trocar o recorte usado no ícone, o crop é feito a partir de `assets/cover.png` — me avise que eu gero de novo.

Detalhe técnico: a instalação no Android/Chrome exige um Service Worker (`sw.js`), que também guarda em cache os arquivos principais do site (HTML/CSS/JS/ícones) para abrir mais rápido depois da primeira visita. Os `.mp3` e `.txt` das músicas **não** entram nesse cache — eles sempre vêm da rede, então adicionar ou trocar faixas continua funcionando normalmente sem precisar limpar cache.

## Miniatura ao compartilhar (WhatsApp, etc.)

O `index.html` já tem as tags Open Graph configuradas para mostrar a capa como miniatura quando o link é colado no WhatsApp, Telegram, etc. Elas apontam para:

```
https://ricardobmuller.github.io/Wolfborn/
https://ricardobmuller.github.io/Wolfborn/assets/cover.png
```

Se o repositório for renomeado ou o site passar a usar outro domínio, essas duas URLs (tags `og:url` e `og:image` no `<head>` do `index.html`) precisam ser atualizadas — me avise que eu ajusto.

O WhatsApp guarda a prévia em cache por link. Se você já compartilhou esse link antes de adicionar essas tags, o WhatsApp pode continuar mostrando a versão antiga (sem imagem) para quem já tem a conversa; um link novo (ou o mesmo link em uma conversa nova) já vem com a miniatura.

