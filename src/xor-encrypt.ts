interface XorEncryptProps {
  value?: string;
  hash: string;
}

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
