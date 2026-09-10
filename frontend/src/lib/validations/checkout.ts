import type { CheckoutData } from "@/types/common";
import { isValidEmail } from "./email";

export type CheckoutField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "addressLine1"
  | "city"
  | "district"
  | "postcode";

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

const BD_PHONE_PATTERN = /^(\+?880|0)1[3-9]\d{8}$/;

/**
 * Pure validation for the checkout form.
 *
 * Kept out of the component so the same rules can run on submit, on blur, or
 * later on a server action without duplication.
 */
export function validateCheckout(data: CheckoutData): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const { contact, address } = data;

  if (contact.firstName.trim().length < 2) errors.firstName = "Enter your first name.";
  if (contact.lastName.trim().length < 2) errors.lastName = "Enter your last name.";
  if (!isValidEmail(contact.email)) errors.email = "Enter a valid email address.";
  if (!BD_PHONE_PATTERN.test(contact.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid Bangladeshi mobile number.";
  }
  if (address.addressLine1.trim().length < 4) errors.addressLine1 = "Enter a street address.";
  if (address.city.trim().length < 2) errors.city = "Enter a city.";
  if (address.district.trim().length < 2) errors.district = "Enter a district.";
  if (!/^\d{4}$/.test(address.postcode.trim())) errors.postcode = "Enter a 4-digit postcode.";

  return errors;
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length > 0;
}
