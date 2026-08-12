# Wolfborn — The First One (player)

Site estático de uma página para tocar o álbum e mostrar as letras. Sem build, sem dependências — é só HTML, CSS e JS puros, prontos para o GitHub Pages.

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
