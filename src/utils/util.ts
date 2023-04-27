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

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface CallApiOptions {
  method: Method;
  url: string;
  data?: object;
}

export const callApi = async ({
  method,
  url,
  data,
}: CallApiOptions): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  console.log("response from callApi", response);

  if (!response.ok) {
    throw new Error(`API call failed with status ${response.status}`);
  }

  return await response.json();
};

export function stringToVibrantColor(input: string): string {
  const hash = Array.from(input).reduce(
    (accumulator, char) =>
      char.charCodeAt(0) + ((accumulator << 5) - accumulator),
    0
  );

  const hue = (hash % 360) / 360;
  const saturation = 0.6; // 60% saturation for vibrancy
  const lightness = 0.4; // 40% lightness to ensure good contrast with white text

  const hslToRgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  const r = Math.round(hslToRgb(p, q, hue + 1 / 3) * 255);
  const g = Math.round(hslToRgb(p, q, hue) * 255);
  const b = Math.round(hslToRgb(p, q, hue - 1 / 3) * 255);

  const rgbToHex = (r: number, g: number, b: number): string =>
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  return rgbToHex(r, g, b);
}
