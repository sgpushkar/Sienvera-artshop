import styles from './Hero.module.css'
import logo from '../assets/sienvera-logo.svg'
import type { StoreConfig } from '../types'

interface Props {
  config: StoreConfig
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const STUDIO_NOTES = [
  'Original handmade pieces',
  'Custom commissions welcome',
  'Crafted with texture and warmth',
]

export default function Hero({ config, theme, onToggleTheme }: Props) {
  const parts = config.shopName.trim().split(/\s+/).filter(Boolean)
  const titleLead = parts.slice(0, -1).join(' ') || parts[0] || 'Art'
  const titleAccent = parts.length > 1 ? parts[parts.length - 1] : 'Studio'

  return (
    <section className={styles.hero}>
      <div className={styles.aurora} />
      <div className={styles.mesh} />

      <header className={styles.topbar}>
        <a href="#top" className={styles.brand}>
          <img src={logo} alt={`${config.shopName} logo`} className={styles.brandLogo} />
        </a>

        <nav className={styles.nav}>
          <a href="#collection" className={styles.navLink}>Collection</a>
          <a href="#custom-order" className={styles.navLink}>Custom</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
          <button type="button" className={styles.themeSwitch} onClick={onToggleTheme}>
            <span className={styles.themeDot} />
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <a href="/admin" className={styles.adminLink}>Admin</a>
        </nav>
      </header>

      <div className={styles.shell}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Handmade art collection</p>
          <h1 className={styles.title}>
            <span>{titleLead}</span>
            <em>{titleAccent}</em>
          </h1>
          <p className={styles.sub}>{config.tagline}</p>

          <div className={styles.actions}>
            <a href="#collection" className={styles.primaryAction}>View Collection</a>
            <a href="#custom-order" className={styles.secondaryAction}>Request Custom Art</a>
          </div>

          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <strong>{STUDIO_NOTES.length}</strong>
              <span>Creative lanes</span>
            </div>
            <div className={styles.miniStat}>
              <strong>Direct</strong>
              <span>Enquiry actions</span>
            </div>
            <div className={styles.miniStat}>
              <strong>Made</strong>
              <span>By hand</span>
            </div>
          </div>

          <div className={styles.noteRow}>
            {STUDIO_NOTES.map((note) => (
              <span key={note} className={styles.noteChip}>{note}</span>
            ))}
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureTop}>
            <span className={styles.featureLabel}>Studio Spotlight</span>
            <div className={styles.avatarRing}>
              <div className={styles.avatarInner}>
                <img src={logo} alt="" className={styles.avatarLogo} />
              </div>
            </div>
          </div>

          <div className={styles.previewPanel}>
            <div className={styles.previewSwatch} />
            <div className={styles.previewDetails}>
              <p className={styles.previewTitle}>Texture-led pieces</p>
              <p className={styles.previewText}>Canvas, crochet, and resin work presented in one warm digital gallery.</p>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>3</strong>
              <span>Mediums</span>
            </div>
            <div className={styles.stat}>
              <strong>1:1</strong>
              <span>Custom discussions</span>
            </div>
            <div className={styles.stat}>
              <strong>100%</strong>
              <span>Handmade process</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>Scroll to explore</span>
        <div className={styles.scrollArrow} />
      </div>
    </section>
  )
}
