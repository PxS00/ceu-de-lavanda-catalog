# Importação do inventário de perfumes

Fonte: [planilha de produção, aba Página1](https://docs.google.com/spreadsheets/d/1CEf6ymbGtprNGLEJ-a_8Dpyu_IPNCkpjnUYfKwQttUc/edit?gid=0). Consulta em 21/10/2026.

O usuário confirmou que os nomes da planilha devem aparecer no catálogo e que os 20 perfumes existentes devem ser mantidos, mesmo quando possam existir referências olfativas relacionadas sob outro nome.

- A planilha contém 95 registros preenchidos.
- Araya Elixir, Jasmin de Soie e Alma de Seda correspondem a registros existentes. A grafia pública já aprovada de **Jasmim de Soie** e seu slug `jasmin-de-soie` foram preservados.
- Os outros 92 registros foram acrescentados, totalizando 112 perfumes no catálogo.
- Os 20 registros originais mantêm seus identificadores, URLs, fotos, notas e descritivos.

## Identificação e campos importados

Os novos IDs usam `pfm-001` a `pfm-092`, derivados de `EssenceReference` para permitir conciliação estável. Não são SKUs oficiais. Os slugs são derivados dos nomes, sem acentos, e preservados após publicação.

Os nomes mantêm a grafia e capitalização da planilha, removendo apenas espaços excedentes. Referências com nomes parecidos permanecem distintas quando têm códigos diferentes; uma futura unificação depende de confirmação. Os dois registros chamados **Scandall** são separados por gênero e usam `scandall-masculino` e `scandall-feminino`.

O campo `Genero` define o tipo exibido nos cartões e nos detalhes: `F` = feminino, `M` = masculino, `C` = compartilhável; `M/C` e `F / C` preservam as duas indicações. Não inferir família olfativa a partir do gênero.

Todos seguem a regra comercial confirmada: 50 ml por R$ 157,00, 100 ml por R$ 287,00 e disponibilidade indicada como disponível. A coluna **Ml Disponiveis** representa o inventário da planilha e não redefine os tamanhos vendidos. Quantidades, retiradas, lotes, fabricação e validade não foram importados para o catálogo.

Fotos, descrições, frases, famílias e pirâmides dos novos registros ficam pendentes quando não fornecidas. As imagens extras com nomes diferentes na pasta de origem não são associadas por semelhança ou inferência.

## Próximas conciliações

Para atualizar a lista, comparar primeiro os IDs de referência e os três registros já conciliados. Não renomear URLs, duplicar esses três produtos nem transferir fotos ou notas entre referências sem confirmação. O cadastro desta importação é uma cópia local; não existe sincronização automática com a planilha.
