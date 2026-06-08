# ADR-003: Zod for request-validering

Status: Antaget
Datum: 2026-06-05

## Kontext

API:t behövde en tydlig, typnära validering av inkommande requests for att minska fel och ge förutsägbara svar.

## Beslut

Vi använder Zod-scheman i kombination med validateRequest-middleware.

## Konsekvenser

- Tydligare valideringsregler och enhetlig hantering i flera endpoints.
- God samverkan med TypeScript-typer.
- Viss overhead i underhall av scheman och typer.

## Alternativ

- Joi eller Yup.
- Endast manuell validering i controllers.
