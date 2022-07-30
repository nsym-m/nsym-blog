import React from "react";
import { AppContainer } from "../AppContainer/AppContainer";
import styles from "./Footer.module.css";
import { config } from "../../config";

const siteTitle = config.siteTitle;

export const Footer: React.VFC = () => {
  return (
    <footer className={styles.footer}>
      <AppContainer>
        <p className={styles.text}>
          &copy; 2021 - {siteTitle}
        </p>
      </AppContainer>
    </footer>
  );
};
