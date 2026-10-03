import { remove as removeConfusables } from 'confusables';

export type CapitalizeModeType = 'words' | 'first-letter';

export interface NormalizeOptions {
  /**
   * Removes diacritics from the text (e.g. "João" -> "Joao").
   * Set this to `false` to preserve diacritics.
   * @default true
   */
  removeDiacritics?: boolean;

  /**
   * Removes emojis from the text.
   * Set this to `false` to preserve emojis.
   * @default true
   */
  removeEmojis?: boolean;

  /**
   * Trims whitespace from the beginning and end of the text.
   * Set this to `false` to disable trimming.
   * @default true
   */
  trim?: boolean;

  /**
   * Set the length of the text to which it should be normalized.
   * Counted in Unicode code points (not UTF-16 units), so astral
   * characters aren't cut in half.
   */
  maxLength?: number;
}

function isDiacriticLatinChar(char: string): boolean {
  const decomposed = char.normalize('NFD');
  return decomposed.length > 1 && /^[A-Za-z]/.test(decomposed);
}

const EMOJI_SEQUENCE_RE =
  /(\p{Extended_Pictographic}\uFE0F?(\u200D\p{Extended_Pictographic}\uFE0F?)*|[0-9#*]\uFE0F?\u20E3|\p{Regional_Indicator}{2})/gu;

function withProtectedConfusables(
  text: string,
  { protectDiacritics, protectEmojis }: { protectDiacritics: boolean; protectEmojis: boolean },
  run: (input: string) => string,
): string {
  const preserved: string[] = [];
  const protect = (match: string): string => {
    preserved.push(match);
    return `\uE000${preserved.length - 1}\uE001`;
  };

  let protectedText = text;

  if (protectEmojis) {
    protectedText = protectedText.replace(EMOJI_SEQUENCE_RE, protect);
  }

  if (protectDiacritics) {
    protectedText = Array.from(protectedText)
      .map((char) => (isDiacriticLatinChar(char) ? protect(char) : char))
      .join('');
  }

  const result = run(protectedText);

  return result.replace(/\uE000(\d+)\uE001/g, (_, index: string) => preserved[Number(index)]);
}

/**
 * Normalizes a string by cleaning invisible chars, normalizing diacritics, emojis, and homoglyphs.
 */
export function normalize(text: string, options?: NormalizeOptions): string;
export function normalize(text: null, options?: NormalizeOptions): null;
export function normalize(text: undefined, options?: NormalizeOptions): undefined;
export function normalize(text?: string | null, options?: NormalizeOptions): string | undefined | null;
export function normalize(
  text?: string | null,
  { removeDiacritics = true, removeEmojis = true, trim = true, maxLength }: NormalizeOptions = {},
): string | undefined | null {
  if (!text) {
    return text;
  }

  // Invisible/control characters: always stripped
  text = text.replace(/[\u00A0\u202F\u200B-\u200F\u2028\u2029\u2066-\u2069]/g, '');

  if (removeDiacritics) {
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } else {
    text = text.normalize('NFC');
  }

  if (removeEmojis) {
    text = text.replace(/\p{Extended_Pictographic}/gu, '');
  }

  if (trim) {
    text = text.trim();
  }

  if (maxLength !== undefined) {
    const chars = Array.from(text);
    if (chars.length > maxLength) {
      text = chars.slice(0, maxLength).join('');
    }
  }

  const protectDiacritics = !removeDiacritics;
  const protectEmojis = !removeEmojis;

  return protectDiacritics || protectEmojis
    ? withProtectedConfusables(text, { protectDiacritics, protectEmojis }, removeConfusables)
    : removeConfusables(text);
}

export const normalizeText = normalize;

/**
 * Capitalizes a string according to PT-BR standards, fiscal terms, and acronyms.
 */
export function capitalize(text: string, mode?: CapitalizeModeType): string;
export function capitalize(text: null, mode?: CapitalizeModeType): null;
export function capitalize(text: undefined, mode?: CapitalizeModeType): undefined;
export function capitalize(text?: string | null, mode?: CapitalizeModeType): string | undefined | null;
export function capitalize(
  text?: string | null,
  mode: CapitalizeModeType = 'words',
): string | undefined | null {
  if (!text) {
    return text;
  }

  if (mode === 'first-letter') {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const words = text.split(' ');

  const capitalizeSingleWord = (singleWord: string): string => {
    return singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase();
  };

  const capitalizeSegmented = (wordPart: string, separator: string): string => {
    return wordPart
      .split(separator)
      .map((part) => capitalizeSingleWord(part))
      .join(separator);
  };

  const capitalizedWords = words.map((word, index) => {
    // Should capitalize when first word, but not when in the middle
    if (word.match(/^(?:em|por|para|de|da|das|do|dos|del|by|à|e|o|ou|y)$/i)) {
      if (index !== 0) {
        return word.toLowerCase();
      }
    }

    // Custom validations
    if (word.match(/^(?:pj|ga7|lg|mt|gp|gbl|wl|hkd|nm|amd|crm|gg|rca|tti|mg|sc|gl|jbf)$/i)) {
      return word.toUpperCase();
    }

    // Matches fiscal words
    if (word.match(/^(?:efd|ncm|cfop)$/i)) {
      return word.toUpperCase();
    }
    if (word.match(/^(?:dfe)$/i)) {
      return 'DFe';
    }
    if (word.match(/^(?:df-e)$/i)) {
      return 'DF-e';
    }
    if (word.match(/^(?:nfe)$/i)) {
      return 'NFe';
    }
    if (word.match(/^(?:nf-e)$/i)) {
      return 'NF-e';
    }

    // Matches special cases
    if (word.match(/^(?:cde)$/i)) {
      return word.toUpperCase();
    }

    // Matches roman numerals
    if (word.match(/^(?=[MDCLXVI])M*(C[MD]|D?C*)(X[CL]|L?X*)(I[XV]|V?I*)$/i)) {
      return word.toUpperCase();
    }

    // Matches patterns like "A.B." or "A.B.C."
    if (word.match(/[A-Z]\.[A-Z]/i) || word.match(/[A-Z]\.[A-Z]\.[A-Z]/i)) {
      return word.toUpperCase();
    }

    // Matches patterns with backticks or apostrophes e.g. D'Angelo
    if (word.includes('`')) {
      return capitalizeSegmented(word, '`');
    }
    if (word.includes("'")) {
      return capitalizeSegmented(word, "'");
    }

    // Matches patterns with slash e.g. A/B
    if (word.includes('/')) {
      return capitalizeSegmented(word, '/');
    }

    // Matches patterns with hyphen e.g. A-B
    if (word.includes('-')) {
      return capitalizeSegmented(word, '-');
    }

    // Matches patterns like "1L" or "500ML" (units)
    if (word.match(/^\d+(?:ML|L|G|KG|MG|CL|DL|MLT|LT)$/i)) {
      return word.toUpperCase();
    }

    return capitalizeSingleWord(word);
  });

  return capitalizedWords.join(' ').replace(/`/g, "'");
}

export const capitalizeText = capitalize;

/**
 * Remove non-alphanumeric characters from a string
 */
export function removeNonAlphanumeric(text: string): string;
export function removeNonAlphanumeric(text: null): null;
export function removeNonAlphanumeric(text: undefined): undefined;
export function removeNonAlphanumeric(text?: string | undefined): string | undefined;
export function removeNonAlphanumeric(text?: string | null): string | null;
export function removeNonAlphanumeric(text?: null | undefined): null | undefined;
export function removeNonAlphanumeric(text?: string | null | undefined): string | undefined | null {
  if (!text) {
    return text;
  }

  return text.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Remove letters from a string
 */
export function removeLetters(text: string): string;
export function removeLetters(text: null): null;
export function removeLetters(text: undefined): undefined;
export function removeLetters(text?: string | null): string | undefined | null;
export function removeLetters(text?: string | null): string | undefined | null {
  if (!text) {
    return text;
  }

  return text.replace(/[a-zA-Z]/g, '');
}

/**
 * Parse RTF string to plain text
 */
export function rtfToPlainText(rtf: string): string;
export function rtfToPlainText(rtf: null): null;
export function rtfToPlainText(rtf: undefined): undefined;
export function rtfToPlainText(rtf?: string | null): string | undefined | null;
export function rtfToPlainText(rtf?: string | null): string | undefined | null {
  if (!rtf) {
    return rtf;
  }

  let text = rtf;

  // Remove blocos RTF com chaves aninhadas (como fonttbl)
  while (text.match(/\{\\fonttbl[^{}]*(\{[^{}]*\}[^{}]*)*\}/g)) {
    text = text.replace(/\{\\fonttbl[^{}]*(\{[^{}]*\}[^{}]*)*\}/g, '');
  }

  // Remove outros blocos de cabeçalho
  text = text.replace(/\{\\colortbl[^}]*\}/g, '');
  text = text.replace(/\{\\stylesheet[^}]*\}/g, '');
  text = text.replace(/\{\\info[^}]*\}/g, '');
  text = text.replace(/\{\\(\*)?\\[a-z]+[^}]*\}/g, '');

  // Decodifica caracteres especiais
  text = text.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Converte \par em quebra de linha ANTES de remover outros comandos
  text = text.replace(/\\par\b/g, '\n');

  // Remove comandos RTF
  text = text.replace(/\\[a-z]{1,32}(-?\d{1,10})?[ ]?/gi, ' ');

  // Remove chaves, barras e ponto e vírgula soltos
  text = text.replace(/[{}\\/]/g, '');
  text = text.replace(/^[;\s]+/gm, '');

  // Limpa quebras e espaços duplicados
  text = text.replace(/[\r\n]{2,}/g, '\n');
  text = text.replace(/ +/g, ' ');
  text = text.replace(/ +([.,!?:;])/g, '$1');

  text = text.trim();

  // Remove possíveis resíduos de nomes de fontes comuns
  text = text.replace(/^(Arial|Times New Roman|Courier New|MS Sans Serif|Calibri)[;\s]*/i, '');

  // Remove espaço + ponto solto no final
  text = text.replace(/\s*\.\s*$/g, '.');

  // Remove pontos duplicados
  text = text.replace(/\.+$/g, '.');

  return text;
}

export class FormatText {
  public normalize = normalize;
  public capitalize = capitalize;
  public removeNonAlphanumeric = removeNonAlphanumeric;
  public removeLetters = removeLetters;
  public rtfToPlainText = rtfToPlainText;
}

export const formatText = new FormatText();
