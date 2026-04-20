import type { StoreConfig } from '../types'
import styles from './CustomOrder.module.css'

interface Props {
  config: StoreConfig
}

const STEPS = [
  'Share the idea, colors, references, and preferred size.',
  'We align on materials, timeline, and overall mood.',
  'The piece is handmade and progress can be shared along the way.',
  'Final delivery is arranged once everything feels right.',
]

export default function CustomOrder({ config }: Props) {
  const igUrl = config.instagramUrl || 'https://www.instagram.com/'
  const waUrl = config.whatsappNumber ? `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}` : 'https://wa.me/'

  return (
    <section className={styles.wrap}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Custom commissions</p>
        <h2 className={styles.title}>
          Made for your
          <em> space, story, and palette.</em>
        </h2>
        <p className={styles.desc}>
          If you want a one-of-one piece, the commission flow is built to feel personal and collaborative from the first message.
        </p>
      </div>

      <div className={styles.steps}>
        {STEPS.map((text, index) => (
          <div key={text} className={styles.step}>
            <span className={styles.stepNum}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.stepText}>{text}</span>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <a href={igUrl} target="_blank" rel="noreferrer" className={`${styles.btn} ${styles.btnPrimary}`}>
          Start on Instagram
        </a>
        {config.whatsappNumber && (
          <a href={waUrl} target="_blank" rel="noreferrer" className={`${styles.btn} ${styles.btnSecondary}`}>
            Continue on WhatsApp
          </a>
        )}
        {config.contactEmail && (
          <a href={`mailto:${config.contactEmail}`} className={`${styles.btn} ${styles.btnGhost}`}>
            Send an Email
          </a>
        )}
      </div>
    </section>
  )
}
