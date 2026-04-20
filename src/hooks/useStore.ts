import { useCallback, useEffect, useState } from 'react';
import type { ArtPiece, StoreConfig } from '../types';
import {
  addArtPiece,
  deleteArtPiece,
  defaultConfig,
  getArtPieces,
  getConfig,
  saveArtPieces,
  saveConfig,
  updateArtPiece,
} from '../utils/storage';

export function useStore() {
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nextPieces, nextConfig] = await Promise.all([getArtPieces(), getConfig()]);
      setPieces(nextPieces);
      setConfig(nextConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load store data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (piece: ArtPiece) => {
      await addArtPiece(piece);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (piece: ArtPiece) => {
      await updateArtPiece(piece);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteArtPiece(id);
      await refresh();
    },
    [refresh]
  );

  const updateConfig = useCallback(async (cfg: StoreConfig) => {
    await saveConfig(cfg);
    setConfig(cfg);
  }, []);

  const reorder = useCallback(async (ordered: ArtPiece[]) => {
    await saveArtPieces(ordered);
    setPieces(ordered);
  }, []);

  return { pieces, config, loading, error, add, update, remove, updateConfig, reorder, refresh };
}
