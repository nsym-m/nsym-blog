import styles from "./Layout.module.css";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { AppContainer } from "../AppContainer/AppContainer";
import Link from "next/link";
import { HomeSvg } from "../Svg/HomeSvg";

const Layout: React.FC = props => {
  return (
    <div className={styles.root}>
    <Link href="/">
      <a title="nsym.dev" className={styles.headerLogo}>
        <HomeSvg></HomeSvg>
      </a>
    </Link>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.main}>
          <AppContainer>{props.children}</AppContainer>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout
