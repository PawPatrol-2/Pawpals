import styles from "./PrivacyPage.module.css";

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Integritet och dataskydd</p>
        <h1 className={styles.title}>Så hanterar PawPals dina uppgifter</h1>
        <p className={styles.intro}>
          PawPals behandlar personuppgifter för att skapa konton, hantera
          adoptionsansökningar, visa relevanta djur och skicka statusnotiser.
          Vi begränsar åtkomsten och sparar inte uppgifter längre än de behövs.
        </p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>Vilka uppgifter sparas?</h2>
            <ul>
              <li>Namn, e-postadress, lösenordshash och kontotyp.</li>
              <li>Profilpreferenser som användaren själv väljer att spara.</li>
              <li>
                Uppgifter i en adoptionsansökan, till exempel boendesituation,
                motivation och eventuell allergiinformation.
              </li>
              <li>Statusnotiser kopplade till en ansökan.</li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>Varför behandlas uppgifterna?</h2>
            <p>
              Uppgifterna används för inloggning, matchning av djur, hantering
              av adoptionsansökningar och kommunikation mellan adoptör och
              ansvarig organisation.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Vem kan se uppgifterna?</h2>
            <p>
              Användaren kan se sina egna uppgifter och ansökningar. En
              organisation får endast se ansökningar som gäller organisationens
              egna djur. Administratörer har begränsad åtkomst för
              kontohantering.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Hur länge sparas uppgifterna?</h2>
            <p>
              Aktiva ansökningar sparas medan de behövs för handläggningen.
              Tolv månader efter att en ansökan godkänts eller nekats
              anonymiseras person- och hushållsuppgifterna automatiskt.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Hur skyddas uppgifterna?</h2>
            <p>
              Lösenord lagras som säkra hashvärden. Motivation och
              allergiinformation krypteras i databasen. Privata API-anrop kräver
              en giltig inloggningstoken.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Radera konto</h2>
            <p>
              En inloggad adoptör kan välja <strong>Radera mitt konto</strong>{" "}
              i profilmenyn. Kontot tas bort och tidigare ansökningar
              anonymiseras så att de inte längre kan kopplas till personen.
            </p>
          </section>

          <section className={`${styles.card} ${styles.wide}`}>
            <h2>Frågor om dina personuppgifter</h2>
            <p>
              PawPals är ett utbildningsprojekt. Vid frågor om lagring,
              rättelse eller radering av uppgifter kan du kontakta
              projektgruppen via{" "}
              <a
                href="https://github.com/PawPatrol-2/Pawpals"
                target="_blank"
                rel="noreferrer"
              >
                projektets GitHub-sida
              </a>
              .
            </p>
          </section>
        </div>

        <p className={styles.updated}>Senast uppdaterad: 8 juni 2026</p>
      </div>
    </main>
  );
}
