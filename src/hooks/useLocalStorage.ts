import { useState } from "react";

export default function useLocalStorage(key: string, initialValue: string) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    return localStorage.getItem(key);
  });

  const setValue = (value: string | Function) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    setStoredValue(valueToStore);

    if (typeof window !== "undefined") {
      const stringifiedValueToStore =
        typeof valueToStore === "string"
          ? valueToStore
          : JSON.stringify(valueToStore);
      localStorage.setItem(key, stringifiedValueToStore);
    }
  };

  const removeValue = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  };

  return [storedValue, setValue, removeValue] as [
    string,
    typeof setStoredValue,
    typeof removeValue
  ];
}
