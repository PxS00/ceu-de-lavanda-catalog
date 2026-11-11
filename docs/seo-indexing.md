# SEO técnico e publicação controlada

## Indexação do beta

O responsável autorizou a indexação do beta em `https://ceu-de-lavanda.pages.dev`. O workflow habilita `index,follow` para builds de produção da `main`; PRs e `develop` permanecem com `noindex`. Os aliases de preview recebem `X-Robots-Tag: noindex` também quando servem o build de produção. Categorias vazias e a página 404 continuam com `noindex`.

O robots.txt permite rastreamento e aponta para o sitemap. Após publicar, conferir os metadados e cabeçalhos reais dos hosts e verificar o sitemap no Search Console. A indexação depende dos buscadores. Um futuro domínio próprio exige atualização explícita da origem e nova validação.

## Rotas e conteúdo

- `src/features/seo/lib/metadata.ts` centraliza origem, autorização e metadados. As páginas e produtos usam apenas atributos aprovados de `products.json`.
- `src/app/robots.ts` e `src/app/sitemap.ts` geram `robots.txt` e `sitemap.xml` no export; a origem é a mesma usada para canonical.
- O sitemap contempla home, catálogo, guia olfativo, **apenas categorias com produtos cadastrados** e produtos publicados. Categorias sem produtos não são listadas no sitemap, mas suas rotas continuam acessíveis com `noindex,nofollow`, inclusive se a indexação global for liberada no futuro. Ao cadastrar o primeiro produto de uma categoria, ela passa a integrar o sitemap no próximo build.
- Open Graph/Twitter usam imagem aprovada do hero e fotografias de produto quando presentes, sem conteúdo fictício.
- JSON-LD institucional contém somente marca, URL e logo; JSON-LD `Product` usa nome, imagem, família/tipo quando confirmados e ofertas apenas com preços positivos por volume **e** disponibilidade explícita. Não inventar avaliações nem parceiros.
- Slugs são URLs públicas: mudanças precisam de revisão de links/redirecionamentos. Este PR não altera slugs.
- Links externos e previews de mídia social devem ser conferidos após a configuração do domínio final.

## Testes

`tests/e2e/seo.spec.ts` valida títulos, descriptions, canonical, Open Graph, robôs, sitemap e JSON-LD no export local. Headers do Cloudflare exigem emulador Wrangler ou teste pós-deploy, porque o servidor Python não aplica `public/_headers`. Verificar manualmente ambos os hosts após lançamento.

O 404 exportado tem título e descrição próprios, não declara canonical nem metadados sociais da home e permanece `noindex`. O Next.js também injeta uma meta `noindex` automaticamente no 404; essa meta pode coexistir com a política explícita `noindex, nofollow`. O verificador do Pages exige HTTP 404 e confere esses metadados tanto no Wrangler quanto na prévia real.

O workflow configura a origem e a indexação somente em builds de produção da `main`, incluindo execução manual; PRs e `develop` usam a política de prévia.
