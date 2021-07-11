import styles from "./Layout.module.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AppContainer } from "./AppContainer";

const Layout: React.FC = props => {
  return (
    <div className={styles.root}>
      <Header image="header"/>
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
