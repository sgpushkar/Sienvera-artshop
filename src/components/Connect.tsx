import type { StoreConfig } from '../types'
import { getInstagramHandleLabel } from '../utils/enquiries'
import styles from './Connect.module.css'

interface Props {
  config: StoreConfig
}

export default function Connect({ config }: Props) {
  const igUrl = config.instagramUrl || 'https://www.instagram.com/'
  const waUrl = config.whatsappNumber ? `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}` : null
  const handle = getInstagramHandleLabel(config.instagramUrl)

  return (
    <section className={styles.section} id="contact">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Stay connected</span>
        <h2 className={styles.title}>Choose the channel that feels easiest.</h2>
        <p className={styles.sub}>Reach out for enquiries, custom work, or just to follow what the studio is making next.</p>
      </div>

      <div className={styles.links}>
        <a href={igUrl} target="_blank" rel="noreferrer" className={styles.link}>
          <span className={`${styles.linkIcon} ${styles.ig}`}>IG</span>
          <div className={styles.linkBody}>
            <strong>Instagram</strong>
            <span>{handle}</span>
          </div>
          <span className={styles.arrow}>{'->'}</span>
        </a>

        {waUrl && (
          <a href={waUrl} target="_blank" rel="noreferrer" className={styles.link}>
            <span className={`${styles.linkIcon} ${styles.wa}`}>WA</span>
            <div className={styles.linkBody}>
              <strong>WhatsApp</strong>
              <span>Quick conversations and updates</span>
            </div>
            <span className={styles.arrow}>{'->'}</span>
          </a>
        )}

        {config.contactEmail && (
          <a href={`mailto:${config.contactEmail}`} className={styles.link}>
            <span className={`${styles.linkIcon} ${styles.mail}`}>Mail</span>
            <div className={styles.linkBody}>
              <strong>Email</strong>
              <span>{config.contactEmail}</span>
            </div>
            <span className={styles.arrow}>{'->'}</span>
          </a>
        )}
      </div>

      <footer className={styles.footer}>Original handmade work, presented with warmth and intention.</footer>
    </section>
  )
}
