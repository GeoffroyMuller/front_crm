import type { Rules } from "@/core/helpers/rules";

export interface FormInputProps<T> {
  label?: string;
  modelValue?: T;
  readonly?: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
  rules?: Rules;
}

export interface Notification {
  id?: string;
  type: Color;
  message: string;
  title: string;
  duration?: number;
  autoClose?: boolean;
}

export interface Confirmation {
  type?: Notification["type"];
  message: string;
  title: string;
}

export type Color =
  | "primary"
  | "danger"
  | "warning"
  | "success"
  | "white"
  | "black";

export type Size = "sm" | "md" | "lg" | "xl";
