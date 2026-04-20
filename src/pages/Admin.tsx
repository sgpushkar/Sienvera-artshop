import { useState, useRef, useCallback } from 'react'
import { useStore } from '../hooks/useStore'
import type { ArtPiece, ArtCategory, StoreConfig } from '../types'
import { generateId, getConfig } from '../utils/storage'
import styles from './Admin.module.css'

type Tab = 'pieces' | 'upload' | 'settings'

const CATEGORIES: { value: ArtCategory; label: string; icon: string }[] = [
  { value: 'canvas',  label: 'Canvas Painting', icon: '🖌️' },
  { value: 'crochet', label: 'Crochet Art',      icon: '🧶' },
  { value: 'resin',   label: 'Resin Art',        icon: '💎' },
]

// ── Auth Gate ────────────────────────────────────────────
function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  const submit = () => {
    const cfg = getConfig()
    if (pw === cfg.adminPassword) { onAuth() }
    else { setErr(true); setPw('') }
  }

  return (
    <div className={styles.authWrap}>
      <div className={styles.authBox}>
        <span className={styles.authIcon}>🔐</span>
        <h1 className={styles.authTitle}>Admin Panel</h1>
        <p className={styles.authSub}>Enter your password to manage your collection.</p>
        <input
          className={`${styles.input} ${err ? styles.inputError : ''}`}
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
        />
        {err && <p className={styles.errMsg}>Wrong password — try again.</p>}
        <button className={styles.primaryBtn} onClick={submit}>Enter →</button>
        <a href="/" className={styles.backLink}>← Back to shop</a>
      </div>
    </div>
  )
}

// ── Upload Form ───────────────────────────────────────────
function UploadForm({ onSave }: { onSave: () => void }) {
  const { add } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>('')
  const [form, setForm] = useState({ title: '', description: '', category: 'canvas' as ArtCategory, available: true })
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
  }, [])

  const handleSave = () => {
    if (!form.title.trim()) return
    setSaving(true)
    const piece: ArtPiece = {
      id: generateId(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      imageData: preview,
      available: form.available,
      createdAt: Date.now(),
    }
    add(piece)
    setTimeout(() => {
      setSaving(false)
      setSuccess(true)
      setPreview('')
      setForm({ title: '', description: '', category: 'canvas', available: true })
      setTimeout(() => { setSuccess(false); onSave() }, 1200)
    }, 400)
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Upload New Art</h2>

      {/* Drop zone */}
      <div
        className={`${styles.dropZone} ${dragging ? styles.dropActive : ''} ${preview ? styles.dropHasImage : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="preview" className={styles.previewImg} />
        ) : (
          <div className={styles.dropInner}>
            <span className={styles.dropIcon}>📷</span>
            <p className={styles.dropText}>Tap or drag your photo here</p>
            <p className={styles.dropSub}>JPG, PNG, WEBP supported</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }}
        />
      </div>
      {preview && (
        <button className={styles.clearImg} onClick={() => setPreview('')}>✕ Remove photo</button>
      )}

      {/* Category */}
      <label className={styles.label}>Category</label>
      <div className={styles.catBtns}>
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            className={`${styles.catBtn} ${form.category === c.value ? styles.catBtnActive : ''}`}
            onClick={() => setForm(f => ({ ...f, category: c.value }))}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Title */}
      <label className={styles.label}>Title <span className={styles.req}>*</span></label>
      <input
        className={styles.input}
        placeholder="e.g. Sunset Bloom"
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
      />

      {/* Description */}
      <label className={styles.label}>Description</label>
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        placeholder="Tell the story behind this piece…"
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
      />

      {/* Availability toggle */}
      <label className={styles.toggleRow}>
        <span>Mark as Available</span>
        <div
          className={`${styles.toggle} ${form.available ? styles.toggleOn : ''}`}
          onClick={() => setForm(f => ({ ...f, available: !f.available }))}
        >
          <span className={styles.toggleThumb} />
        </div>
      </label>

      <button
        className={`${styles.primaryBtn} ${saving ? styles.saving : ''} ${success ? styles.success : ''}`}
        onClick={handleSave}
        disabled={saving || !form.title.trim()}
      >
        {success ? '✓ Saved!' : saving ? 'Saving…' : '✦ Add to Collection'}
      </button>
    </div>
  )
}

// ── Piece Card (manage) ───────────────────────────────────
function PieceCard({ piece, onUpdate, onDelete }: { piece: ArtPiece; onUpdate: (p: ArtPiece) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: piece.title, description: piece.description })
  const [confirmDel, setConfirmDel] = useState(false)

  const save = () => {
    onUpdate({ ...piece, title: form.title, description: form.description })
    setEditing(false)
  }

  const ICONS: Record<ArtCategory, string> = { canvas: '🖌️', crochet: '🧶', resin: '💎' }

  return (
    <div className={styles.pieceCard}>
      <div className={styles.pieceImgWrap}>
        {piece.imageData
          ? <img src={piece.imageData} alt={piece.title} className={styles.pieceImg} />
          : <div className={styles.pieceNoImg}>{ICONS[piece.category]}</div>
        }
      </div>
      <div className={styles.pieceBody}>
        {editing ? (
          <>
            <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className={styles.pieceActions}>
              <button className={styles.saveBtn} onClick={save}>Save</button>
              <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.pieceCat}>{ICONS[piece.category]} {piece.category}</p>
            <p className={styles.pieceTitle}>{piece.title}</p>
            {piece.description && <p className={styles.pieceDesc}>{piece.description}</p>}
            <div className={styles.pieceActions}>
              <button
                className={`${styles.availBtn} ${piece.available ? styles.availOn : styles.availOff}`}
                onClick={() => onUpdate({ ...piece, available: !piece.available })}
              >
                {piece.available ? '✓ Available' : '✕ Sold'}
              </button>
              <button className={styles.editBtn} onClick={() => setEditing(true)}>✎ Edit</button>
              {confirmDel
                ? <>
                    <button className={styles.delConfirm} onClick={() => onDelete(piece.id)}>Delete?</button>
                    <button className={styles.cancelBtn} onClick={() => setConfirmDel(false)}>No</button>
                  </>
                : <button className={styles.delBtn} onClick={() => setConfirmDel(true)}>🗑</button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Settings Form ─────────────────────────────────────────
function SettingsForm() {
  const { config, updateConfig } = useStore()
  const [form, setForm] = useState<StoreConfig>(config)
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateConfig(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Shop Settings</h2>

      <label className={styles.label}>Shop Name</label>
      <input className={styles.input} value={form.shopName} onChange={e => setForm(f => ({ ...f, shopName: e.target.value }))} />

      <label className={styles.label}>Tagline</label>
      <textarea className={`${styles.input} ${styles.textarea}`} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />

      <label className={styles.label}>Instagram URL</label>
      <input className={styles.input} placeholder="https://instagram.com/yourhandle" value={form.instagramUrl} onChange={e => setForm(f => ({ ...f, instagramUrl: e.target.value }))} />

      <label className={styles.label}>Contact Email</label>
      <input className={styles.input} type="email" placeholder="you@example.com" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} />

      <label className={styles.label}>WhatsApp Number (with country code)</label>
      <input className={styles.input} placeholder="e.g. 919876543210" value={form.whatsappNumber} onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} />

      <label className={styles.label}>Admin Password</label>
      <input className={styles.input} type="password" value={form.adminPassword} onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))} />

      <button className={`${styles.primaryBtn} ${saved ? styles.success : ''}`} onClick={save}>
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}

// ── Main Admin Page ───────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('upload')
  const { pieces, update, remove } = useStore()

  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <a href="/" className={styles.backLink}>← Shop</a>
        <h1 className={styles.headerTitle}>✦ Admin Panel</h1>
        <span />
      </header>

      <nav className={styles.nav}>
        {([
          { key: 'upload',   label: '+ Upload' },
          { key: 'pieces',   label: `Collection (${pieces.length})` },
          { key: 'settings', label: '⚙ Settings' },
        ] as { key: Tab; label: string }[]).map(t => (
          <button
            key={t.key}
            className={`${styles.navTab} ${tab === t.key ? styles.navTabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {tab === 'upload' && <UploadForm onSave={() => setTab('pieces')} />}

        {tab === 'pieces' && (
          pieces.length === 0
            ? <div className={styles.empty}>
                <span>🎨</span>
                <p>No pieces yet. Upload your first art!</p>
                <button className={styles.primaryBtn} style={{ marginTop: 20 }} onClick={() => setTab('upload')}>+ Upload</button>
              </div>
            : <div className={styles.pieceList}>
                {pieces.map(p => (
                  <PieceCard key={p.id} piece={p} onUpdate={update} onDelete={remove} />
                ))}
              </div>
        )}

        {tab === 'settings' && <SettingsForm />}
      </div>
    </div>
  )
}
