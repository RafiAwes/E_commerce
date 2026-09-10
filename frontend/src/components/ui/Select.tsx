import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Field, controlStyles } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "children"> {
  id: string;
  label: string;
  options: readonly SelectOption[];
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  containerClassName?: string;
}

/**
 * A native select, deliberately. It is keyboard- and screen-reader-correct on
 * every platform and gives mobile users the system picker.
 */
export function Select({
  id,
  label,
  options,
  hint,
  error,
  hideLabel,
  containerClassName,
  className,
  required,
  ...props
}: SelectProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} className={containerClassName}>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(controlStyles, "cursor-pointer appearance-none pr-10", className)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" />
      </div>
    </Field>
  );
}
