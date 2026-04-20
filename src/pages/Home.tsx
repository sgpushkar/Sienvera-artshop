import { useStore } from '../hooks/useStore'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import CustomOrder from '../components/CustomOrder'
import Connect from '../components/Connect'
import styles from './Home.module.css'

interface Props {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Home({ theme, onToggleTheme }: Props) {
  const { pieces, config } = useStore()
  const available = pieces.filter(p => p.available)

  return (
    <main id="top" style={{ padding: '0 0 56px' }}>
      <Hero config={config} theme={theme} onToggleTheme={onToggleTheme} />
      <Gallery pieces={available} config={config} />
      <div id="custom-order" style={{ padding: '0 20px' }}>
        <CustomOrder config={config} />
      </div>
      <Connect config={config} />
      <div className={styles.quickDock}>
        <a href="#collection" className={`${styles.quickLink} ${styles.quickPrimary}`}>
          Browse
        </a>
        <a href="#contact" className={`${styles.quickLink} ${styles.quickSecondary}`}>
          Contact
        </a>
      </div>
    </main>
  )
}
