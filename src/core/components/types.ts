export interface FormInputProps<T> {
  label?: string;
  modelValue?: T;
  readonly?: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
  value?: T;
}

export type Color =
  | "primary"
  | "danger"
  | "warning"
  | "error"
  | "white"
  | "black";

export type Size = "sm" | "md" | "lg" | "xl";
