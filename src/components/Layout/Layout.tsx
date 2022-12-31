import styles from "./Layout.module.css";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { AppContainer } from "../AppContainer/AppContainer";
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import Link from "next/link";

const iconStyle: React.CSSProperties = {
  color: '#ffffff',
  width: '60px',
  height: '40px',
};

const Layout: React.FC = props => {
  return (
    <div className={styles.root}>
    <Link href="/">
      <a title="nsym.dev" className={styles.headerLogo}>
        <HomeRoundedIcon style={iconStyle} />
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
