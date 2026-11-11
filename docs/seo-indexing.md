# SEO técnico e publicação controlada

## Situação e segurança de indexação

O catálogo continua em preparação. Por padrão, o HTML exportado publica `robots: noindex, nofollow` via Metadata API do Next.js. Além disso, `public/_headers` mantém `X-Robots-Tag: noindex` em hosts `*.pages.dev`, inclusive URLs de preview. `robots.txt` permite rastreamento para que o crawler possa ler o noindex — `Disallow` não substitui `noindex`.

A origem canônica padrão é o endereço existente `https://ceu-de-lavanda.pages.dev`, que permanece **não indexável**. Essa origem não autoriza lançamento ou indexação.

### Lançamento futuro com domínio próprio

Após aprovar o conteúdo, o domínio final e os textos comerciais, configurar **nas GitHub Actions Variables** (repositório) para builds de publicação na `main`:

- `CATALOG_SITE_URL=https://dominio-confirmado.com.br` (sem caminho ou credenciais)
- `CATALOG_INDEXABLE=true` (aprovação explícita de lançamento)

Somente a combinação desses dois fatores e um host fora de `*.pages.dev` habilita `index,follow` no HTML. O domínio final precisa apontar para o deploy aprovado. **Nunca** aplicar essas variáveis na pipeline de prévia ou em PR. O `X-Robots-Tag` de Pages continua protegendo os aliases `*.pages.dev` mesmo em build indexável.

Após deploy, validar a resposta **real** do Cloudflare, a origem canônica e o código HTTP. Conferir Search Console depois de publicar no domínio definitivo. Não confundir aprovação de meta robots com publicação, verificação de domínio ou inclusão garantida no Google.

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

O workflow só encaminha essas variáveis para a compilação em eventos de **push na main**. Em PRs e em push para `develop`, o workflow as limpa, de modo que a prévia não se torne indexável por acidente. A mudança de variáveis deve fazer parte do checklist de publicação, não da implementação técnica.
