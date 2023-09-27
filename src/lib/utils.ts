import { cx } from "class-variance-authority";
import { ClassValue } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

export const cls = (...inputs: ClassValue[]) => {
  return twMerge(cx(inputs))
}

export const buildChatHref = (id1: string, id2: string) => {
  return [id1, id2].sort().join('--')
}

export const toPusherKey = (key: string) => {
  return key.replace(/:/g, '__')
}
