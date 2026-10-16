# Identidade visual e licenciamento

Revisão em 16/10/2026. Fonte visual: manual oficial em `.local/brand/MANUAL DE MARCA/`, página 9, e SVGs originais em `.local/brand/LOGOS/SVG/`. Os materiais locais ficam fora do Git e do export; somente os SVGs utilizados são publicados.

## Paleta e semântica

| Cor oficial | Token                                                                 | Uso                                                         |
| ----------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| `#BD8C40`   | `--color-gold` → `--primary`                                          | Acentos, linhas decorativas e separador do rodapé.          |
| `#EDCC8A`   | `--color-gold-light` → `--surface-highlight`                          | Faixa institucional com texto escuro.                       |
| `#3B3836`   | `--color-ink` → `--foreground`, `--action-background`, `--focus-ring` | Texto, botões principais, contornos e rodapé.               |
| `#EAC8A9`   | `--color-warm` → `--surface-warm`                                     | Seção institucional e detalhes dos cartões.                 |
| `#FFF8EE`   | `--color-paper` → `--background`, `--action-foreground`               | Fundo principal e texto sobre fundo escuro.                 |
| `#BEAAD4`   | `--color-lavender` → `--accent`, `--selected-background`              | Símbolo oficial, seleção de filtros e detalhes dos cartões. |
| `#D9C9E8`   | `--color-lavender-light` → `--surface-accent`, `--action-hover`       | Painel do início, anúncio e estados de interação.           |

Auxiliares: `--muted: #746D76` apenas sobre papel; `--border: #E5DFE8` apenas em divisores não essenciais. Controles usam `--control-border`, de contraste mais alto. Valores de marca são declarados uma única vez em `src/app/globals.css`; componentes usam papéis semânticos.

Contrastes WCAG calculados: tinta/papel **11,03:1**, secundário/papel **4,75:1**, tinta/lavanda **5,48:1**, tinta/lavanda clara **7,46:1**, tinta/quente **7,39:1**, tinta/dourado claro **7,54:1**. Dourado principal não serve para texto pequeno: tinta/dourado é **3,87:1**. Por isso ele fica restrito a ornamentos; botões usam tinta e papel. O rodapé inverte o foco para papel. Texto comum mantém pelo menos 4,5:1; limites de controles e foco, 3:1. Os SVGs institucionais preservam suas cores mesmo quando decorativos; não comunicam status por cor.

## Tipografia e inspeção dos arquivos

| Arquivo fornecido               | Metadados reais                                                                                            | Evidência de licença                                                                                                                                                                | Decisão atual                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `ivy-presto-display.otf`        | **IvyPresto Display Bold Italic**, peso 700, versão 1.001; Jan Maack / The Ivy Foundry, copyright 2021.    | Campo de licença remete à foundry e a uma EULA Typekit. `OS/2.fsType = 4` indica permissão técnica de visualização/impressão em documentos, não autorização de auto-hospedagem web. | Não distribuir nem carregar a OTF. |
| `Classic Script MN Regular.ttf` | **Classic Script MN**, Regular, peso 400, versão 001.003; Mecanorma International 1991, GST Software 1994. | Copyright reserva os direitos e exige consentimento para reprodução; não foi fornecida licença web. `OS/2.fsType = 0` não substitui contrato de licença.                            | Não distribuir nem carregar a TTF. |

SHA-256 dos arquivos inspecionados:

```text
Ivy:     6c78f1a240ca784a47bc95a94c5e9d856902aac0561e99859631af0a15ba2dab
Classic: 129c83a8c15e017a983bfba29f5f482e8ef879255784b1d2adec6f3cd37745f8
```

Metadados foram lidos diretamente das tabelas OpenType `name` e `OS/2`, com estilo também conferido por `fc-scan`. O nome do arquivo Ivy não identifica seu peso/estilo: tratá-lo como Regular fazia todos os títulos parecerem excessivamente ornamentados.

Fontes primárias consultadas:

- [Licenciamento da Ivy Foundry](https://ivyfoundry.com/licensing/): a hospedagem própria exige licença web; a foundry fornece WOFF/WOFF2 e proíbe converter arquivos desktop para web. Uma assinatura Adobe não concede por si só o direito de copiar e hospedar os arquivos.
- [Classic Script MN — Adobe Fonts](https://fonts.adobe.com/fonts/classic-script-mn): oferece publicação pelo serviço Adobe e encaminha à Mecanorma para licenciamento adicional de hospedagem própria. Essa página não comprova uma licença para a TTF local.
- [Licenciamento Adobe Fonts](https://helpx.adobe.com/fonts/web/font-licensing/font-licensing.html): termos do serviço devem ser distinguidos da licença dos arquivos locais.

Nenhuma licença de auto-hospedagem para estes arquivos foi encontrada no material fornecido. A cópia Ivy antes exposta em `public/fonts/` foi retirada. Não há carregamento remoto de fontes nem binários de fonte no export.

Para integrar as fontes oficiais: obter comprovante de licença cobrindo o domínio e a distribuição por Cloudflare Pages, além dos arquivos web autorizados. Então usar **duas chamadas `localFont` de `next/font/local` com `display: "swap"` e variáveis CSS**, declarando o peso e estilo reais. Não converter estes arquivos para WOFF2. Para títulos regulares, solicitar a variante Ivy Regular licenciada; a Bold Italic fornecida deve ficar restrita a uma frase decorativa. Classic Script fica limitada a uma assinatura curta, nunca a navegação, preços ou descrições. Não adicionar integração fictícia ou inativa enquanto a licença não estiver comprovada.

| Papel                           | Token                           | Implementação atual                                     |
| ------------------------------- | ------------------------------- | ------------------------------------------------------- |
| Título principal                | `--text-display`                | Georgia, normal, 44–72 px, entrelinha 1,1.              |
| Título de seção                 | `--text-heading`                | Georgia, normal, 32–48 px.                              |
| Nome de produto                 | `--text-product`                | Georgia, normal, 22 px; 20 px em telas pequenas.        |
| Preço ou estado de preço        | `--text-price`                  | Arial, 14 px, números tabulares; sem script.            |
| Descrição                       | `--text-body`                   | Arial, 16 px, entrelinha 1,8 nas descrições.            |
| Navegação e informação auxiliar | `--text-small`, `--text-label`  | Arial, 13/12 px, contraste AA.                          |
| Decoração                       | Tipografia de título em itálico | Somente uma frase do hero; sem fonte script substituta. |

As fontes de sistema são um fallback deliberado, não uma declaração de fidelidade tipográfica completa. A disponibilidade e as métricas variam entre plataformas.

## SVGs e composição

- Cabeçalho: `emblem.svg`, cópia exata de **Ativo 8.svg**, símbolo lavanda acompanhado do nome em texto acessível. Não há logotipo completo roxo entre os SVGs entregues; não foi inventada uma versão recolorida. Para usar o logotipo completo roxo, fornecer esse original aprovado.
- Início: `emblem-ink.svg`, cópia exata de **Ativo 6.svg**. O grafismo original substitui arcos e órbitas artificiais; fundo chapado.
- Rodapé: `wordmark-gold.svg`, cópia exata de **Ativo 4.svg**. O único gradiente restante pertence a esse próprio arquivo oficial e foi preservado.
- Cartões e favicon: símbolo lavanda original, sem filtro, transparência, recoloração ou distorção. Fotografias continuam pendentes.

Dimensões seguem o `viewBox` dos SVGs: símbolos **111,56 × 176,35**, logotipo dourado **344,49 × 145,21**. CSS define largura e `height: auto`. Hashes de integridade e contraste são cobertos por `tests/brand.test.mjs`.

Busca, filtros, ordenação, paginação, JSON e rotas de produto continuam com a mesma implementação. A limpeza remove ícones do Next/Vercel, PNG substituído, fonte com licença não comprovada, Tailwind sem utilitários em uso e o comando `next start`, incompatível com o export estático. Não foram adicionadas dependências.

## Validação e Cloudflare Pages

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Cloudflare Pages: build **`pnpm build`**, diretório de saída **`out`**, versões de Node/pnpm conforme `.tool-versions` e `package.json`. O resultado contém HTML estático por slug, assets locais, diretórios com `index.html` e `404.html`; não requer Workers, servidor Next, serviço de fontes ou adaptador. Não adicionar fallback SPA que transforme URLs inválidas em início. Atualizar o catálogo exige reconstruir e publicar o export. Esta revisão não publica nem altera configuração na Cloudflare.

Resultado da revisão: ESLint, TypeScript, oito testes e build de produção passaram. O export contém as oito páginas de produto e nenhum binário de fonte. Conferência no Chromium em 320, 390, 768, 1024 e 1440 px sem transbordamento horizontal no início, catálogo e detalhes. Busca sem acentos, inicial, ordenação, limpeza do estado vazio, navegação de produto e movimento reduzido foram exercitados. Axe não identificou violações automáticas WCAG A/AA no início, catálogo e detalhe em desktop e no início a 390 px. Não houve erros JavaScript nem requisições de fontes ou serviços externos. Hospedagem na Cloudflare e leitores de tela não foram testados nesta revisão.
