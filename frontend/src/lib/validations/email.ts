// Deliberately permissive: enough to catch typos without rejecting valid,
// unusual addresses. Real verification belongs on the server.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@,]+\.[^\s@,]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
