# Sekvensdiagram – Kontakta organisation efter godkänd adoption

Detta diagram visar hela flödet när en inloggad användare klickar på 
"Kontakta organisationen" i frontend. Varje steg är skyddat av säkerhetslager
som säkerställer att bara rätt användare får tillgång till kontaktuppgifterna.

## Säkerhetslager i ordning

1. **JWT-autentisering** – Vem är du? Token verifieras.
2. **Zod-validering** – Är anrops-id:t i rätt format?
3. **Ägarskaps-kontroll (OWASP)** – Är det din ansökan?
4. **Statuskontroll** – Är ansökan godkänd?
5. **Dataminimering (GDPR)** – Vi returnerar bara namn och email, inget annat.

```mermaid
sequenceDiagram
    participant C as Klient (React)
    participant API as API (Express)
    participant DB as MongoDB

    Note over C,API: Användaren klickar på "Kontakta organisationen"

    C->>API: GET /api/applications/:id/organisation-contact
    Note over API: Steg 1 – authenticate middleware<br/>Verifierar JWT-token i Authorization-headern

    alt Ogiltig eller saknad token
        API-->>C: 401 Unauthorized<br/>(Ej inloggad)
    else Giltig token – vi vet vem användaren är
        Note over API: Steg 2 – validateRequest middleware<br/>Zod kontrollerar att :id är en giltig sträng
        
        alt Ogiltigt id-format
            API-->>C: 400 Bad Request<br/>(Valideringsfel)
        else Giltigt id-format
            Note over API: Steg 3 – ägarskaps-kontroll (OWASP)<br/>Ansökan måste tillhöra inloggad användare<br/>OCH ha status Godkänd
            
            API->>DB: Application.findOne({ _id, userId, status: Godkänd })
            
            alt Ansökan ej hittad eller tillhör annan användare
                DB-->>API: null
                Note over API: Returnerar 404 istället för 403<br/>för att inte avslöja om resursen existerar (OWASP)
                API-->>C: 404 Not Found
            else Ansökan hittad och godkänd
                DB-->>API: Application med populerat animalId<br/>(inkl. organizationOwner)
                
                Note over API: Steg 4 – hämta organisationens kontaktinfo
                API->>DB: Organization.findOne({ organization: orgName })
                
                alt Organisation ej hittad i databasen
                    DB-->>API: null
                    API-->>C: 404 Not Found
                else Organisation hittad
                    DB-->>API: Organization-dokument
                    Note over API: Steg 5 – dataminimering (GDPR)<br/>Vi returnerar BARA name och email<br/>Aldrig lösenord eller andra känsliga fält
                    API-->>C: 200 OK { name, email }
                end
            end
        end
    end
```

## Varför 404 istället för 403?

Enligt OWASP ska vi returnera 404 när en användare försöker nå en resurs som 
inte är deras. Om vi returnerade 403 ("du har inte tillstånd") skulle det avslöja 
att resursen *existerar* — det är ett informationsläckage. Med 404 lär sig 
angriparen ingenting om systemet.

## Dataminimering

Enligt GDPR ska vi bara returnera den data som är absolut nödvändig. 
Därför returnerar endpointen bara `name` och `email` från organisationen — 
inte lösenord, roll eller andra fält som finns i databasen.