# HUGO Barber Styler — site

Site estático + 1 função do Cloudflare Pages (avaliações do Google).
Barbeiro 100% a domicílio em Londres, só com hora marcada.

## Publicar (Cloudflare Pages)
1. Criar um repositório novo no GitHub só para este site e subir esta pasta.
2. Cloudflare > Workers & Pages > Create > Pages > conectar o repositório.
   Build command: (vazio) · Output directory: /
3. Em Custom domains, adicionar o domínio do Hugo.

## Ajustes rápidos (objeto `CONFIG` no <script> do index.html)
- `services[].price`: preço em libras (ex.: `price: 30`). `null` mostra "Price on request".
- `hours`: horário por dia (0 = domingo; `null` = não atende).
- `slotMinutes`: intervalo entre horários (60 já inclui o deslocamento).
- `googlePlaceId`: ID do perfil do Hugo no Google (ver abaixo).

## Confirmação por e-mail (FormSubmit)
No primeiro agendamento chega um e-mail de ativação em Bianquinihugo181@gmail.com.
O Hugo clica em "Activate" uma única vez; depois todos os pedidos chegam no e-mail.

## WhatsApp
Ao final do agendamento o cliente toca em "Send on WhatsApp" e a mensagem com todos os dados
abre pronta para +44 7380 846509.

## Avaliações do Google
1. Criar o Perfil da Empresa do Hugo no Google (business.google.com) como
   "empresa de área de atendimento" (sem endereço fixo, área: Londres) e verificar.
2. Pegar o Place ID em https://developers.google.com/maps/documentation/places/web-service/place-id
   e colocar em `CONFIG.googlePlaceId` (ativa os botões "Leave a Google review" e "See all reviews").
3. Para mostrar as avaliações no site: no Google Cloud, ativar "Places API (New)", criar uma API key
   e, no Cloudflare Pages > Settings > Environment variables, criar:
   - GOOGLE_PLACES_KEY = a chave
   - GOOGLE_PLACE_ID   = o Place ID
   A função `functions/api/reviews.js` busca as avaliações (o Google entrega até 5) e guarda em cache por 6 h.
   Enquanto não houver avaliações, o site mostra o convite para avaliar.
