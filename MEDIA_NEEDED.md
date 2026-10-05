# Mídias necessárias para publicação

O pedido posterior do cliente autorizou a geração de imagens. O site agora usa oito cenas ilustrativas criadas com o gerador integrado `image_gen`, sinalizadas como AI. Nenhuma foto foi retirada de redes sociais ou de outra pista. Essas cenas não documentam o parque, a frota, a equipe ou eventos reais.

As versões WebP estão em `public/media/*-ai.webp` (1536 × 1024); os oito originais PNG estão em `output/imagegen/`. Os prompts integrais, proveniência e mapeamento de arquivos estão em `content/image-generation.json`. O hero também tem versão JPEG para o renderizador de Open Graph. `node scripts/prepare-media.mjs` recria as versões comprimidas a partir dos originais locais.

As imagens abaixo continuam desejáveis para substituir as ilustrações por registros autênticos:

- TODO_CLIENTE: 8–12 fotos de ação em alta resolução (idealmente 2400 px no lado maior), incluindo motocross, fettucciato enduro e minicross.
- TODO_CLIENTE: 2–3 vídeos curtos (5–10 s), horizontais e verticais. MP4 H.264 ou WebM, sem áudio necessário, hero com menos de 4 MB e poster JPG/WebP.
- TODO_CLIENTE: foto da área de aluguel e das motos disponíveis.
- TODO_CLIENTE: foto do time / ASD Massafra MX.
- TODO_CLIENTE: logo oficial SVG ou PNG transparente. O monograma tipográfico MX e favicon atuais são provisórios, não o logo oficial.
- TODO_CLIENTE: screenshots dos três pins em `/references/`, caso queira refinar a direção visual.
- TODO_CLIENTE: confirmar autoria, autorização de uso e permissões dos pilotos identificáveis, inclusive responsáveis por menores no minicross, antes de publicar.

Coloque os arquivos em `public/media/` e atualize `hero`, `trackMedia`, `rentalMedia`, `teamMedia`, `bookingMedia`, `raceMedia`, `footerMedia` e `gallery` em `content/site.ts`. Use nomes descritivos sem espaços. Cada mídia precisa de `alt.it` e `alt.en`; `caption` define a legenda curta e `position` ajusta o ponto focal. Ao usar foto real, remova `generated: true`. Ajuste o aviso global somente quando todas as imagens geradas tiverem sido substituídas. A galeria já tem lightbox e scroll horizontal ativos.

```ts
{ src: '/media/nome-confirmado.webp', type: 'image', alt: { it: 'Descrizione della foto reale', en: 'Description of the actual photo' } }
```

Vídeos usam `type: 'video'`, `src` e `poster`. A reprodução silenciosa em loop ocorre apenas na viewport e respeita movimento reduzido e a pausa global. Controles ficam disponíveis fora das miniaturas da galeria. Para destacar um vídeo no hero, forneça um poster de alto contraste e confirme o enquadramento mobile.
