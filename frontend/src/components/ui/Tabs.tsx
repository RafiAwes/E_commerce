"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: readonly TabItem[];
  defaultTabId?: string;
  className?: string;
}

/**
 * WAI-ARIA tabs with roving focus: arrow keys move between tabs, Home and End
 * jump to the ends, and only the active tab is in the tab order.
 */
export function Tabs({ items, defaultTabId, className }: TabsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id ?? "");
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];
  if (!activeItem) return null;

  function focusTab(index: number) {
    const target = items[(index + items.length) % items.length];
    if (!target) return;
    setActiveId(target.id);
    tabRefs.current.get(target.id)?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(items.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label="Product information" className="hide-scrollbar flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item, index) => {
          const selected = item.id === activeItem.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) tabRefs.current.set(item.id, node);
                else tabRefs.current.delete(item.id);
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative -mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                selected ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${activeItem.id}`}
        aria-labelledby={`${baseId}-tab-${activeItem.id}`}
        tabIndex={0}
        className="animate-fade-in pt-7 focus-visible:outline-none"
      >
        {activeItem.content}
      </div>
    </div>
  );
}
