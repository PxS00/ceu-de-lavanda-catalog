# Identidade visual e licenciamento

Revisão em 16/10/2026. Fonte visual: manual oficial em `.local/brand/MANUAL DE MARCA/`, página 9, e SVGs originais em `.local/brand/LOGOS/SVG/`. Os materiais originais locais ficam fora do Git e do export. São publicados os SVGs utilizados e as alternativas tipográficas OFL, acompanhadas das licenças.

## Paleta e semântica

| Cor oficial | Token                                                                 | Uso                                                         |
| ----------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| `#BD8C40`   | `--color-gold` → `--primary`                                          | Acentos, linhas decorativas e separador do rodapé.          |
| `#EDCC8A`   | `--color-gold-light` → `--surface-highlight`                          | Bordas delicadas da faixa institucional.                    |
| `#3B3836`   | `--color-ink` → `--foreground`, `--action-background`, `--focus-ring` | Texto, botões principais, contornos e rodapé.               |
| `#EAC8A9`   | `--color-warm` → `--surface-warm`                                     | Detalhe botânico na abertura da seção institucional.        |
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

Nenhuma licença de auto-hospedagem para estes arquivos foi encontrada no material fornecido. As fontes oficiais não são publicadas, convertidas nem versionadas, conforme orientação do usuário. Apenas as alternativas OFL abaixo são distribuídas; não há carregamento remoto de fontes durante a visita.

Para integrar as fontes oficiais: obter comprovante de licença cobrindo o domínio e a distribuição por Cloudflare Pages, além dos arquivos web autorizados. Não converter os arquivos desktop. A Ivy fornecida é Bold Italic e não deve ser tratada como Regular. Classic Script MN continua sendo a referência para a tipografia decorativa, com integração pendente de licença.

### Alternativas livres e configuração central

O usuário autorizou alternativas gratuitas OFL enquanto as licenças oficiais não forem confirmadas. `src/app/typography.ts` centraliza duas chamadas de `next/font/local`, com `display: "swap"`, preloads locais e fallback com métricas ajustadas. `--font-heading` e `--font-decorative` em `globals.css` definem os papéis; a futura substituição não exige editar os componentes.

| Papel                                  | Alternativa atual               | Fonte e licença                                                                                                                     |
| -------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Títulos e nomes de produtos            | Cormorant Garamond, Regular 400 | [Google Fonts — OFL](https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/OFL.txt), copyright Cormorant Project Authors. |
| Frases decorativas e títulos de categorias | Pinyon Script, Regular 400      | [Google Fonts — OFL](https://github.com/google/fonts/blob/main/ofl/pinyonscript/OFL.txt), copyright Pinyon Project Authors.         |
| Navegação, preços e descrições         | Arial/Helvetica do sistema      | Nenhum arquivo distribuído.                                                                                                         |

Os WOFF2 Latin originais foram obtidos pela API CSS do Google Fonts, sem conversão local. Cobrem os acentos em português dos textos atuais. URLs de origem e hashes:

- Cormorant, 22.876 bytes: `https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86KnTOig.woff2`; SHA-256 `8048ac209bec741e1c29cd0cfac5aac1c0c2ba8c3ddbd4a58fa9bd92ef5c63c2`.
- Pinyon, 39.044 bytes: `https://fonts.gstatic.com/s/pinyonscript/v24/6xKpdSJbL9-e9LuoeQiDRQR8WOXaOg.woff2`; SHA-256 `3e1f69a201572cad4aabea7ccf720f093a7dbc005380b2a1b89e0b94476d3e42`.

As licenças OFL completas e avisos de copyright são versionados e publicados em `public/branding/licenses/`. Os binários ficam em `src/app/fonts/`. Essas alternativas são visualmente próximas, sem serem apresentadas como as fontes oficiais.

| Papel                           | Token                                   | Hierarquia                                                                                                   |
| ------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Título principal                | `--text-display`                        | Editorial, 44–72 px, entrelinha 1,1.                                                                         |
| Título de seção                 | `--text-heading`                        | Editorial, 32–48 px.                                                                                         |
| Nome de produto                 | `--text-product`                        | Editorial, 22 px; 20 px em telas pequenas, em grafite.                                           |
| Preço ou estado de preço        | `--text-price`                          | Corpo, 14 px, números tabulares.                                                                             |
| Descrição                       | `--text-body`                           | Corpo, 16 px, entrelinha 1,8.                                                                                |
| Navegação e informação auxiliar | `--text-small`, `--text-label`          | Corpo, 13/12 px, contraste AA.                                                                               |
| Decoração                       | `--font-decorative`, `.decorative-text` | Frases do hero, faixa e seção institucional, além do título grande das categorias em `/catalogo/`; sem simulação de itálico na Pinyon. |

## SVGs e composição

- Cabeçalho: `public/branding/ceu-de-lavanda-logo-graphite.svg`, cópia byte a byte de **Ativo 3.svg**. Link para o início, sem filtros, recoloração ou alteração do original em `.local/brand/`. `viewBox` **513,77 × 271,81**, largura 160 px em desktop e 124 px em mobile, altura automática. O desenho principal está em curvas e mantém `#3B3836`; não há strokes ou imagens externas. O slogan contém `<text>/<tspan>` referenciando **Nexa-ExtraLight/Nexa**, sem fonte embutida. Navegadores usam fallback local se Nexa não estiver disponível. Não foi reescrito nem convertido: uma versão oficial com o slogan em curvas seria necessária para garantir métricas idênticas em todos os sistemas.
- Hero: `public/branding/ceu-de-lavanda-monogram-graphite.svg`, cópia byte a byte de **Ativo 5.svg**, monograma grafite em moldura com `viewBox` **111,56 × 176,35**. A composição lavanda mantém apenas esse símbolo, sem rótulo ou legenda repetidos. O arquivo original não foi alterado.
- Rodapé: `wordmark-gold.svg`, cópia exata de **Ativo 4.svg**. O único gradiente do site pertence ao próprio arquivo oficial.
- Cartões e favicon: símbolo lavanda original de **Ativo 8.svg**, sem recoloração. Fotografias continuam pendentes.

Símbolos usam `viewBox` **111,56 × 176,35**, logotipo dourado **344,49 × 145,21**. CSS mantém altura automática; o zoom de hover é uniforme e não altera proporções nem cores. Os hashes de integridade e os pares semânticos de contraste são cobertos por `tests/brand.test.mjs`.

### Cabeçalho, ícones e movimento

`SiteHeader` é o único componente responsável pelo cabeçalho sticky, estado de rolagem, navegação ativa e menu. Depois de 20 px de rolagem, o fundo marfim fica 94% opaco, com blur e borda suave. Altura e tamanho do logo não mudam ao rolar, evitando deslocamentos. Links para âncoras respeitam o espaço do cabeçalho.

O menu móvel usa `<dialog>` com `showModal()`: foco inicial no botão de fechar, contenção nativa de foco, Escape e retorno ao acionador. Fecha também ao escolher um link, clicar fora ou voltar à largura desktop; nesse último caso o foco passa ao link ativo da navegação desktop. A rolagem do fundo fica bloqueada sem deslocar a largura da página. Sem JavaScript, os links da navegação permanecem visíveis no mobile.

Lucide React é a única dependência adicionada: ícones importados individualmente, tamanho padrão 18 px e traço 1,5. Não há carrinho, checkout, categorias presumidas ou contatos sem dados confirmados.

`Reveal`/`useReveal` usam IntersectionObserver e animação CSS de opacidade/translação, uma vez por entrada. O estado padrão do conteúdo é **visível**, inclusive sem JavaScript ou sem suporte ao observer. Cartões entram com pequenos intervalos e animam novamente quando os resultados mudam. Hover usa translação leve e zoom uniforme de 1,035. O menu usa transições CSS com comportamento discreto para o diálogo nativo; navegadores sem esse suporte o abrem/fecham imediatamente. `prefers-reduced-motion` desativa animações, transições, hover com transform e rolagem suave. Foco de teclado cancela animações de entrada no elemento focado.

Busca, filtros, ordenação, paginação, JSON e rotas estáticas mantêm a mesma lógica. Não há biblioteca de animação, carregamento de fontes por terceiros ou novos dados comerciais.

## Validação e Cloudflare Pages

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Cloudflare Pages: build **`pnpm build`**, diretório de saída **`out`**, versões de Node/pnpm conforme `.tool-versions` e `package.json`. O resultado contém HTML estático por slug, assets locais, diretórios com `index.html` e `404.html`; não requer Workers, servidor Next, serviço de fontes ou adaptador. Não adicionar fallback SPA que transforme URLs inválidas em início. Atualizar o catálogo exige reconstruir e publicar o export. Esta revisão não publica nem altera configuração na Cloudflare.

### Resultado da validação

ESLint, TypeScript, nove testes automatizados e build de produção aprovados. O export contém oito páginas de produto, `404.html`, WOFF2 alternativos e suas licenças; nenhuma OTF/TTF oficial foi incluída. No Chromium, início, catálogo e detalhes foram conferidos em 375, 768 e 1440 px, sem transbordamento horizontal. Foram exercitados busca, inicial, ordenação, limpeza, rotas, cabeçalho sticky, estados ativos, foco do menu, Escape, fechamento por botão/link/backdrop/resize e preferência de movimento reduzido. Sem JavaScript, conteúdo e navegação continuam visíveis e os links funcionam. Axe não identificou violações automáticas WCAG A/AA nas páginas e menu verificados. Não houve erro JavaScript nem requisição externa durante as visitas.

A rolagem suave tem `data-scroll-behavior="smooth"` no HTML para que Next.js 16 a desative durante a troca de página, mantendo a navegação entre páginas imediata. A navegação alternativa sem JavaScript é ativada por `noscript`, sem provocar colapso de altura durante a hidratação normal do cabeçalho.

Limites: não foi feita auditoria manual com leitores de tela nem publicação na Cloudflare. A licença das fontes oficiais continua pendente; o slogan no SVG original depende da Nexa ou de seu fallback local.

### Refinamento da homepage e faixa de frases

Foram removidos o rótulo “CÉU DE LAVANDA · CATÁLOGO”, a pequena linha dourada, a nota auxiliar do hero e as legendas repetidas no painel lavanda. O hero usa Ativo 5, com proporções originais; o cabeçalho mantém Ativo 3 em grafite.

A faixa horizontal permanece com as frases exatas “Presença nos detalhes”, “Beleza em cada descoberta” e “O seu próximo encanto”. Usa Pinyon Script sob OFL, tinta sobre marfim e bordas finas douradas. Desktop/tablet apresentam três frases em colunas alinhadas; mobile apresenta as três em sequência vertical, sem esconder frases nem usar marquee. A entrada respeita movimento reduzido e o conteúdo permanece visível sem JavaScript.

O ornamento `public/branding/lavender-ornament-gold.svg` é uma derivação decorativa dos três caminhos botânicos de **Ativo 6.svg**, com os `d` preservados, sem as duas molduras, preenchimento sólido oficial **#BD8C40** e viewport **18 28 76 138**. O recorte foi conferido no Chromium para abranger todos os caminhos. Não se apresenta como um novo logo oficial e não modifica o original em `.local/brand/`. O teste compara os caminhos com a cópia íntegra do Ativo 6.

A seção de descoberta usa três cartões comerciais: Perfumes, Body Splash e Perfume Capilar. Sem fotografia real aprovada no repositório, os cartões exibem um fallback identificado. A transição de hover é discreta e desativada para movimento reduzido. Os links levam ao catálogo filtrado por rotas estáticas; o contrato e o estado de classificação pendente são descritos em `catalog-data.md`. As dependências e configurações de segurança/build não foram alteradas.

Validação deste refinamento: ESLint, TypeScript, 12 testes e build de produção passaram. Chromium conferiu 375, 768 e 1440 px; frases e ornamentos visíveis e sem cortes, três cartões, todos os links de categoria, abertura direta das páginas filtradas e retorno à coleção completa. Busca, iniciais, ordenação, limpeza e detalhes continuaram funcionando; movimento reduzido e links de categoria sem JavaScript foram exercitados. Axe não apontou violações automáticas WCAG A/AA após estabilizar as animações de entrada. Não houve transbordamento horizontal ou erro JavaScript. A combinação de categoria com resultados preenchidos é coberta por fixtures de teste, sem alterar os produtos publicados. Continuam pendentes fotografias reais e a classificação comercial de cada nome, além da auditoria manual com leitores de tela.

### Ajuste de ornamentos e títulos de categorias

A faixa tem quatro lavandas douradas: duas entre as frases e uma em cada ponta, também preservadas no arranjo vertical mobile. O anúncio superior usa o mesmo SVG botânico como máscara CSS, com preenchimento grafite, sem ícone genérico. O estado vazio do catálogo segue esse mesmo desenho. O aviso “Uma coleção em construção. Novos detalhes serão revelados em breve.” e seu ícone foram retirados.

Os nomes individuais dos produtos usam a fonte editorial original, em grafite, nos cartões e nos detalhes. Pinyon Script com o tom auxiliar lavanda é aplicada apenas aos títulos grandes das categorias nas rotas `/catalogo/perfumes/`, `/catalogo/body-splash/` e `/catalogo/perfume-capilar/`. Os cartões de categoria na homepage e os links dos filtros permanecem com suas fontes anteriores. O token `--text-accent: #766B7D` tem contraste **4,78:1** sobre marfim. Preços e descrições continuam na fonte de corpo.

Validação do ajuste: lint, TypeScript, 12 testes e build aprovados. Chromium conferiu as quatro lavandas e os nomes em 375, 768 e 1440 px, incluindo todos os oito títulos de detalhe sem transbordamento horizontal, busca, rotas e estados vazios. Axe não apontou violações automáticas A/AA após estabilização das animações. O novo par de contraste também está coberto no teste dos tokens.
