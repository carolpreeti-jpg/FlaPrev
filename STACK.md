- **Tailwind CSS** — utility-first CSS framework loaded via local runtime (`resource_3fa48481346f.es`) and used for all layout, color, spacing, transforms and hover utilities
- **Iconify** — web-component icon runtime (`iconify-icon_e19829e7f0e8.js`) that renders every `<iconify-icon>` element with icons from the `solar:` icon set
- **Google Fonts (Anton, Oswald, Permanent Marker)** — typography stack served from `assets/css2_adf3bf67eea9.css` plus the local `.woff2` files for headings (Anton), body (Oswald), and accent quotes (Permanent Marker)
- **Custom CSS (Persona 5 styling)** — bespoke stylesheet defining design tokens, halftone backgrounds, jagged/slanted/starburst clip-path shapes, slide-in and pulse keyframes, and webkit scrollbar theming
- **Aura Supabase token firewall** — bundled inline guard script that intercepts `localStorage`, `sessionStorage`, `document.cookie`, `fetch`, `XMLHttpRequest`, `sendBeacon` and `WebSocket` to block reads of Supabase auth tokens and sensitive Supabase API calls
- **Image fallback handler** — bundled inline script that catches `<img>` load errors and substitutes URLs from a hashed pool of Supabase-hosted assets

## Por que existem `assets/`/`nbf/` e `public/assets/`/`public/nbf-assets/`

Não é duplicação por descuido — são dois contextos diferentes que coexistem de propósito:

- `assets/` e `nbf/assets/` (raiz) são usados por HTML avulsos que **não passam pelo Vite**: `design-system.html` (guia de estilo) e `nbf/index.html` (site de referência espelhado, ignorado pelo scanner de dependências do Vite conforme `vite.config.js`). Esses arquivos são abertos/servidos direto, sem build, e referenciam os assets ao lado deles com caminho relativo.
- `public/assets/` e `public/nbf-assets/` são a cópia que o **Vite usa para montar a LP de verdade** (`index.html`), copiada verbatim para `dist/` no build.

Ao editar um asset compartilhado (ex.: `components.css`), lembre de replicar a mudança nas duas cópias se ela afetar tanto a LP quanto o guia de estilo. Apagar qualquer uma das pastas da raiz quebra os HTML avulsos que dependem dela.

No `index.html` da LP, referências a assets de `public/` devem sempre usar caminho absoluto (`/assets/...`), nunca relativo (`assets/...`) — um `<link rel="stylesheet">` com caminho relativo aponta para a cópia da raiz e faz o Vite empacotá-la com hash, quebrando referências relativas dentro do CSS (como o `background-image` do hero).
