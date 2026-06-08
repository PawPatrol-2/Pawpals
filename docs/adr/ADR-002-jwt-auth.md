# ADR-002: JWT for autentisering

Status: Antaget
Datum: 2026-05-05

## Kontext

API:t är stateless och frontend/client behövde kunna autentisera anrop over HTTP med enkel token-hantering.

## Beslut

Vi använder Bearer JWT i Authorization-header med nuvarande expiresIn pa 7 dagar.

## Konsekvenser

- Enkel integration for klienten.
- Ingen server-side session store behovs.
- Utan refresh-token behover klienten logga in igen vid utgangen token.

## Alternativ

- Server-side sessioner (cookie + session store).
- Kortlivad access-token med separat refresh-token-flode.
