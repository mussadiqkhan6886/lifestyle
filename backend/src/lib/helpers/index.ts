import { randomBytes } from "node:crypto";

export const createSlug = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export const generateOrderNumber = () => {
  const random = randomBytes(4).toString("hex").toUpperCase()
  return `LFS-${Date.now()}-${random}`
}