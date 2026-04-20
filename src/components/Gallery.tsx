import { useMemo, useState } from 'react'
import type { ArtCategory, ArtPiece, StoreConfig } from '../types'
import { buildEmailEnquiryUrl, buildInstagramEnquiryUrl } from '../utils/enquiries'
import Lightbox from './Lightbox'
import styles from './Gallery.module.css'

interface Props {
  pieces: ArtPiece[]
  config: StoreConfig
}

const CATEGORIES: { key: 'all' | ArtCategory; label: string; icon: string; tone: string }[] = [
  { key: 'all', label: 'All Work', icon: '01', tone: 'Curated highlights from the studio' },
  { key: 'canvas', label: 'Canvas', icon: '02', tone: 'Painted layers and expressive strokes' },
  { key: 'crochet', label: 'Crochet', icon: '03', tone: 'Soft texture-led handmade forms' },
  { key: 'resin', label: 'Resin', icon: '04', tone: 'Glossy details with sculpted shine' },
]

const PLACEHOLDERS: Record<ArtCategory, { label: string; bg: string }> = {
  canvas: { label: 'Canvas Study', bg: 'linear-gradient(135deg,#6b4126,#bf8961,#e6c39d,#8a9a7b)' },
  crochet: { label: 'Crochet Detail', bg: 'radial-gradient(circle at top left,#f7e7d3 0,#d8b48e 34%,#8c6e55 100%)' },
  resin: { label: 'Resin Glow', bg: 'linear-gradient(135deg,#9fc3da,#ead7bc,#d5a8ba,#a5b89a)' },
}

export default function Gallery({ pieces, config }: Props) {
  const [activeCategory, setActiveCategory] = useState<'all' | ArtCategory>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  const filtered = useMemo(
    () => (activeCategory === 'all' ? pieces : pieces.filter((piece) => piece.category === activeCategory)),
    [pieces, activeCategory]
  )

  const activeMeta = CATEGORIES.find((category) => category.key === activeCategory) ?? CATEGORIES[0]

  return (
    <section className={styles.section} id="collection">
      <div className={styles.topbar}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Studio collection</span>
          <h2 className={styles.title}>A storefront shaped like a small exhibition.</h2>
          <p className={styles.intro}>
            Browse available handmade work, open each piece for detail, and send a direct enquiry when something catches your eye.
          </p>
        </div>

        <aside className={styles.feature}>
          <span className={styles.featureCode}>{activeMeta.icon}</span>
          <p className={styles.featureLabel}>{activeMeta.label}</p>
          <p className={styles.featureText}>{activeMeta.tone}</p>
        </aside>
      </div>

      <div className={styles.tabs}>
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            className={`${styles.tab} ${activeCategory === category.key ? styles.tabActive : ''}`}
            onClick={() => setActiveCategory(category.key)}
          >
            <span className={styles.tabIndex}>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>Archive</span>
          <p>No pieces here yet. Upload the first artwork from the admin panel.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((piece, idx) => {
            const placeholder = PLACEHOLDERS[piece.category]
            const emailUrl = buildEmailEnquiryUrl(piece, config)

            return (
              <article
                key={piece.id}
                className={`${styles.card} ${activeCardId === piece.id ? styles.cardInteractive : ''}`}
                style={{ animationDelay: `${idx * 90}ms` }}
                onClick={() => setLightboxIndex(idx)}
                onMouseEnter={() => setActiveCardId(piece.id)}
                onMouseLeave={(event) => {
                  setActiveCardId((current) => (current === piece.id ? null : current))
                  event.currentTarget.style.setProperty('--mx', '50%')
                  event.currentTarget.style.setProperty('--my', '50%')
                  event.currentTarget.style.setProperty('--rx', '0deg')
                  event.currentTarget.style.setProperty('--ry', '0deg')
                }}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  const x = ((event.clientX - rect.left) / rect.width) * 100
                  const y = ((event.clientY - rect.top) / rect.height) * 100
                  event.currentTarget.style.setProperty('--mx', `${x}%`)
                  event.currentTarget.style.setProperty('--my', `${y}%`)
                  event.currentTarget.style.setProperty('--rx', `${((50 - y) / 18).toFixed(2)}deg`)
                  event.currentTarget.style.setProperty('--ry', `${((x - 50) / 18).toFixed(2)}deg`)
                }}
              >
                <div className={styles.imageWrap}>
                  {piece.imageUrl ? (
                    <img src={piece.imageUrl} alt={piece.title} className={styles.image} />
                  ) : (
                    <div className={styles.placeholder} style={{ background: placeholder.bg }}>
                      <span>{placeholder.label}</span>
                    </div>
                  )}

                  <div className={styles.overlay}>
                    <span className={styles.overlayIcon}>Open</span>
                    <span className={styles.overlayText}>View artwork</span>
                  </div>

                  {!piece.available && <div className={styles.soldBadge}>Collected</div>}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metaRow}>
                    <p className={styles.cardLabel}>{piece.category}</p>
                    <p className={styles.cardIndex}>{String(idx + 1).padStart(2, '0')}</p>
                  </div>

                  <h3 className={styles.cardName}>{piece.title}</h3>

                  {piece.description && <p className={styles.cardDesc}>{piece.description}</p>}

                  <div className={styles.cardActions} onClick={(event) => event.stopPropagation()}>
                    <a
                      href={buildInstagramEnquiryUrl(piece, config)}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.enquiryBtn}
                    >
                      Ask on Instagram
                    </a>
                    {emailUrl && (
                      <a href={emailUrl} className={`${styles.enquiryBtn} ${styles.enquiryAlt}`}>
                        Ask by Email
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <Lightbox
          piece={filtered[lightboxIndex]}
          config={config}
          total={filtered.length}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((current) => (current != null ? (current - 1 + filtered.length) % filtered.length : 0))}
          onNext={() => setLightboxIndex((current) => (current != null ? (current + 1) % filtered.length : 0))}
        />
      )}
    </section>
  )
}
