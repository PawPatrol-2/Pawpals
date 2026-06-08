# Överlämningsdokumentation - Pawpals

Status: Aktiv överlämning
Överlämningsdatum: 2026-06-05
Version: v1

## 1. Status

### Färdigt

- Frontend med grundläggande sidor för utforska, djurdetalj, ansökan, inloggning och registrering.
- Backend med routes för users, organisations, animals, applications och notifications.
- JWT-baserad autentisering och rollkontroll för admin/organisation i relevanta delar.
- Grundläggande validering med Zod.
- Bilduppladdning via Cloudinary.
- Grundläggande tester i server/tests.

### Delvis klart

- API-dokumentation finns i README men inte som full OpenAPI-spec.
- Felhantering och responser är definierade men inte helt standardiserade över alla endpoints.
- Frontendens API-anrop blandar proxy-baserade och hårdkodade localhost-URL:er.

### Ej implementerat

- Refresh-token-flöde.
- Centraliserad OpenAPI/Swagger med maskinläsbar spec.
- Full CI/CD med automatiska kvalitetskontroller.

## 2. Kända problem

- Vissa frontend-anrop är hårdkodade till http://localhost:3000 och är känsliga för miljöändringar.
- API-dokumentation på endpointnivå saknar enhetliga request/response-exempel för alla endpoints.
- Tester täcker inte hela kodbasen.

## 3. Teknisk skuld

- API-bas-URL bör centraliseras i frontend (miljövariabel/service-lager).
- Dubbla inloggningsvägar (users/organisations) kan förenklas till en tydligare auth-strategi.
- Delar av response-format och felkoder bör harmoniseras.
- Observability kan förstärkas med enhetlig loggkorrelation per request.

## 4. Roadmap (föreslagen prioritering)

1. Standardisera frontendens API-bas-URL via miljö/konfiguration.
2. Ta fram OpenAPI-spec och publicera Swagger UI.
3. Utöka testtäckning för kritiska auth- och ansökningsflöden.
4. Införska token-livscykelstrategi (refresh eller kortare access-token + tydlig reauth).
5. Definiera releaseprocess med CI-kontroller.

## 5. Tredjepartstjänster Och Åtkomst

- MongoDB Atlas
  - Syfte: primär datalagring
  - Kontoägare: PawPals
  - Åtkomst: Pawpals

- Cloudinary
  - Syfte: lagring av uppladdade bilder
  - Kontoägare: Pawpals
  - Åtkomst: Pawpals

- Deployment/hosting
  - Plattform:
  - Kontoägare:
  - Åtkomst:

## 6. Kontakt Och Ansvar

- Backend API:
- Frontend UI/UX:
- Databas/modeller:
- Drift/konfiguration:

## 7. GDPR-hänsyn

Detta projekt behandlar personuppgifter och kräver tydlig dokumentation av databehandling.

- Dataregister och behandlingsöversikt: se [GDPR.md](GDPR.md).
- Personuppgifter i scope inkluderar bland annat e-post, användarnamn, hashade lösenord,
  ansökningsuppgifter och notisdata.
- Soft delete med efterföljande hard delete efter cirka 30 dagar används för `users`,
  `organisations` och `animals` via `deletedAt` + TTL-index.
- För `applications` och `notifications` är retentionpolicy en öppen punkt som behöver beslutas.

## 8. Loggning och integritet

- Projektet använder pino/pino-http med redaction av känsliga fält.
- Authorization-header, cookies och lösenordsfält maskeras i loggning.
- Full policy och öppna punkter finns i [GDPR.md](GDPR.md).