import { useEffect } from 'react'
import type { ArtPiece, StoreConfig } from '../types'
import { buildEmailEnquiryUrl, buildInstagramEnquiryUrl } from '../utils/enquiries'
import styles from './Lightbox.module.css'

interface Props {
  piece: ArtPiece
  config: StoreConfig
  total: number
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  canvas: 'Canvas Painting',
  crochet: 'Crochet Art',
  resin: 'Resin Art',
}

export default function Lightbox({ piece, config, total, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  const instagramUrl = buildInstagramEnquiryUrl(piece, config)
  const emailUrl = buildEmailEnquiryUrl(piece, config)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.close} onClick={onClose}>✕</button>

        {/* Image */}
        <div className={styles.imageArea}>
          {piece.imageData ? (
            <img src={piece.imageData} alt={piece.title} className={styles.img} />
          ) : (
            <div className={styles.noImg}>🎨</div>
          )}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <p className={styles.catLabel}>{CATEGORY_LABELS[piece.category]}</p>
          <h2 className={styles.title}>{piece.title}</h2>
          {piece.description && <p className={styles.desc}>{piece.description}</p>}
          <div className={styles.actions}>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className={styles.primaryAction}>
              Enquire on Instagram
            </a>
            {emailUrl && (
              <a href={emailUrl} className={styles.secondaryAction}>
                Enquire by Email
              </a>
            )}
          </div>
          {!piece.available && <p className={styles.sold}>This piece has been sold</p>}
        </div>

        {/* Nav */}
        {total > 1 && (
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={onPrev}>←</button>
            <span className={styles.counter}>{index + 1} / {total}</span>
            <button className={styles.navBtn} onClick={onNext}>→</button>
          </div>
        )}
      </div>
    </div>
  )
}
