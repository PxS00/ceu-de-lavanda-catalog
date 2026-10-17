# Organização do projeto

O projeto usa uma única arquitetura por funcionalidade (feature-first), com três áreas em `src`:

```text
src/
  app/                         # Next.js: rotas, metadados e composição
    page.tsx                   # /
    catalogo/
      page.tsx                 # /catalogo/
      [categoria]/page.tsx     # /catalogo/perfumes/, /catalogo/body-splash/…
    produtos/[slug]/page.tsx   # /produtos/acquare/…
    layout.tsx
    not-found.tsx
    globals.css               # Entrada ordenada dos estilos
    icon.svg
  features/
    home/
      components/             # Hero, faixa de frases, categorias, sobre…
      styles/
    catalog/
      components/             # Catálogo, filtros, cartões e detalhe do produto
      styles/
      data/                   # Inventário confirmado
      lib/                    # Tipos, validação, filtros e formatação
  shared/
    components/               # Header, navegação, menu, footer e Reveal
    styles/                   # Tokens, base, tipografia e estilos compartilhados
    fonts/                    # Fontes locais e configuração de next/font
```

As rotas em `app` resolvem parâmetros, geram metadados e compõem a interface das features. Conteúdo e regras de produto ficam em `features/catalog`, inclusive a apresentação do detalhe. Código usado por várias features fica em `shared`; código compartilhado não importa features.

Dentro de cada feature e de `shared`, `components` contém a interface e `styles` contém seu CSS. Não crie pastas paralelas `src/components`, `src/styles`, `src/lib` ou `src/data`. As URLs usam os nomes públicos em português; os nomes internos seguem o inglês usado no código.

`src/app/globals.css` importa os estilos numa ordem explícita. Cada arquivo de estilo contém também suas regras responsivas. Os seletores existentes são preservados para manter o visual e a integração com os testes; não há biblioteca adicional de estilos.

Prefira arquivos coesos com aproximadamente 150 linhas ou menos. Esse tamanho é uma orientação: extraia responsabilidades identificáveis, sem fragmentar funções ou criar componentes apenas para cumprir uma contagem.

## Pastas entre colchetes

`catalogo` contém o arquivo `page.tsx` da coleção completa e a pasta `[categoria]` das categorias. No explorador da IDE, a pasta pode aparecer antes do arquivo porque diretórios são listados primeiro.

`src/app/catalogo/[categoria]/page.tsx` é uma rota dinâmica do Next.js. O nome entre colchetes vira um parâmetro, então a mesma página atende `/catalogo/perfumes/`, `/catalogo/body-splash/` e `/catalogo/perfume-capilar/`. Isso evita manter três pastas com páginas iguais.

`generateStaticParams` declara as categorias válidas para gerar os arquivos HTML no build. `dynamicParams = false` impede categorias adicionais. A página continua compatível com a exportação estática para Cloudflare Pages.

`src/app/produtos/[slug]/page.tsx` segue o mesmo padrão, gerando uma página para cada produto confirmado. Os colchetes fazem parte da convenção de rotas e devem ser mantidos.
