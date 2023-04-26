import React from "react";

export function abbreviateNumber(number: number | null) {
  const SI_SYMBOL = ["", "K", "M", "B"];

  if (number === null) {
    return "null";
  }

  if (number === 0) {
    return "0";
  }

  const tier = Math.floor(Math.log10(number) / 3);

  if (tier === 0) {
    return number.toString();
  }

  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const abbreviatedNumber = number / scale;

  return abbreviatedNumber.toFixed(2) + suffix;
}

export const useLocalStorageState = (key: any, defaultValue: any) => {
  const [state, setState] = React.useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {}
  }, [key, state]);

  return [state, setState];
};
