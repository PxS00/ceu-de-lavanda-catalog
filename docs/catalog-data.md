# Contrato de dados do catálogo

Fonte atual: `src/features/catalog/data/products.json`. Uma lista JSON UTF-8, com um objeto por produto. A ordem no arquivo não indica destaque ou popularidade. IDs e slugs são identificadores técnicos, não SKUs oficiais.

| Campo          | Formato                                              | Regra                                                                                                                                                                                |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`           | string                                               | Obrigatório, único e estável; não mudar ao renomear um produto.                                                                                                                      |
| `slug`         | string                                               | Obrigatório e único; letras minúsculas sem acentos, números e hífens. Define `/produtos/{slug}/`. Preservar URLs publicadas.                                                         |
| `name`         | string                                               | Obrigatório, nome confirmado com acentos; não aceitar nomes vazios.                                                                                                                  |
| `category`     | `perfumes`, `body-splash`, `perfume-capilar` ou null | Opcional; somente a categoria comercial confirmada. Ausente/null significa não classificado.                                                                                         |
| `productType`  | string ou null                                       | Tipo comercial confirmado, como “Perfume compartilhável”; não substituir a família olfativa.                                                                                        |
| `description`  | string ou null                                       | Descrição aprovada, exibida como texto simples.                                                                                                                                      |
| `family`       | string ou null                                       | Família olfativa confirmada, como Floral Frutal ou Oriental Gourmand; não é categoria comercial.                                                                                     |
| `tagline`      | string ou null                                       | Frase de apresentação aprovada.                                                                                                                                                      |
| `volumeOptions`| lista de strings ou null                             | Para todo produto da categoria `perfumes`, incluir exatamente `50 ml` e `100 ml`, nessa ordem. Esta regra vale mesmo quando um descritivo individual mencionar só um volume.         |
| `volumePrices` | lista de objetos ou null                             | Preço em centavos por volume: `{ "volume": "50 ml", "priceCents": 15700 }`. Volumes únicos, sem negativos ou frações, cobrindo todas as opções informadas.                           |
| `notePyramid`  | objeto ou null                                       | Notas confirmadas organizadas em `top` (saída), `heart` (corpo) e `base` (fundo).                                                                                                    |
| `priceCents`   | inteiro ou null                                      | Preço confirmado em centavos de BRL, não negativo. `0` significa preço zero; ausente/null significa desconhecido.                                                                    |
| `notes`        | lista de strings ou null                             | Somente notas olfativas confirmadas. Lista vazia significa informação pendente.                                                                                                      |
| `availability` | `available`, `unavailable` ou null                   | Somente status confirmado. Ausente/null não significa indisponível.                                                                                                                  |
| `photo`        | objeto ou null                                       | `src`: caminho local `/products/nome.webp` (png, jpg, jpeg, webp ou avif também aceitos); `alt`: descrição acessível não vazia. Arquivo aprovado deve existir em `public/products/`. |

Campos opcionais podem ser omitidos ou usar `null`. Não preencher lacunas com inferências a partir do nome, fotografias geradas, valores estimados ou estoque fictício.

## Volumes, preços e disponibilidade dos perfumes

Todos os perfumes têm **50 ml e 100 ml**, inclusive quando um descritivo individual mencionar somente um dos volumes. Os preços confirmados são **R$ 157,00 para 50 ml** e **R$ 287,00 para 100 ml**. Usar `volumeOptions: ["50 ml", "100 ml"]` e `volumePrices: [{ "volume": "50 ml", "priceCents": 15700 }, { "volume": "100 ml", "priceCents": 28700 }]` em cada perfume. Os cartões e os detalhes devem mostrar cada preço associado ao respectivo volume.

O usuário confirmou a disponibilidade de todos os perfumes cadastrados: `availability: "available"`. Alterações de preço ou disponibilidade exigem nova confirmação. Esta regra de volumes e preços não se estende automaticamente a Body Splash ou Perfume Capilar.

Registro mínimo válido:

```json
{ "id": "acquare", "slug": "acquare", "name": "Acquaré" }
```

## Categorias comerciais

Campo opcional `category`: `perfumes`, `body-splash`, `perfume-capilar` ou `null`. As opções e nomes públicos ficam em `categories` de `src/features/catalog/lib/catalog.ts`, compartilhados por validação, filtros, cartões e páginas. Campo omitido/null significa classificação ainda não confirmada, sem excluir o produto da coleção completa.

As três categorias foram confirmadas pelo usuário, com escopo de aproximadamente 90 Perfumes, 10 Body Splash e 1 Perfume Capilar no inventário futuro. Esses totais não são contagens de registros publicados e não são usados para gerar produtos fictícios. Os produtos já identificados como perfumes estão marcados como `perfumes`; os demais só recebem categoria quando confirmada.

Cada cartão leva a uma página filtrada estática: `/catalogo/perfumes/`, `/catalogo/body-splash/` e `/catalogo/perfume-capilar/`. As páginas são geradas mesmo enquanto vazias; mostram cadastro em preparação e um link para a coleção completa. A categoria combina com busca, inicial, ordenação e paginação. Mudar de categoria reinicia os filtros locais. A categoria selecionada é compartilhável na URL e funciona ao abrir diretamente o HTML exportado, sem depender de query string ou servidor.

Ao importar o inventário, preencher `category` somente com a classificação confirmada de cada produto e reconstruir o site. A validação rejeita categorias desconhecidas. Famílias olfativas, como floral ou amadeirado, não são categorias comerciais; futuras informações olfativas devem permanecer separadas para filtragem. Sem fotografias reais confirmadas para as categorias, os cartões usam o símbolo da marca e a indicação “Fotografia em breve”.

## Recebimento do inventário completo

1. Converter a planilha/exportação para esta lista JSON. Conferir manualmente origem, nomes, acentos, preços e imagens; o aplicativo não consegue verificar a veracidade comercial.
2. Conciliar por `id`, preservando registros e slugs existentes. Não substituir ausências por zero ou indisponibilidade. Revisar exclusões antes de substituir o arquivo; manter o inventário anterior no Git para reversão.
3. Adicionar somente fotografias autorizadas em `public/products/` e conferir caminhos e textos alternativos. A validação de formato não verifica a existência dos arquivos.
4. Substituir `src/features/catalog/data/products.json` pela lista revisada. `validateProducts` em `src/features/catalog/lib/catalog.ts` valida o conjunto no carregamento/build e rejeita IDs/slugs duplicados, campos obrigatórios ausentes e valores comerciais inválidos.
5. Executar `pnpm lint`, `node --experimental-strip-types --test tests/catalog.test.mjs` e `pnpm build`. Atualizar a lista de nomes e a contagem esperada nos testes ao cadastrar novos produtos, mantendo os testes de validação e filtros. O teste também protege a regra de volumes de perfumes.
6. Revisar catálogo, paginação e detalhes no export estático antes de publicar. Reverter o JSON e reconstruir para voltar ao inventário anterior.

O build gera uma página por slug. Novos registros exigem novo build e publicação; não há banco, painel administrativo ou serviço de importação nesta fase. A busca, filtro de iniciais e ordenação são locais e mostram até 12 cartões por página, suficientes para centenas de registros. Não há filtro por família, preço ou estoque enquanto esses dados não estiverem disponíveis. Busca, inicial, ordenação e página são estados locais e reiniciam ao sair da página; a categoria selecionada permanece identificada pela rota.

## Base visual

Os SVGs oficiais utilizados foram copiados sem alterações de `.local/brand/` para `public/brand/`. As fontes fornecidas não são distribuídas enquanto não houver licença de hospedagem web comprovada; a interface usa Cormorant Garamond e Pinyon Script sob OFL, carregadas localmente, além de Arial do sistema. O [design system e a análise das licenças](brand-design-system.md) documentam as sete cores, hierarquia, contraste e origem dos assets. `ProductArt` centraliza fotografia/fallback; `Catalog` é compartilhado pelo início e `/catalogo/`. O símbolo decorativo não representa uma fotografia do produto. O aplicativo não depende de acesso ao Canva nem de fontes remotas.

