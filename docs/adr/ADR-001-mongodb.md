# ADR-001: MongoDB som primar databas

Status: Antaget
Datum: 2026-05-01

## Kontext

Projektet behövde en databas med snabb utvecklingsstart, flexibla scheman och enkel integration i en Node.js/TypeScript-stack.

## Beslut

Vi använder MongoDB Atlas via Mongoose som primar databas.

## Konsekvenser

- Snabb iteration med dokumentmodell.
- Enkel integration med befintlig stack.
- Relationer hanteras applikationsnara och kraver disciplin i populate/datamodellering.

## Alternativ

- PostgreSQL med Prisma/ORM.
- MySQL med ORM.
