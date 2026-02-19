// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. 内部的な State。初期値は引数で渡されたものを使う
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 2. ブラウザに表示された直後に1回だけ LocalStorage から読み込む
  // この時、エラーを避けるために requestAnimationFrame (次の描画タイミング) を使います
  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
        try {
        // 1. まずはJSONとして解析を試みる
        const parsed = JSON.parse(item);
        window.requestAnimationFrame(() => {
          setStoredValue(parsed);
        });
      } catch (e) {
        // 2. もし失敗して、かつデータが文字列なら、そのままセットする
        // これで "balance" (生文字) も救済できます
        window.requestAnimationFrame(() => {
          setStoredValue(item as unknown as T);
        });
      }
    }
  }, [key]);

  // 3. 値を更新するための関数
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}