import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <i
        className={`ms ms-watermark-mtg ${styles.watermark}`}
        aria-hidden="true"
      />
      <div className={styles.text}>
        <p className={styles.disclaimer}>
          MTG Practice es un proyecto personal sin ánimo de lucro. Contenido de
          fans no oficial permitido por la Fan Content Policy. No aprobado,
          patrocinado ni respaldado por Wizards of the Coast. Magic: The
          Gathering es marca registrada de Wizards of the Coast LLC, subsidiaria
          de Hasbro, Inc. Las tipografías Beleren y los símbolos de maná son
          propiedad de Wizards of the Coast.
        </p>
        <p className={styles.copyright}>© 2026 MTG Practice</p>
      </div>
    </footer>
  );
}
