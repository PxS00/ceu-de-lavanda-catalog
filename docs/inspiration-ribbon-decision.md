# Retirada da faixa de inspirações

Em 11/11/2026, o cliente decidiu retirar completamente a faixa de inspirações de desktop, tablet e celular por cautela jurídica. Este registro documenta uma decisão de produto; não afirma a existência ou a aplicabilidade de uma lei específica.

A home deixa de importar e renderizar `InspirationRibbon` e sua lista; o CSS da faixa deixa de integrar `globals.css`. Não há alternativa estática da faixa, inclusive sem JavaScript ou com movimento reduzido. A faixa institucional de frases da própria marca permanece.

O componente, os dados provisórios, o CSS e os arquivos visuais originais são conservados como referência inativa. A proposta de três linhas no celular foi retirada do diff final. Esses arquivos não devem ser reintegrados à página sem nova autorização do cliente e revisão adequada dos direitos e conteúdos.

Histórico: issues #9 e #24 e PRs #19 e #25. As issues da faixa são encerradas como `not planned`, preservando seus textos e comentários. A correção independente de scroll ao início dos produtos na paginação continua no PR #25, assim como as funcionalidades não relacionadas. Não foram apagados branches, commits ou registros históricos, nem realizado merge do PR.

Para consultar a implementação anterior, usar os commits originais dos PRs #19 e #25. Eventual retomada deve ocorrer por nova issue/PR, com aprovação atualizada; este registro não representa aprovação futura.
