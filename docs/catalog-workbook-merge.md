# Cadastro comercial de novembro de 2026

Fonte: [planilha comercial](https://docs.google.com/spreadsheets/d/1uAuPhWooKYGINIiYCKTqSCwwwVHRWZGn/edit), arquivo XLSX, aba `Catálogo Céu de Lavanda`, linhas 2–47. Importação estática; alterações na origem exigem nova conciliação e build.

46 registros: os 20 existentes foram mesclados pelo nome comercial normalizado, preservando IDs, URLs, ordem e fotos; 26 novos foram acrescentados. Acquare corresponde a Acquaré. Nenhum dos 20 antigos ficou sem correspondência. Todas as dez colunas estão preenchidas nos 46 registros.

| Coluna | Destino |
| --- | --- |
| Nº | `sourceRecord.number`, ordem da origem, sem substituir o ID estável |
| Gênero | `gender`, com o valor original em `sourceRecord.gender` |
| Nome Comercial do Perfume | `name`, original em `sourceRecord.name` |
| Volumetria / Tipo | `volumeOptions` e `productType`, original em `sourceRecord.volumeType` |
| Frase Comercial / Slogan | `tagline`, sem as aspas externas |
| Conceito Comercial | `description` |
| Notas de Saída | `notePyramid.top` |
| Notas de Corpo | `notePyramid.heart` |
| Notas de Fundo | `notePyramid.base` |
| Perfil, Estilo e Uso | `family`, `style`, `suggestedUse` quando presente; original em `sourceRecord.profile` |

Notas também compõem `notes`. Gênero, estilo e sugestão de uso aparecem no detalhe; família, conceito, slogan, volumes e pirâmide usam os componentes existentes. Nº serve para rastreabilidade, sem exposição no produto.

## Divergências e pendências

- Illusion e Imperator: gênero F na origem, mas tipo explicitamente compartilhável. Mantida a classificação compartilhável já confirmada pelo responsável; o valor F original permanece registrado para revisão.
- Nenhum perfume antigo ausente; nenhuma coluna vazia nos registros da origem. Sugestão de uso só é exibida quando explicitamente incluída no perfil.
- 20 fotos existentes preservadas e 24 novas fotos WebP vinculadas em 5 de novembro de 2026. O catálogo tem 44 fotos; Eclat de Frisson e Lunévoque Noir ainda usam o placeholder. As conversões foram salvas também na pasta de origem, preservando os PNGs. Os outros arquivos sem correspondência com o catálogo não foram associados por semelhança.
- Preços e disponibilidade seguem a regra previamente confirmada para todos os perfumes: 50 ml por R$ 157,00, 100 ml por R$ 287,00, disponíveis. Esses campos não constam na planilha.
- Nomes de exibição novos usam capitalização legível; nomes comerciais originais ficam registrados para conferência. Não foram conciliadas fragrâncias por semelhança de notas.
