import type { LineItemPersonalization, PersonalizationSpec } from "@/types/common";

export type PersonalizationErrors = Partial<Record<"name" | "message", string>>;

/** Characters we can reliably engrave — checked before the order is placed. */
const ENGRAVABLE = /^[\p{L}\p{N}\s'&.,!?()-]*$/u;

export function validatePersonalization(
  spec: PersonalizationSpec,
  value: Pick<LineItemPersonalization, "name" | "message">,
): PersonalizationErrors {
  const errors: PersonalizationErrors = {};
  const name = value.name.trim();

  if (name.length === 0) {
    errors.name = `${spec.nameLabel} is required.`;
  } else if (name.length > spec.maxNameLength) {
    errors.name = `Keep this to ${spec.maxNameLength} characters.`;
  } else if (!ENGRAVABLE.test(name)) {
    errors.name = "Use letters, numbers and basic punctuation only.";
  }

  if (spec.supportsMessage && value.message.length > spec.maxMessageLength) {
    errors.message = `Keep this to ${spec.maxMessageLength} characters.`;
  }

  return errors;
}

export function isPersonalizationComplete(
  spec: PersonalizationSpec,
  value: Pick<LineItemPersonalization, "name" | "message">,
): boolean {
  return Object.keys(validatePersonalization(spec, value)).length === 0;
}
