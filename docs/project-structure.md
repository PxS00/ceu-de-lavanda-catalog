# Organização do projeto

`src/app/` define as rotas, os metadados e o layout do Next.js. As páginas compõem os componentes das features.

- `src/features/home/`: seções e estilos da página inicial.
- `src/features/catalog/`: catálogo, filtros, paginação, cartões, dados e validação de produtos.
- `src/components/`: header, navegação, menu móvel, footer e animação de entrada compartilhados.
- `src/styles/`: tokens da marca, base, tipografia, ações, acessibilidade, movimento e estilos dos componentes compartilhados.

`src/app/globals.css` importa os estilos numa ordem explícita. Cada arquivo de estilo contém também suas regras responsivas. Os seletores existentes são preservados para manter o visual e a integração com os testes; não há biblioteca adicional de estilos.

Prefira arquivos coesos com aproximadamente 150 linhas ou menos. Esse tamanho é uma orientação: extraia responsabilidades identificáveis, sem fragmentar funções ou criar componentes apenas para cumprir uma contagem.

## Pastas entre colchetes

`src/app/catalogo/[categoria]/page.tsx` é uma rota dinâmica do Next.js. O nome entre colchetes vira um parâmetro, então a mesma página atende `/catalogo/perfumes/`, `/catalogo/body-splash/` e `/catalogo/perfume-capilar/`.

`generateStaticParams` declara as categorias válidas para gerar os arquivos HTML no build. `dynamicParams = false` impede categorias adicionais. A página continua compatível com a exportação estática para Cloudflare Pages.

`src/app/produtos/[slug]/page.tsx` segue o mesmo padrão, gerando uma página para cada produto confirmado. Os colchetes fazem parte da convenção de rotas e devem ser mantidos.
