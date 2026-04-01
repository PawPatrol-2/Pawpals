import React from "react";
import styles from "../footer/footer.module.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.links}>
        <a href="#">Om oss</a>
        <a href="#">Kontakta oss</a>
        <a href="#">GDPR</a>
      </div>
      <div className={styles.icons}>
        <FaFacebook />
        <FaInstagram />
        <FaTwitter />
      </div>
    </div>
  );
}
