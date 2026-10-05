# Massafra MX Park

Site bilíngue para a pista em **Ginosa (TA)**. Next.js App Router, TypeScript, Tailwind CSS v4, next-intl, GSAP + ScrollTrigger e Lenis. Menu e lightbox usam Base UI. As cortinas de idioma usam Web Animations API, sem uma segunda biblioteca de animação.

## Rodar

Node.js 20.9+ (verificado com Node 24).

```sh
npm install
npm run dev
```

Abra http://localhost:3000/it ou http://localhost:3000/en. A rota `/` considera `Accept-Language`, com fallback italiano; a escolha manual IT/EN é lembrada no cookie `NEXT_LOCALE`. A troca conserva a seção lógica por âncora. O formulário não persiste dados pessoais após recarregar a página.

## Pastas

```text
app/[locale]/        página, layout e políticas IT/EN
components/          menu, formulário, galeria, mapa e motion
content/site.ts      fatos, status, contatos, calendário e mídias
content/copy.ts      textos IT/EN
i18n/                configuração next-intl
lib/seo.ts           origem e metadados
public/media/        imagens WebP otimizadas para o site
output/imagegen/     originais PNG das oito imagens geradas
references/          screenshots de referência opcionais
tests/               testes de fluxo e responsividade
```

## Editar conteúdo

Altere os valores em `content/site.ts`; não é necessário alterar componentes. Textos editoriais ficam em `content/copy.ts`. Para atualização em produção é necessário salvar o arquivo e fazer novo deploy (a v1 não inclui CMS). Datas de corridas devem ser ISO 8601 com horário/fuso confirmados. Enquanto não houver datas, o site mostra o estado “novas datas em breve”; não cria SportsEvent fictício. Preços, frota e regras desconhecidos não são publicados como fatos.

### Marcar a pista como fechada por mau tempo

1. Abra `content/site.ts`.
2. Mude `status.open` para `false`.
3. Mude `status.message.it` para `Pista chiusa per maltempo` e `.en` para `Track closed due to bad weather`.
4. Preencha `status.note.it` e `.en` com o aviso confirmado (sem prever reabertura sem confirmação).
5. Salve e faça novo deploy. Confira os dois idiomas. O selo muda para vermelho.

Para reabrir, restaure `open: true` e os textos de abertura. O status é manual, não uma consulta meteorológica nem um feed em tempo real. Atualize junto das redes sociais.

## Mídias e identidade

Veja `MEDIA_NEEDED.md`. O site usa oito imagens ilustrativas geradas com AI por solicitação posterior do cliente: hero, motocross, enduro, minicross, aluguel, comunidade, largada e preparação. Os placeholders foram substituídos e a galeria está ativa. `next/image` entrega tamanhos responsivos em AVIF/WebP com dimensões reservadas. Os originais PNG e os prompts em `content/image-generation.json` foram preservados. Nenhuma imagem documenta o local, a frota ou os membros reais do clube; há indicação visual de AI e aviso no rodapé. O logo tipográfico e favicon continuam provisórios. Cores e curvas estão em `app/globals.css`; `site.effects.grain=false` desliga o grão.

## Reservas

CTA do hero abre WhatsApp em um toque. O formulário valida e prepara a mensagem, sem enviar nem confirmar reserva automaticamente. O fallback por e-mail usa os mesmos campos e validação. Nenhuma chave/API de e-mail é necessária. O time confirma disponibilidade e reserva no canal escolhido. Se JavaScript estiver desabilitado, os links diretos continuam disponíveis.

## Motion e acessibilidade

Reveals e contadores progressivos; marquee sensível à velocidade; parallax, cursor, botões magnéticos e galerias/calendários pinados apenas em desktop. O pin só aparece quando há itens suficientes para ultrapassar a largura visível. Mobile usa scroll nativo. Intro dura menos de 1,2 s e aparece uma vez por sessão. `prefers-reduced-motion` desliga movimento decorativo; o rodapé permite pausar animações. Conteúdo é renderizado no servidor e legível sem JavaScript. Modais têm gerenciamento de foco, Escape, nomes acessíveis e retorno ao gatilho.

## SEO, privacidade e publicação

Copie `.env.example` para `.env.local` e defina `NEXT_PUBLIC_SITE_URL` com o domínio definitivo, por exemplo o domínio real aprovado pelo cliente. **Sem essa variável, o site fica noindex e robots bloqueia indexação**, para que a prévia não seja tratada como site oficial. Canonical, hreflang, sitemap e JSON-LD são derivados dessa origem. Open Graph PNG 1200×630 é gerado em `/opengraph-image`.

As políticas são modelos IT/EN com pendências explícitas, sempre noindex até revisão. Não há analytics nem banner desnecessário. A preferência de idioma e a sessão de intro são técnicas; o Google Maps carrega somente após ação explícita. A revisão jurídica e os dados do responsável são necessários antes da publicação. Referência consultada: [Comissão Europeia, proteção de dados](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en).

Para medir SEO localmente sem publicar, use `NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build`; isso apenas habilita as diretivas de indexação no build local de teste. Sem a variável, um novo build restaura o noindex de prévia.

Deploy alvo: importe o repositório na Vercel, escolha Next.js, configure `NEXT_PUBLIC_SITE_URL`, rode `npm run build` e publique após validar as pendências. O projeto usa proxy para negociação de idioma e otimização de imagens, portanto não é um export estático pronto; um host somente estático exigiria adaptar esses recursos.

## Verificar

```sh
npm run lint
npm run typecheck
npm run format:check
npm run build
npm start
npm run test:e2e
```

Os testes usam Chrome instalado, servidor em `http://localhost:3000` e viewports 360, 768, 1280 e 1920. Não enviam pedidos reais: interceptam os links de WhatsApp. Lighthouse deve ser executado sobre build de produção; metas finais precisam ser revalidadas após entrada das mídias e domínio de produção.

## TODO_CLIENTE antes de publicar

- Confirmar status diário, mensagens de fechamento, horários e preços.
- Informar frota, cilindradas, idades, equipamentos incluídos e disponibilidade.
- Fornecer datas e dados oficiais das próximas gare.
- Entregar mídias, logo e autorizações de uso (especialmente menores).
- Confirmar razão social, P.IVA, responsável por dados, retenção, base jurídica, hosting e políticas.
- Confirmar regulamento de segurança, equipamento obrigatório e responsabilidade por menores; o site não inventa essas regras.
- Aprovar domínio, textos e localização no mapa.

Documentação técnica consultada: [next-intl routing](https://next-intl.dev/docs/routing/setup), [Next.js](https://nextjs.org/docs/app/getting-started/installation), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Base UI Dialog](https://base-ui.com/react/components/dialog).
