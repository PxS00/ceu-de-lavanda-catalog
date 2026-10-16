# Céu de Lavanda · Catálogo MVP

Catálogo em português com oito nomes confirmados, início, busca, filtros por inicial, ordenação, paginação e páginas de detalhes. Dados ausentes têm estados explícitos; não há compra ou estoque presumido.

## Executar

Usar as versões de Node e pnpm registradas em `.tool-versions` e `package.json`.

```sh
pnpm install
pnpm dev
```

## Verificar e gerar

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

O export estático fica em `out/`, pronto para hospedagem estática com suporte a `404.html`. Para conferir localmente: `python3 -m http.server 3000 --directory out`. Novos produtos exigem novo build. Não usar `next start` com `output: "export"`.

O [contrato de dados e processo de importação](docs/catalog-data.md) descreve campos, validação, imagens aprovadas e publicação do inventário futuro.

O [design system e licenciamento](docs/brand-design-system.md) registra a paleta oficial, contraste, SVGs e as fontes oficiais que aguardam licença e as alternativas OFL integradas com `next/font/local`.

Para Cloudflare Pages: comando de build `pnpm build`, saída `out`, versões de Node e pnpm conforme `.tool-versions` e `package.json`. Sem adaptador, Workers ou fallback SPA. Novos dados exigem novo build. Não há deploy automático configurado neste repositório.
