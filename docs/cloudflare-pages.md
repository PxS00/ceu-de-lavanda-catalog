# Hospedagem de teste no Cloudflare Pages

## Configuração

O projeto gera HTML estático com Next.js; não precisa de Workers, Functions, adaptador ou servidor Next.js em produção.

| Opção | Valor |
| --- | --- |
| Node.js | `24.21.0`, definido em `.node-version` e `.tool-versions` |
| Gerenciador | `pnpm@12.14.0`, definido em `package.json` |
| Instalação local/CI | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` |
| Saída publicada | `out/` |
| Preset no painel, se utilizado | Next.js (Static HTML Export) |
| Variáveis do build no Pages | `NODE_VERSION=24.21.0`, `PNPM_VERSION=12.14.0` |

`next.config.ts` mantém `output: "export"`, `trailingSlash: true` e `images.unoptimized: true`. Categorias e produtos são enumerados por `generateStaticParams`, com `dynamicParams = false`. Imagens e fontes são locais. As políticas de segurança de instalação continuam em `pnpm-workspace.yaml`.

O build inclui `/index.html`, `/catalogo/index.html`, três diretórios de categorias, uma página por produto confirmado e `/404.html`. O Pages usa esse último arquivo para endereços inexistentes; não configure redirecionamento `/* /index.html 200`, que esconderia os erros 404.

## Verificações locais

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

A suíte Playwright usa um servidor de arquivos do export, com desktop, tablet e celular. A instalação local do Chromium e suas bibliotecas de sistema são descritas em [visual-testing.md](visual-testing.md).

Para conferir também o comportamento de arquivos estáticos, cabeçalhos e 404 do Pages, use Wrangler temporário, sem adicioná-lo às dependências do aplicativo:

```sh
WRANGLER_SEND_METRICS=false pnpm dlx wrangler@4.151.1 pages dev out --port 4180 --compatibility-date 2026-10-17
```

O emulador local não exige autenticação. O verificador abaixo visita todas as páginas, atualiza cada uma em desktop/celular e confere imagens, fontes, erros de rede, overflow, metadados, 404 da marca e cabeçalhos. Capturas e relatório ficam em `artifacts/visual-review/pages-hosting/` (ignorados pelo Git).

```sh
node --experimental-strip-types scripts/check-pages.mjs http://127.0.0.1:4180
```

## Conta e projeto de teste

A publicação é por Direct Upload, sem push, integração Git, DNS ou domínio personalizado. Use um projeto novo dedicado a teste. Um projeto Direct Upload não pode ser convertido depois para integração Git; uma futura produção pode ter seu próprio projeto.

Autentique pelo login do Wrangler ou disponibilize `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` no ambiente. O token precisa de permissão de edição de Cloudflare Pages na conta de destino. Não coloque tokens em arquivos versionados ou comandos com valores literais.

```sh
pnpm dlx wrangler@4.151.1 login
pnpm dlx wrangler@4.151.1 whoami
pnpm dlx wrangler@4.151.1 pages project list
```

Em ambiente remoto, use `pnpm dlx wrangler@4.151.1 login --device --scopes account:read user:read pages:write`: a autorização ocorre no navegador com um código temporário, sem encaminhar a porta 8976. Se o fluxo não estiver disponível, configure `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` pelo mecanismo de segredos do ambiente de execução e reabra a sessão para que os processos herdem as variáveis. Não compartilhe esses valores pelo chat.

Confira a conta e a lista antes de criar o projeto. Defina `CLOUDFLARE_ACCOUNT_ID` para a conta confirmada e `PAGES_TEST_PROJECT=ceu-de-lavanda-preview`, o nome autorizado para esta primeira versão. Não selecione um projeto de produção existente.

```sh
pnpm dlx wrangler@4.151.1 pages project create "$PAGES_TEST_PROJECT" --production-branch test --force
pnpm build
pnpm dlx wrangler@4.151.1 pages deploy out --project-name "$PAGES_TEST_PROJECT" --branch test
```

`test` é a branch principal apenas do projeto isolado de teste; isso permite uma primeira versão no endereço estável atribuído pelo Pages. O nome e o endereço devem ser copiados da resposta real da Cloudflare, não presumidos. Para prévias adicionais no mesmo projeto, publique com `--branch preview`.

No Wrangler `4.151.1`, `--force` na criação mantém o projeto no Cloudflare Pages clássico: desativa a tentativa de delegar automaticamente projetos novos para Workers. Depois de criado, o projeto é reconhecido como Pages e os uploads não precisam desse sinalizador. Esse comportamento foi conferido no CLI. Confira sempre o destino antes de criar/publicar.

O upload não executa o build. Sempre publique o `out/` recém-gerado e verificado. Não há nome de projeto ou conta fixado no código, para evitar publicar em um destino ainda não confirmado.

## Indexação e endereço do site

`public/_headers` aplica `X-Robots-Tag: noindex, nofollow, noarchive` aos hosts `<projeto>.pages.dev` e `<versão>.<projeto>.pages.dev`, incluindo aliases de branch. A regra não atinge um futuro domínio próprio.

`robots.txt` permite o rastreamento para que os robôs consigam ler o cabeçalho de não indexação. Isso não é controle de acesso: a prévia será pública para quem tiver o endereço.

Não há URLs canônicas, `metadataBase` ou sitemap configurados atualmente; os metadados não usam localhost. Não invente um domínio de produção. Quando ele for confirmado, configure canônicas e sitemap para esse endereço e verifique a indexação no host final. Mantenha a proteção dos hosts de teste.

## Validar a versão publicada

Copie a URL real retornada pelo deploy e confira no navegador e por HTTP:

```sh
node --experimental-strip-types scripts/check-pages.mjs "$PAGES_TEST_URL"
```

- Home, `/catalogo/`, as três categorias e os oito produtos atuais, com acesso direto e recarregamento.
- Logo, SVGs, fontes WOFF2, CSS e JavaScript sem erros de rede.
- Busca com acentos, categorias, iniciais, ordenação, reset e navegação pelo teclado/toque.
- Layout de desktop e celular e preferência por redução de movimento.
- Endereço inexistente com status HTTP 404 e conteúdo da página de erro da marca.
- Cabeçalho `X-Robots-Tag` nas páginas do host público de teste.

## Atualizar e reverter

Para atualizar, valide as alterações, gere novamente com `pnpm build` e repita `pages deploy out` com a mesma conta, projeto e branch de teste. Guarde o ID e a URL imutável retornados em cada implantação para conferência.

Para reverter o endereço estável desse projeto, use **Workers & Pages → projeto de teste → Deployments**, selecione uma implantação anterior bem-sucedida da branch `test` e escolha **Rollback**. Não opere sobre o projeto de produção. A primeira implantação ainda não possui uma versão anterior para rollback.

Prévias de branches não oferecem o mesmo rollback de produção: para atualizá-las, gere o código da versão desejada em um checkout separado e publique novamente com a mesma branch. Isso evita descartar alterações locais.

## Primeira versão publicada e verificada

- Data: 17/10/2026.
- Projeto isolado: `ceu-de-lavanda-preview`, criado após confirmar que não existia na única conta disponível.
- Endereço estável: <https://ceu-de-lavanda-preview.pages.dev/>.
- Implantação imutável: <https://a1e1b873.ceu-de-lavanda-preview.pages.dev/>.
- ID: `a1e1b873-8a2f-421d-9fec-a1a243820bc4`.
- Código publicado: commit `7d3a0a1`; branch de implantação: `test`.
- Build local: Node `24.21.0`, pnpm `12.14.0`, `pnpm build`, saída `out/`; 100 arquivos enviados.
- Lint, TypeScript, unitários e 33 testes Playwright passaram antes da publicação.
- No endereço público, o verificador confirmou 13 rotas, acesso direto e recarregamento em desktop/celular, arquivos, busca, iniciais, ordenação, reset, navegação por categoria, ausência de overflow e 404 da marca.
- `robots.txt` e os endereços inexistentes na raiz, em categorias e em produtos foram conferidos por HTTP no contexto do navegador; o cabeçalho `noindex` está presente.
- Entrada dos cartões, movimento da seta com foco pelo teclado, redução de movimento e navegação por um único toque também passaram no endereço público.

O relatório público e as capturas estão em `artifacts/visual-review/pages-hosting/`, fora do versionamento. Clientes Python `urllib` com seu agente padrão receberam 403/1010 da proteção da Cloudflare; a validação passou no Chromium e no contexto HTTP do navegador, sem mudar configurações de segurança.

Não houve alteração de DNS, domínio, plano pago, integração Git, push ou merge. Esta é a primeira implantação do projeto; ainda não há versão anterior para rollback.

## Referências

- [Next.js estático no Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Versões do ambiente de build](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Cabeçalhos e proteção de pages.dev](https://developers.cloudflare.com/pages/configuration/headers/)
- [Páginas estáticas e 404](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Rollback](https://developers.cloudflare.com/pages/configuration/rollbacks/)
