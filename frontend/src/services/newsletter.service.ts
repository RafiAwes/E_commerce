import { isValidEmail } from "@/lib/validations/email";

export interface NewsletterResult {
  readonly status: "success" | "error";
  readonly message: string;
}

/** Simulated latency so the UI exercises its real pending state. */
const SIMULATED_LATENCY_MS = 700;

export const newsletterService = {
  /**
   * Prototype subscription. A real implementation posts to `/newsletter`;
   * the calling form already handles pending, success and error states.
   */
  async subscribe(email: string): Promise<NewsletterResult> {
    if (!isValidEmail(email)) {
      return { status: "error", message: "Please enter a valid email address." };
    }

    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    return {
      status: "success",
      message: "You're on the list. Look out for our next collection.",
    };
  },
};
