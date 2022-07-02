import styles from "../styles/Svg.module.css";

export const ZennSvg: React.VFC = () => {
  return (
    <span className={styles.linkIconSpan}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 24" className={styles.linkIconSVG}>
        <path fill="currentColor" d="M3.9,83.3h17c0.9,0,1.7-0.5,2.2-1.2L69.9,5.2c0.6-1-0.1-2.2-1.3-2.2H52.5c-0.8,0-1.5,0.4-1.9,1.1L3.1,81.9
          C2.8,82.5,3.2,83.3,3.9,83.3z"/>
        <path fill="currentColor" d="M62.5,82.1l22.1-35.5c0.7-1.1-0.1-2.5-1.4-2.5h-16c-0.6,0-1.2,0.3-1.5,0.8L43,81.2c-0.6,0.9,0.1,2.1,1.2,2.1
          h16.3C61.3,83.3,62.1,82.9,62.5,82.1z"/>
      </svg>
    </span>
  )
}
