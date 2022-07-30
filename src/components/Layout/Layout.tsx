import styles from "./Layout.module.css";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { AppContainer } from "../AppContainer/AppContainer";

const Layout: React.FC = props => {
  return (
    <div className={styles.root}>
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
