# GDPR-dokumentation - Pawpals

Detta dokument beskriver vilka personuppgifter som behandlas i Pawpals, var de lagras, varför de lagras, lagringstid, åtkomst och skydd.

## 1. Dataregister

### 1.1 Kontodata och autentisering

#### E-postadress (`users.email`)

- Var lagras den: MongoDB, `users.email`.
- Varför lagras den: inloggning och kontoidentifiering.
- Lagringstid: soft delete, hard delete efter cirka 30 dagar.
- Vem har åtkomst: användaren själv, backend och adminfunktioner.
- Hur skyddas den: auth-krav och TLS i transport.

#### Användarnamn (`users.username`)

- Var lagras den: MongoDB, `users.username`.
- Varför lagras den: visa och identifiera konto i appen.
- Lagringstid: soft delete, hard delete efter cirka 30 dagar.
- Vem har åtkomst: användaren själv, backend och adminfunktioner.
- Hur skyddas den: auth/rollkontroll.

#### Lösenord (hashat) (`users.password`, `organisations.password`)

- Var lagras den: MongoDB, `users.password` och `organisations.password`.
- Varför lagras den: verifiering vid inloggning.
- Lagringstid: soft delete, hard delete efter cirka 30 dagar.
- Vem har åtkomst: endast backend.
- Hur skyddas den: bcrypt-hashning och redaction i loggning.

#### Organisationsnamn (`organisations.organization`)

- Var lagras den: MongoDB, `organisations.organization`.
- Varför lagras den: identifiera organisation i flöden.
- Lagringstid: soft delete, hard delete efter cirka 30 dagar.
- Vem har åtkomst: organisationen själv, backend och admin.
- Hur skyddas den: auth/rollkontroll.

### 1.2 Ansöknings- och användningsdata

#### Preferenser (valfria) (`users.preferences.*`)

- Var lagras den: MongoDB, `users.preferences.*`.
- Varför lagras den: personalisering av sök/filter.
- Lagringstid: tills användaren ändrar preferenser eller raderar konto.
- Vem har åtkomst: användaren själv och backend.
- Hur skyddas den: auth-krav för läsning/uppdatering.

#### Ansökningsdata (`applications.*`)

- Var lagras den: MongoDB, `applications.*`.
- Varför lagras den: hantera adoptionsprocess och beslut.
- Lagringstid: 24 månader från skapad ansökan, därefter radering eller anonymisering.
- Vem har åtkomst: sökande användare, berörd organisation och backend.
- Hur skyddas den: auth-krav och rollkontroll.

#### GDPR-samtycke (`applications.gdprConsent`)

- Var lagras den: MongoDB, `applications.gdprConsent`.
- Varför lagras den: bevis på samtycke i ansökningsflöde.
- Lagringstid: sparas med ansökan.
- Vem har åtkomst: backend och berörd organisation.
- Hur skyddas den: auth-krav och begränsad exponering.

#### Notisdata (`notifications.*`)

- Var lagras den: MongoDB, `notifications.*`.
- Varför lagras den: informera om statusändringar.
- Lagringstid: 12 månader från skapad notis, därefter radering.
- Vem har åtkomst: mottagande användare och backend.
- Hur skyddas den: auth-krav och mottagarbunden filtrering.

### 1.3 Retentionpolicy

- Nuvarande policy är beslutad i dokumentation men behöver automatiseras i kod/drift.
- Tills automatisering finns sker radering/anonymisering manuellt vid planerade underhållsfönster.

### 1.4 Externa datalager

#### Uppladdade djurbilder (Cloudinary + `animals.image`)

- Var lagras den: Cloudinary, med referens i MongoDB-fältet `animals.image`.
- Varför lagras den: visa djur i appen.
- Lagringstid: tills djurpost tas bort eller uppdateras.
- Vem har åtkomst: frontend (publik URL), backend och kontoägare.
- Hur skyddas den: API-kontrollerad uppladdning och nyckelbaserad Cloudinary-åtkomst.

## 2. Dataminimering

Dataminimering tillämpas genom att endast lagra data som behövs för:

- konto och autentisering,
- adoptionsansökningar,
- notifikationer och användarupplevelse.

Reflektionsregler i projektet:

- Nya fält ska ha ett dokumenterat syfte innan de läggs till.
- Valfria fält i ansökningar/preferenser ska inte göras obligatoriska utan tydligt behov.
- Data som inte används i faktisk funktionalitet ska tas bort i nästa iteration.

## 3. Loggningspolicy (GDPR)

Nuvarande implementation använder `pino` och `pino-http` med redaction av känsliga fält.

Vi loggar:

- HTTP-metod och sökväg,
- statuskod och svarstid,
- teknisk requestinformation för felsökning.

Vi redigerar/bortfiltrerar i loggar:

- `req.headers.authorization`,
- `req.headers.cookie`,
- `req.body.password`,
- `req.body.token`,
- `password`, `passwordHash`, `*.password`, `*.passwordHash`.

Vi ska inte logga:

- lösenord i klartext,
- bearer-token i klartext,
- cookies med sessions/credentials.

## 4. Rättigheter för registrerade

Operativt behov i fortsatt utveckling:

- Utdrag: möjlighet att sammanställa vilka uppgifter som finns per användare.
- Rättelse: möjlighet att uppdatera felaktiga uppgifter.
- Radering: tydlig process för soft delete -> hard delete och relaterad data.

## 5. Öppna punkter

- Automatisera retentionpolicy för `applications` och `notifications`.
- Dokumentera process för incidenthantering och dataportabilitet.
- Fastställ ansvarig kontaktperson för dataskyddsfrågor i teamet.
