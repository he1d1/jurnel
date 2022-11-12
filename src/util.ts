export async function hashPassword(
  password: string,
  salt = crypto.getRandomValues(new Uint8Array(16))
): Promise<[ArrayBuffer, Uint8Array]> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return [hash, salt];
}
