import { config } from "../../config";
import styles from "./Header.module.css";
import Image from "next/image"
import ThemeToggle from "../Theme/ThemeToggle";
import Link from "next/link";
import { Home } from "../Icons/Home";

export const Header: React.VFC = () => {
  return (
    <header className={styles.header}>
      <Link href="/" title="nsym.dev">
        <Home></Home>
      </Link>
      <ThemeToggle />
    </header>
  );
};
