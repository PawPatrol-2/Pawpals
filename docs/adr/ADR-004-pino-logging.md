# ADR-004: Pino for strukturerad loggning

Status: Antaget
Datum: 2026-06-05

## Kontext

Projektet behövde strukturerad loggning for backend, inklusive möjlighet till redaction av känslig information.

## Beslut

Vi använder pino och pino-http för request-loggning.

## Konsekvenser

- Hög prestanda och strukturerade loggar.
- Bättre mojlighet till filtrering och analys.
- Kraver tydlig policy for loggnivaer och logghantering i produktion.

## Alternativ

- Winston.
- Console-baserad loggning utan strukturerat format.
