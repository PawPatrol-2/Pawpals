import styles from '../footer/footer.module.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            🐾 <span>Paw</span>Pals
          </div>
          <p className={styles.tagline}>Vi hjälper djur hitta sitt forever home.</p>
          <div className={styles.icons}>
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>

        <div className={styles.col}>
          <h4>Utforska</h4>
          <a href="/utforska">Alla djur</a>
          <a href="/organisationer">Organisationer</a>
          <a href="/mina-ansokningar">Mina ansökningar</a>
        </div>

        <div className={styles.col}>
          <h4>Om oss</h4>
          <a href="#">Om PawPals</a>
          <a href="#">Kontakta oss</a>
          <a href="#">GDPR</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 PawPals. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
}
