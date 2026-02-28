import crypto from "crypto";

export function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function generateCodeVerifier() {
  return base64UrlEncode(crypto.randomBytes(32)); // 43~128 chars ok
}

export function generateCodeChallenge(verifier: string) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return base64UrlEncode(hash);
}

export function generateState() {
  return base64UrlEncode(crypto.randomBytes(16));
}
