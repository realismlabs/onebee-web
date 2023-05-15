import React from "react";
import Image from "next/image";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { utcToZonedTime, format as tzFormat } from "date-fns-tz";

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
  const lightness = 0.38; // 40% lightness to ensure good contrast with white text

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

  let hueModifier = 0;

  if (input.length > 0) {
    const code = input.charCodeAt(0);
    hueModifier = code % 16;
  }

  const hueValue = (hue + hueModifier / 100) % 1;

  const r = Math.round(hslToRgb(p, q, hueValue + 1 / 3) * 255);
  const g = Math.round(hslToRgb(p, q, hueValue) * 255);
  const b = Math.round(hslToRgb(p, q, hueValue - 1 / 3) * 255);

  const rgbToHex = (r: number, g: number, b: number): string =>
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  return rgbToHex(r, g, b);
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateWorkspaceIcon(name: string): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const color = "#ab4aba";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const numberOfArcs = getRandomInt(5, 10);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < numberOfArcs; i++) {
    const radius = getRandomInt(60, 80);
    const startAngle = Math.random() * Math.PI * 2;
    const endAngle = startAngle + Math.random() * Math.PI * 2;
    const arcX = centerX + getRandomInt(-centerX, centerX);
    const arcY = centerY + getRandomInt(-centerY, centerY);

    const gradient = ctx.createLinearGradient(
      arcX - radius,
      arcY - radius,
      arcX + radius,
      arcY + radius
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(arcX, arcY, radius, startAngle, endAngle);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "hard-light";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "hard-light";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png");
}

export function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Try deterministic assignment with radix color
type ColorMap = { [key: string]: string };

const colorTable: ColorMap = {
  orange: "#f76808",
  blue: "#0091ff",
  crimson9: "#e93d82",
  amber9: "#ffb224",
  plums9: "#ab4aba",
};

export function assignColor(name: string): string {
  // Get a deterministic color based on the name
  const hashCode = name
    .split("")
    .reduce(
      (acc: number, char) => (acc = char.charCodeAt(0) + ((acc << 7) - acc)),
      0
    );
  const index = Math.abs(hashCode) % Object.keys(colorTable).length;

  // Assign the color from the table
  return Object.values(colorTable)[index];
}

export function formatFriendlyDate(isoDateString: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateObject = utcToZonedTime(isoDateString, timeZone);
  const formattedDate = format(dateObject, "PPPpp");
  const timeZoneAbbr = tzFormat(dateObject, "zzz", { timeZone });

  // Transforms  2023-04-28T14:16:27.000Z into April 28th, 2023 at 10:16:27 AM EDT
  return `${formattedDate} ${timeZoneAbbr}`;
}

export function friendlyRelativeDateToNow(isoDateString: string) {
  if (!isoDateString) return null;

  const formattedDistance = formatDistanceToNow(parseISO(isoDateString), {
    addSuffix: true,
  });
  return formattedDistance
    .replace("minute", "min")
    .replace("hour", "hr")
    .replace("day", "day")
    .replace("week", "w")
    .replace("month", "mo")
    .replace("year", "y")
    .replace("about", "")
    .trim();
}

export function getInitials(name: string) {
  const words = name.split(" ");

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  } else {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
}

export function isCommonEmailProvider(str: string) {
  const pattern =
    /@(gmail\.com|yahoo\.com|hotmail\.com|aol\.com|outlook\.com|live\.com|msn\.com|icloud\.com|zoho\.com|protonmail\.com|mail\.com|yandex\.com)$/;
  return pattern.test(str);
}
