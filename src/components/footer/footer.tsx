import React from "react";
import styles from "../footer/footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <a href="#">Om oss</a>
      <a href="#">Kontakta oss</a>
      <a href="#">GDPR</a>
    </div>
  );
}
