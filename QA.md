# Verificação de entrega

Verificação local em 05/10/2026, Chrome, build de produção. Nenhum deploy público e nenhuma mensagem real de reserva foram enviados.

- `npm run lint`: aprovado.
- `npm run typecheck`: aprovado; TypeScript também validado pelo build.
- `npm run build`: aprovado, sem avisos na versão final.
- `npm run test:e2e`: 10 testes aprovados, viewports 360, 768, 1280 e 1920 px. Inclui carregamento das imagens geradas, ausência de placeholders e navegação/fechamento/retorno de foco da lightbox.
- Axe WCAG 2/2.1 A e AA: nenhuma violação detectada nas quatro larguras testadas.
- Testados: idioma e cookie, preservação de seção, formulário e mensagem WhatsApp interceptada, data inválida, menu/Escape/retorno de foco, mapa sob demanda, quatro rotas legais, conteúdo sem JS, SEO resources, pausa e movimento reduzido.
- Inspeção visual dos screenshots nas quatro larguras. Nenhuma rolagem horizontal do documento.
- WhatsApp de teste foi interceptado antes de acessar o serviço; a confirmação real de uma reserva continua sendo feita pelo time.

## Lighthouse mobile

Build local com `NEXT_PUBLIC_SITE_URL=http://localhost:3000` apenas para testar indexabilidade. Sem a variável, a configuração padrão de preview volta a `noindex` no próximo build.

| Métrica              | Medido |        Meta |
| -------------------- | -----: | ----------: |
| Performance          |     95 |         ≥85 |
| Accessibility        |    100 |         ≥95 |
| Best Practices       |    100 |         ≥95 |
| SEO                  |    100 |         ≥95 |
| LCP, mobile simulado |  2,9 s |      <2,5 s |
| CLS                  |      0 |        <0,1 |
| Total Blocking Time  |   0 ms | informativo |

Medição atualizada com as oito imagens AI aplicadas. O LCP ficou 0,4 s acima da meta; as quatro metas de categoria foram atingidas. Revalidar no domínio/CDN final e ao trocar as mídias. Os arquivos WebP somam aproximadamente 2,2 MB, com carregamento responsivo e lazy loading fora do hero; os originais PNG não são servidos ao visitante.

Relatórios atualizados: `reports/lighthouse-images.report.html` e `.json`. Screenshots: `reports/with-images-desktop.png`, `reports/with-images-mobile.png`, `reports/it-360.png`, `it-768.png`, `it-1280.png` e `it-1920.png`. Os relatórios `lighthouse-final` documentam a versão anterior sem fotografias (arquivos locais ignorados pelo Git).

## Dependências e limites

`npm audit --omit=dev`: zero vulnerabilidades. O audit completo identificou cinco alertas derivados de `braces`, dependência transitiva do ESLint/Next. A correção automática sugeria downgrade incompatível do ESLint config para Next 14; não foi aplicada. Os alertas são de tooling de desenvolvimento, não das dependências de produção.

A galeria está ativa com seis imagens ilustrativas; hero, três modalidades, aluguel, reserva, largada, comunidade, rodapé e Open Graph usam as oito imagens geradas. Todas as áreas de imagem receberam mídia. O mapa real permanece sob demanda e não foi substituído por uma imagem fictícia de localização. Pin de calendário e vídeos continuam dependentes de dados e arquivos do cliente. Logo e favicon são provisórios; as políticas são rascunhos. Veja `README.md`, `MEDIA_NEEDED.md` e os prompts integrais em `content/image-generation.json`.
