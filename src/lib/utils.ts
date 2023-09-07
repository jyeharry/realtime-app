import { cx } from "class-variance-authority";
import { ClassValue } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

export function cls(...inputs: ClassValue[]) {
  return twMerge(cx(inputs))
}
