import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Field, controlStyles } from "./Field";

type SharedFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  containerClassName?: string;
};

export type InputProps = SharedFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function Input({ id, label, hint, error, hideLabel, containerClassName, className, required, ...props }: InputProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(controlStyles, className)}
        {...props}
      />
    </Field>
  );
}

export type TextareaProps = SharedFieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

export function Textarea({ id, label, hint, error, hideLabel, containerClassName, className, required, ...props }: TextareaProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(controlStyles, "min-h-[6.5rem] resize-y", className)}
        {...props}
      />
    </Field>
  );
}
