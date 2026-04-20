import { useState, useEffect, useCallback } from 'react';
import type { ArtPiece, StoreConfig } from '../types';
import {
  getArtPieces,
  saveArtPieces,
  addArtPiece,
  updateArtPiece,
  deleteArtPiece,
  getConfig,
  saveConfig,
} from '../utils/storage';

export function useStore() {
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [config, setConfig] = useState<StoreConfig>(getConfig());

  useEffect(() => {
    setPieces(getArtPieces());
  }, []);

  const refresh = useCallback(() => {
    setPieces(getArtPieces());
  }, []);

  const add = useCallback((piece: ArtPiece) => {
    addArtPiece(piece);
    refresh();
  }, [refresh]);

  const update = useCallback((piece: ArtPiece) => {
    updateArtPiece(piece);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    deleteArtPiece(id);
    refresh();
  }, [refresh]);

  const updateConfig = useCallback((cfg: StoreConfig) => {
    saveConfig(cfg);
    setConfig(cfg);
  }, []);

  const reorder = useCallback((ordered: ArtPiece[]) => {
    saveArtPieces(ordered);
    setPieces(ordered);
  }, []);

  return { pieces, config, add, update, remove, updateConfig, reorder, refresh };
}
