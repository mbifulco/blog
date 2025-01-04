// Sourced (and typesafe-tweaked) from https://github.com/uidotdev/usehooks/blob/main/index.js#L616

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useEffect, useSyncExternalStore } from 'react';

function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
}

const setLocalStorageItem = (key: string, value: unknown) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => {
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback: (event: StorageEvent) => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getLocalStorageServerSnapshot = () => {
  // throw Error('useLocalStorage is a client-only hook');
  return '{}';
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = () => {
    const stored = JSON.parse(getLocalStorageItem(key) || '{}');
    return JSON.stringify({
      ...initialValue,
      ...stored,
    });
  };

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot
  );

  const setState = useCallback(
    (v: unknown) => {
      try {
        const nextState =
          typeof v === 'function' ? v(JSON.parse(store || '{}')) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store]
  );

  useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== 'undefined'
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState] as [
    T,
    (v: unknown) => void,
  ];
}
