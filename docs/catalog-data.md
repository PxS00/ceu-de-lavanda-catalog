# Contrato de dados do catálogo

Fonte atual: `src/data/products.json`. Uma lista JSON UTF-8, com um objeto por produto. Os oito nomes são os únicos dados de produto confirmados nesta fase; a ordem no arquivo não indica destaque ou popularidade. IDs e slugs são identificadores técnicos, não SKUs oficiais.

| Campo          | Formato                            | Regra                                                                                                                                                                                |
| -------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`           | string                             | Obrigatório, único e estável; não mudar ao renomear um produto.                                                                                                                      |
| `slug`         | string                             | Obrigatório e único; letras minúsculas sem acentos, números e hífens. Define `/produtos/{slug}/`. Preservar URLs publicadas.                                                         |
| `name`         | string                             | Obrigatório, nome confirmado com acentos; não aceitar nomes vazios.                                                                                                                  |
| `description`  | string ou null                     | Descrição aprovada, exibida como texto simples.                                                                                                                                      |
| `priceCents`   | inteiro ou null                    | Preço confirmado em centavos de BRL, não negativo. `0` significa preço zero; ausente/null significa desconhecido.                                                                    |
| `notes`        | lista de strings ou null           | Somente notas olfativas confirmadas. Lista vazia significa informação pendente.                                                                                                      |
| `availability` | `available`, `unavailable` ou null | Somente status confirmado. Ausente/null não significa indisponível.                                                                                                                  |
| `photo`        | objeto ou null                     | `src`: caminho local `/products/nome.webp` (png, jpg, jpeg, webp ou avif também aceitos); `alt`: descrição acessível não vazia. Arquivo aprovado deve existir em `public/products/`. |

Campos opcionais podem ser omitidos ou usar `null`. Não preencher lacunas com inferências a partir do nome, fotografias geradas, valores estimados ou estoque fictício.

Registro mínimo válido:

```json
{ "id": "acquare", "slug": "acquare", "name": "Acquaré" }
```

## Recebimento do inventário completo

1. Converter a planilha/exportação para esta lista JSON. Conferir manualmente origem, nomes, acentos, preços e imagens; o aplicativo não consegue verificar a veracidade comercial.
2. Conciliar por `id`, preservando registros e slugs existentes. Não substituir ausências por zero ou indisponibilidade. Revisar exclusões antes de substituir o arquivo; manter o inventário anterior no Git para reversão.
3. Adicionar somente fotografias autorizadas em `public/products/` e conferir caminhos e textos alternativos. A validação de formato não verifica a existência dos arquivos.
4. Substituir `src/data/products.json` pela lista revisada. `validateProducts` em `src/lib/catalog.ts` valida o conjunto no carregamento/build e rejeita IDs/slugs duplicados, campos obrigatórios ausentes e valores comerciais inválidos.
5. Executar `pnpm lint`, `node --experimental-strip-types --test tests/catalog.test.mjs` e `pnpm build`. O teste dos oito nomes é uma proteção temporária do MVP: atualizá-lo para o inventário aprovado nessa fase, mantendo os testes de validação e filtros.
6. Revisar catálogo, paginação e detalhes no export estático antes de publicar. Reverter o JSON e reconstruir para voltar ao inventário anterior.

O build gera uma página por slug. Novos registros exigem novo build e publicação; não há banco, painel administrativo ou serviço de importação nesta fase. A busca, filtro de iniciais e ordenação são locais e mostram até 12 cartões por página, suficientes para centenas de registros. Não há filtro por família, preço ou estoque enquanto esses dados não estiverem disponíveis. O estado de filtros é local à página e reinicia ao sair dela.

## Base visual

Os SVGs oficiais utilizados foram copiados sem alterações de `.local/brand/` para `public/brand/`. As fontes fornecidas não são distribuídas enquanto não houver licença de hospedagem web comprovada; a interface usa Cormorant Garamond e Pinyon Script sob OFL, carregadas localmente, além de Arial do sistema. O [design system e a análise das licenças](brand-design-system.md) documentam as sete cores, hierarquia, contraste e origem dos assets. `ProductArt` centraliza fotografia/fallback; `Catalog` é compartilhado pelo início e `/catalogo/`. O símbolo decorativo não representa uma fotografia do produto. O aplicativo não depende de acesso ao Canva nem de fontes remotas.
