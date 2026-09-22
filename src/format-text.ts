import { remove as removeConfusables } from 'confusables';

type CapitalizeModeType = 'words' | 'first-letter';

type NormalizeOptions = {
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
   * characters (e.g. rare CJK ideographs) aren't cut in half.
   */
  maxLength?: number;
};

/**
 * Checks if a single character is a "base Latin letter + diacritic",
 * e.g. "é", "ã", "ç", "ü" — as opposed to a character from another
 * script that merely *looks* like a Latin letter (the actual case
 * `confusables` is meant to catch, e.g. Cyrillic "а" vs Latin "a").
 *
 * Works by decomposing (NFD): a legitimate accented Latin letter
 * decomposes into more than one code point, where the first is a
 * plain ASCII letter. This works for any language (pt, fr, de, etc.)
 * without needing a hardcoded list of Unicode ranges.
 */
function isDiacriticLatinChar(char: string): boolean {
  const decomposed = char.normalize('NFD');
  return decomposed.length > 1 && /^[A-Za-z]/.test(decomposed);
}

/**
 * Matches a full emoji *sequence* as a single unit, not just one code
 * point — this matters because most emojis are made of several code
 * points glued together, e.g.:
 *  - keycaps: digit + optional variation selector + U+20E3 ("1️⃣")
 *  - ZWJ sequences: pictograph + U+200D + pictograph (...) ("👨‍👩‍👧‍👦")
 *  - flags: two regional-indicator letters ("🇧🇷")
 * If we protected code point by code point, `confusables` would still
 * see the leftover joiners/selectors around the (now placeholder)
 * base characters and normalize the sequence anyway.
 */
const EMOJI_SEQUENCE_RE =
  /(\p{Extended_Pictographic}\uFE0F?(\u200D\p{Extended_Pictographic}\uFE0F?)*|[0-9#*]\uFE0F?\u20E3|\p{Regional_Indicator}{2})/gu;

/**
 * Temporarily swaps out characters/sequences we want `confusables` to
 * leave alone for placeholder tokens (Private Use Area code points,
 * which never occur in real text and aren't in confusables.txt), runs
 * `confusables`' anti-spoofing pass on what's left, then restores the
 * originals. Real homoglyphs (Cyrillic lookalikes, etc.) still get
 * normalized either way — only the explicitly protected content survives.
 */
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
    // Sequences first, and as whole units, so a later char-by-char
    // pass (diacritics) can't split one apart.
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

export class FormatText {
  /**
   * Normalize a string by replacing special characters with their standard equivalents
   *
   * @param {string} [text] - The string to be normalized
   * @param {NormalizeOptions} [options] - Normalize text options
   *
   * @returns {string} The normalized string
   */
  public normalize(
    text?: string,
    { removeDiacritics = true, removeEmojis = true, trim = true, maxLength }: NormalizeOptions = {},
  ): string | undefined | null {
    if (!text) {
      return text;
    }

    // Invisible/control characters: always stripped, regardless of options.
    // These never have a legitimate reason to reach a database field.
    text = text.replace(/[\u00A0\u202F\u200B-\u200F\u2028\u2029\u2066-\u2069]/g, '');

    if (removeDiacritics) {
      // NFD decomposes accented letters into base letter + combining mark,
      // e.g. "é" -> "e" + U+0301. We only do this decomposition when we're
      // actually going to strip the marks — no reason to alter the string's
      // internal representation otherwise.
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Diacritics
    } else {
      // Always keep the string in composed form (NFC) when diacritics are
      // preserved. Without this, two visually-identical strings coming from
      // different sources (e.g. one NFC from a DB, one NFD from a browser)
      // would fail a `===` comparison and have different `.length`.
      text = text.normalize('NFC');
    }

    if (removeEmojis) {
      // NOTE: intentionally NOT using \p{Emoji} here. That property also
      // matches plain digits 0-9, '#', and '*', because they're part of
      // "keycap" emoji sequences (1️⃣, #️⃣). Using \p{Emoji} alone strips
      // digits from unrelated text. \p{Extended_Pictographic} covers the
      // vast majority of real emojis (faces, objects, symbols, flags)
      // without touching digits.
      text = text.replace(/\p{Extended_Pictographic}/gu, ''); // Emojis
    }

    if (trim) {
      text = text.trim(); // Trim
    }

    if (maxLength !== undefined) {
      // Use Array.from (or [...text]) instead of .substring/.slice so we
      // count Unicode code points, not UTF-16 code units. .substring() can
      // split a surrogate pair in half (e.g. certain emoji or rare CJK
      // characters), producing an invalid/corrupted trailing character.
      const chars = Array.from(text);

      if (chars.length > maxLength) {
        text = chars.slice(0, maxLength).join('');
      }
    }

    // `confusables` normalizes homoglyphs/lookalike characters for
    // anti-spoofing purposes (e.g. Cyrillic "а" -> Latin "a"). Its
    // confusables.txt dataset also treats accented Latin letters (é, ã,
    // ç...) AND emoji sequences like keycaps (1️⃣) as "confusable" with
    // their plain-character equivalent, so calling it unconditionally
    // strips them even when removeDiacritics/removeEmojis are false.
    // Shield whatever the caller asked to preserve before running it.
    const protectDiacritics = !removeDiacritics;
    const protectEmojis = !removeEmojis;

    return protectDiacritics || protectEmojis
      ? withProtectedConfusables(text, { protectDiacritics, protectEmojis }, removeConfusables)
      : removeConfusables(text);
  }

  /**
   * Capitalize a string
   *
   * @param {string} [text] - The string to be capitalized
   * @param {CapitalizeModeType} [mode] - The mode to capitalize the string
   * @returns {string} The capitalized string
   */
  public capitalize(text?: string | null, mode: CapitalizeModeType = 'words'): string | undefined | null {
    if (!text) {
      return text;
    }

    if (mode === 'first-letter') {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    const words = text.split(' ');

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
      if (word.match(/[A-Z]\.[A-Z]/) || word.match(/[A-Z]\.[A-Z]\.[A-Z]/)) {
        return word.toUpperCase();
      }

      // Matches patterns like "`A"
      if (word.match(/`[A-Z]/)) {
        const [first, second] = word.split('`');
        return (
          first.charAt(0).toUpperCase() +
          first.slice(1).toLowerCase() +
          '`' +
          second.charAt(0).toUpperCase() +
          second.slice(1).toLowerCase()
        );
      }

      // Matches patterns like "'A"
      if (word.match(/'[A-Z]/)) {
        const [first, second] = word.split("'");
        return (
          first.charAt(0).toUpperCase() +
          first.slice(1).toLowerCase() +
          "'" +
          second.charAt(0).toUpperCase() +
          second.slice(1).toLowerCase()
        );
      }

      // Matches patterns like "/A" (word after slash, e.g. "A/B")
      if (word.match(/\/[A-Z]/)) {
        const [first, second] = word.split('/');
        return (
          first.charAt(0).toUpperCase() +
          first.slice(1).toLowerCase() +
          '/' +
          second.charAt(0).toUpperCase() +
          second.slice(1).toLowerCase()
        );
      }

      // Matches patterns like "A-B"
      if (word.match(/[A-Z]-[A-Z]/)) {
        const [first, second] = word.split('-');
        return (
          first.charAt(0).toUpperCase() +
          first.slice(1).toLowerCase() +
          '-' +
          second.charAt(0).toUpperCase() +
          second.slice(1).toLowerCase()
        );
      }

      // Matches patterns like "1L" or "500ML" (units)
      if (word.match(/^\d+(?:ML|L|G|KG|MG|CL|DL|MLT|LT)$/i)) {
        return word.toUpperCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return capitalizedWords.join(' ').replace('`', "'");
  }

  /**
   * Remove non-alphanumeric characters from a string
   *
   * @param {string} [text] - The string to remove non-alphanumeric characters
   * @returns {string} The string without non-alphanumeric characters
   */
  public removeNonAlphanumeric(text?: string | null): string | undefined | null {
    if (!text) {
      return text;
    }

    return text.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Remove letters from a string
   *
   * @param {string} [text] - The string to remove letters
   * @returns {string} The string without letters
   */
  public removeLetters(text?: string | null): string | undefined | null {
    if (!text) {
      return text;
    }

    return text.replace(/[a-zA-Z]/g, '');
  }

  /**
   * Parse RTF string to plain text
   *
   * @param {string} [rtf] - The RTF to parse
   * @returns {string} The string in plain text
   */
  public rtfToPlainText(rtf?: string | null): string | undefined | null {
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
    text = text.replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    // Converte \par em quebra de linha ANTES de remover outros comandos
    text = text.replace(/\\par\b/g, '\n');

    // Remove comandos RTF
    text = text.replace(/\\[a-z]{1,32}(-?\d{1,10})?[ ]?/gi, ' ');

    // Remove chaves, barras e ponto e vírgula soltos
    text = text.replace(/[\{\}\\]/g, '');
    text = text.replace(/^[;\s]+/gm, ''); // Remove ; no início de linhas

    // Limpa quebras e espaços DUPLICADOS (mas mantém quebras únicas)
    text = text.replace(/[\r\n]{2,}/g, '\n'); // Múltiplas quebras viram uma
    text = text.replace(/ +/g, ' '); // Múltiplos espaços viram um

    text = text.trim();

    // Remove possíveis resíduos de nomes de fontes comuns
    text = text.replace(/^(Arial|Times New Roman|Courier New|MS Sans Serif|Calibri)[;\s]*/i, '');

    // Remove espaço + ponto solto no final
    text = text.replace(/\s*\.\s*$/g, '.');

    // Remove pontos duplicados e pontos soltos no final
    text = text.replace(/\.+$/g, '.');

    return text;
  }
}
