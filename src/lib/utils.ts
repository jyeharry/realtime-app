import { cx } from "class-variance-authority";
import { ClassValue } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

export function cls(...inputs: ClassValue[]) {
  return twMerge(cx(inputs))
}

export const buildChatHref = (id1: string, id2: string) => {
  return [id1, id2].sort().join('--')
}
