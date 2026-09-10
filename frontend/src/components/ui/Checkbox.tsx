import { Check } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  count?: number;
}

/**
 * A real `<input type="checkbox">` visually replaced by a styled box, so the
 * control keeps native keyboard, form and assistive-technology behaviour.
 */
export function Checkbox({ id, label, description, count, className, ...props }: CheckboxProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="relative mt-0.5 inline-flex size-[1.125rem] shrink-0">
        <input
          id={id}
          type="checkbox"
          className="peer size-full cursor-pointer appearance-none rounded-[5px] border border-border bg-surface transition-colors checked:border-foreground checked:bg-foreground focus-visible:ring-2 focus-visible:ring-burgundy/30 focus-visible:ring-offset-1"
          {...props}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto size-3 text-background opacity-0 transition-opacity peer-checked:opacity-100"
        />
      </span>
      <label htmlFor={id} className="cursor-pointer select-none text-sm leading-snug text-foreground">
        {label}
        {typeof count === "number" ? <span className="ml-1.5 text-xs text-muted tabular">({count})</span> : null}
        {description ? <span className="mt-0.5 block text-xs text-muted">{description}</span> : null}
      </label>
    </div>
  );
}
