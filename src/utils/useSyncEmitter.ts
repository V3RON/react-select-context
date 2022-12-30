import { createNanoEvents, Emitter } from 'nanoevents';
import { useRef } from 'react';

interface SyncEmitterEvents<T> {
  update: (value: T) => void;
}

export type SyncEmitter<T> = Emitter<SyncEmitterEvents<T>>;

export const useSyncEmitter = <T>(): SyncEmitter<T> => {
  const emitterRef = useRef<SyncEmitter<T> | null>(null);

  if (emitterRef.current === null) {
    emitterRef.current = createNanoEvents<SyncEmitterEvents<T>>();
  }

  return emitterRef.current;
};
