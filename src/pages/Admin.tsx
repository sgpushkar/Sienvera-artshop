import { useCallback, useMemo, useRef, useState } from 'react';
import { useStore } from '../hooks/useStore';
import type { ArtCategory, ArtPiece, StoreConfig } from '../types';
import { uploadArtworkImage } from '../utils/cloudinary';
import { defaultConfig, generateId } from '../utils/storage';
import styles from './Admin.module.css';

type Tab = 'pieces' | 'upload' | 'settings';

const CATEGORIES: { value: ArtCategory; label: string; icon: string }[] = [
  { value: 'canvas', label: 'Canvas Painting', icon: 'Canvas' },
  { value: 'crochet', label: 'Crochet Art', icon: 'Crochet' },
  { value: 'resin', label: 'Resin Art', icon: 'Resin' },
];

function AuthGate({ config, onAuth }: { config: StoreConfig; onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  const submit = () => {
    if (pw === config.adminPassword) {
      onAuth();
      return;
    }

    setErr(true);
    setPw('');
  };

  return (
    <div className={styles.authWrap}>
      <div className={styles.authBox}>
        <span className={styles.authIcon}>Lock</span>
        <h1 className={styles.authTitle}>Admin Panel</h1>
        <p className={styles.authSub}>Enter your password to manage your collection.</p>
        <input
          className={`${styles.input} ${err ? styles.inputError : ''}`}
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(event) => {
            setPw(event.target.value);
            setErr(false);
          }}
          onKeyDown={(event) => event.key === 'Enter' && submit()}
          autoFocus
        />
        {err && <p className={styles.errMsg}>Wrong password. Try again.</p>}
        <button className={styles.primaryBtn} onClick={submit}>
          Enter
        </button>
        <a href="/" className={styles.backLink}>
          Back to shop
        </a>
      </div>
    </div>
  );
}

function UploadForm({ onSave, add }: { onSave: () => void; add: (piece: ArtPiece) => Promise<void> }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'canvas' as ArtCategory,
    available: true,
  });
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => setPreview((event.target?.result as string) || '');
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      loadFile(file);
    }
  }, []);

  const resetForm = () => {
    setSelectedFile(null);
    setPreview('');
    setError(null);
    setForm({ title: '', description: '', category: 'canvas', available: true });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (!selectedFile) {
      setError('Please upload an image before saving.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const upload = await uploadArtworkImage(selectedFile);
      const piece: ArtPiece = {
        id: generateId(),
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        imageUrl: upload.url,
        cloudinaryPublicId: upload.publicId,
        available: form.available,
        createdAt: Date.now(),
      };

      await add(piece);
      setSuccess(true);
      resetForm();
      window.setTimeout(() => {
        setSuccess(false);
        onSave();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Upload New Art</h2>

      <div
        className={`${styles.dropZone} ${dragging ? styles.dropActive : ''} ${preview ? styles.dropHasImage : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="preview" className={styles.previewImg} />
        ) : (
          <div className={styles.dropInner}>
            <span className={styles.dropIcon}>Upload</span>
            <p className={styles.dropText}>Tap or drag your photo here</p>
            <p className={styles.dropSub}>JPG, PNG, WEBP supported</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) loadFile(file);
          }}
        />
      </div>

      {preview && (
        <button className={styles.clearImg} onClick={() => resetForm()}>
          Remove photo
        </button>
      )}

      <label className={styles.label}>Category</label>
      <div className={styles.catBtns}>
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            className={`${styles.catBtn} ${form.category === category.value ? styles.catBtnActive : ''}`}
            onClick={() => setForm((current) => ({ ...current, category: category.value }))}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      <label className={styles.label}>
        Title <span className={styles.req}>*</span>
      </label>
      <input
        className={styles.input}
        placeholder="e.g. Sunset Bloom"
        value={form.title}
        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
      />

      <label className={styles.label}>Description</label>
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        placeholder="Tell the story behind this piece..."
        value={form.description}
        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
      />

      <label className={styles.toggleRow}>
        <span>Mark as Available</span>
        <div
          className={`${styles.toggle} ${form.available ? styles.toggleOn : ''}`}
          onClick={() => setForm((current) => ({ ...current, available: !current.available }))}
        >
          <span className={styles.toggleThumb} />
        </div>
      </label>

      {error && <p className={styles.errMsg}>{error}</p>}

      <button className={`${styles.primaryBtn} ${saving ? styles.saving : ''} ${success ? styles.success : ''}`} onClick={handleSave} disabled={saving || !form.title.trim()}>
        {success ? 'Saved' : saving ? 'Uploading...' : 'Add to Collection'}
      </button>
    </div>
  );
}

function PieceCard({
  piece,
  onUpdate,
  onDelete,
}: {
  piece: ArtPiece;
  onUpdate: (piece: ArtPiece) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: piece.title, description: piece.description });
  const [confirmDel, setConfirmDel] = useState(false);

  const save = async () => {
    await onUpdate({ ...piece, title: form.title, description: form.description });
    setEditing(false);
  };

  return (
    <div className={styles.pieceCard}>
      <div className={styles.pieceImgWrap}>
        {piece.imageUrl ? <img src={piece.imageUrl} alt={piece.title} className={styles.pieceImg} /> : <div className={styles.pieceNoImg}>{piece.category}</div>}
      </div>
      <div className={styles.pieceBody}>
        {editing ? (
          <>
            <input className={styles.input} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            <div className={styles.pieceActions}>
              <button className={styles.saveBtn} onClick={() => void save()}>
                Save
              </button>
              <button className={styles.cancelBtn} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.pieceCat}>{piece.category}</p>
            <p className={styles.pieceTitle}>{piece.title}</p>
            {piece.description && <p className={styles.pieceDesc}>{piece.description}</p>}
            <div className={styles.pieceActions}>
              <button className={`${styles.availBtn} ${piece.available ? styles.availOn : styles.availOff}`} onClick={() => void onUpdate({ ...piece, available: !piece.available })}>
                {piece.available ? 'Available' : 'Sold'}
              </button>
              <button className={styles.editBtn} onClick={() => setEditing(true)}>
                Edit
              </button>
              {confirmDel ? (
                <>
                  <button className={styles.delConfirm} onClick={() => void onDelete(piece.id)}>
                    Delete?
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setConfirmDel(false)}>
                    No
                  </button>
                </>
              ) : (
                <button className={styles.delBtn} onClick={() => setConfirmDel(true)}>
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SettingsForm({ config, updateConfig }: { config: StoreConfig; updateConfig: (config: StoreConfig) => Promise<void> }) {
  const [form, setForm] = useState<StoreConfig>(config);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    try {
      setError(null);
      await updateConfig(form);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings.');
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Shop Settings</h2>

      <label className={styles.label}>Shop Name</label>
      <input className={styles.input} value={form.shopName} onChange={(event) => setForm((current) => ({ ...current, shopName: event.target.value }))} />

      <label className={styles.label}>Tagline</label>
      <textarea className={`${styles.input} ${styles.textarea}`} value={form.tagline} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} />

      <label className={styles.label}>Instagram URL</label>
      <input className={styles.input} placeholder="https://instagram.com/yourhandle" value={form.instagramUrl} onChange={(event) => setForm((current) => ({ ...current, instagramUrl: event.target.value }))} />

      <label className={styles.label}>Contact Email</label>
      <input className={styles.input} type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(event) => setForm((current) => ({ ...current, contactEmail: event.target.value }))} />

      <label className={styles.label}>WhatsApp Number (with country code)</label>
      <input className={styles.input} placeholder="e.g. 919876543210" value={form.whatsappNumber} onChange={(event) => setForm((current) => ({ ...current, whatsappNumber: event.target.value }))} />

      <label className={styles.label}>Admin Password</label>
      <input className={styles.input} type="password" value={form.adminPassword} onChange={(event) => setForm((current) => ({ ...current, adminPassword: event.target.value }))} />

      {error && <p className={styles.errMsg}>{error}</p>}

      <button className={`${styles.primaryBtn} ${saved ? styles.success : ''}`} onClick={() => void save()}>
        {saved ? 'Saved' : 'Save Settings'}
      </button>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('upload');
  const { pieces, config, loading, error, add, update, remove, updateConfig } = useStore();

  const gateConfig = useMemo(() => config ?? defaultConfig, [config]);

  if (!authed) {
    return <AuthGate config={gateConfig} onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <a href="/" className={styles.backLink}>
          Shop
        </a>
        <h1 className={styles.headerTitle}>Admin Panel</h1>
        <span />
      </header>

      <nav className={styles.nav}>
        {([
          { key: 'upload', label: '+ Upload' },
          { key: 'pieces', label: `Collection (${pieces.length})` },
          { key: 'settings', label: 'Settings' },
        ] as { key: Tab; label: string }[]).map((item) => (
          <button key={item.key} className={`${styles.navTab} ${tab === item.key ? styles.navTabActive : ''}`} onClick={() => setTab(item.key)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {loading && <p className={styles.authSub}>Loading store data...</p>}
        {error && <p className={styles.errMsg}>{error}</p>}

        {tab === 'upload' && <UploadForm onSave={() => setTab('pieces')} add={add} />}

        {tab === 'pieces' &&
          (pieces.length === 0 ? (
            <div className={styles.empty}>
              <span>Art</span>
              <p>No pieces yet. Upload your first artwork.</p>
              <button className={styles.primaryBtn} style={{ marginTop: 20 }} onClick={() => setTab('upload')}>
                + Upload
              </button>
            </div>
          ) : (
            <div className={styles.pieceList}>
              {pieces.map((piece) => (
                <PieceCard key={piece.id} piece={piece} onUpdate={update} onDelete={remove} />
              ))}
            </div>
          ))}

        {tab === 'settings' && <SettingsForm config={config} updateConfig={updateConfig} />}
      </div>
    </div>
  );
}
