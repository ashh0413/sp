/**
 * UPI Deep Link Generator
 * Generates UPI payment URLs for Indian payment apps
 */

export interface UPIParams {
  pa: string;  // Payee UPI ID (e.g., "user@upi")
  pn: string;  // Payee Name
  am: string;  // Amount
  cu?: string; // Currency (default: INR)
  tn?: string; // Transaction note
  mc?: string; // Merchant category code
}

/**
 * Generate a UPI deep link URL
 * Format: upi://pay?pa=user@upi&pn=Name&am=100&cu=INR&tn=Note
 */
export function generateUPIUrl(params: UPIParams): string {
  const searchParams = new URLSearchParams({
    pa: params.pa,
    pn: params.pn,
    am: params.am,
    cu: params.cu || "INR",
    ...(params.tn && { tn: params.tn }),
    ...(params.mc && { mc: params.mc }),
  });

  return `upi://pay?${searchParams.toString()}`;
}

/**
 * Validate UPI ID format
 * Standard format: anything@upiname (e.g., user@ybl, someone@gpay)
 */
export function isValidUPIId(upiId: string): boolean {
  // Basic UPI ID validation - must contain @ and have text before it
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return upiRegex.test(upiId) && upiId.length >= 3 && upiId.length <= 50;
}

/**
 * Common UPI apps and their package names (for reference)
 */
export const UPI_APPS = {
  gpay: {
    name: "Google Pay",
    package: "com.google.android.apps.nbu.paisa.user",
    color: "#4285F4",
  },
  phonepe: {
    name: "PhonePe",
    package: "com.phonepe.app",
    color: "#5F259F",
  },
  paytm: {
    name: "Paytm",
    package: "com.paytm.nativesparks",
    color: "#00B9F1",
  },
  bhim: {
    name: "BHIM UPI",
    package: "in.org.npci.upiapp",
    color: "#6C4EE5",
  },
} as const;
