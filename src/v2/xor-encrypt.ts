export interface XorEncryptProps {
  value?: string;
  hash: string;
}

/**
 * Encrypts or decrypts a string using multi-pass XOR.
 *
 * @param props - Object with string value and hash
 * @returns The transformed string
 */
export function xorEncrypt({ value, hash }: XorEncryptProps): string {
  if (!value || !value.trim() || !hash) {
    return '';
  }

  let result = value;
  for (let i = 0; i < hash.length; i++) {
    const code = hash.charCodeAt(i);
    let pass = '';
    for (let j = 0; j < result.length; j++) {
      pass += String.fromCharCode(code ^ result.charCodeAt(j));
    }
    result = pass;
  }

  return result;
}
