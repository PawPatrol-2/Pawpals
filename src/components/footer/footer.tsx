import styles from '../footer/footer.module.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
          <Link to="/utforska">Alla djur</Link>
          <Link to="/organisationer">Organisationer</Link>
          <Link to="/mina-ansokningar">Mina ansökningar</Link>
        </div>

        <div className={styles.col}>
          <h4>Om oss</h4>
          <a href="#">Om PawPals</a>
          <a href="#">Kontakta oss</a>
          <Link to="/gdpr">GDPR</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 PawPals. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
}
