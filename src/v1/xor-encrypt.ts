interface XorEncryptProps {
  value?: string;
  hash: string;
}

/**
 * Encrypts a string using XOR encryption
 *
 * @param {XorEncryptProps} props - The string to encrypt and the hash to use
 * @param {string} [props.value] - The string to encrypt
 * @param {string} props.hash - The hash to use for encryption
 * @returns {string} - The encrypted string
 */
export function xorEncrypt({ value, hash }: XorEncryptProps): string {
  if (!value || !value.trim() || !hash) {
    return "";
  }

  for (let i = 0; i < hash.length; i++) {
    value = value
      .split("")
      .map((char) => String.fromCharCode(hash[i].charCodeAt(0) ^ char.charCodeAt(0)))
      .join("");
  }

  return value;
}
