import { remove as removeConfusables } from "confusables";

type CapitalizeModeType = "words" | "first-letter";

type NormalizeOptions = {
  /**
   * Removes diacritics from the text.
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
   */
  maxLength?: number;
};

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
  ): string {
    if (!text) {
      return "";
    }

    text = text.normalize("NFD").replace(/[\u00A0\u202F\u200B-\u200F\u2028\u2029\u2066-\u2069]/g, ""); // Invisibles

    if (removeDiacritics) {
      text = text.replace(/[\u0300-\u036f]/g, ""); // Diacritics
    }

    if (removeEmojis) {
      text = text.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, ""); // Emojis
    }

    if (trim) {
      text = text.trim(); // Trim
    }

    if (maxLength !== undefined && text.length > maxLength) {
      text = text.substring(0, maxLength);
    }

    return removeConfusables(text);
  }

  /**
   * Capitalize a string
   *
   * @param {string} [text] - The string to be capitalized
   * @param {CapitalizeModeType} [mode] - The mode to capitalize the string
   * @returns {string} The capitalized string
   */
  public capitalize(text?: string, mode: CapitalizeModeType = "words"): string {
    if (!text) {
      return "";
    }

    if (mode === "first-letter") {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    const words = text.split(" ");

    const capitalizedWords = words.map((word, index) => {
      // Should capitalize when first word
      if (word.match(/^(?:de|da|das|do|dos|del|by|à|e|o|ou|y)$/i)) {
        if (index === 0) {
          return word.toUpperCase();
        }

        return word.toLowerCase();
      }

      // Shouldn't capitalize when first word
      if (word.match(/^(?:em|por|para)$/i)) {
        if (!(index === 0)) {
          return word.toLowerCase();
        }
      }

      // Exclusive for Senha Informática
      if (word.match(/^(?:pj|ga7|lg|mt|gp|gbl|wl|hkd|nm|amd|crm|gg|rca|tti|mg|sc|gl)$/i)) {
        return word.toUpperCase();
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
        const [first, second] = word.split("`");
        return (
          first.charAt(0).toUpperCase() +
          first.slice(1).toLowerCase() +
          "`" +
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
        const [first, second] = word.split("/");
        return (
          first.charAt(0).toUpperCase() +
          first.slice(1).toLowerCase() +
          "/" +
          second.charAt(0).toUpperCase() +
          second.slice(1).toLowerCase()
        );
      }

      // Matches patterns like "A-B"
      if (word.match(/[A-Z]-[A-Z]/)) {
        const [first, second] = word.split("-");
        return (
          first.charAt(0).toUpperCase() +
          first.slice(1).toLowerCase() +
          "-" +
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

    return capitalizedWords.join(" ").replace("`", "'");
  }

  /**
   * Remove non-alphanumeric characters from a string
   *
   * @param {string} [text] - The string to remove non-alphanumeric characters
   * @returns {string} The string without non-alphanumeric characters
   */
  public removeNonAlphanumeric(text?: string): string {
    if (!text) {
      return "";
    }

    return text.replace(/[^a-zA-Z0-9]/g, "");
  }

  /**
   * Remove letters from a string
   *
   * @param {string} [text] - The string to remove letters
   * @returns {string} The string without letters
   */
  public removeLetters(text?: string): string {
    if (!text) {
      return "";
    }

    return text.replace(/[a-zA-Z]/g, "");
  }

  /**
   * Parse RTF string to plain text
   *
   * @param {string} [rtf] - The RTF to parse
   * @returns {string} The string in plain text
   */
  public rtfToPlainText(rtf?: string): string {
    if (!rtf) {
      return "";
    }

    let text = rtf;

    // Remove blocos RTF com chaves aninhadas (como fonttbl)
    while (text.match(/\{\\fonttbl[^{}]*(\{[^{}]*\}[^{}]*)*\}/g)) {
      text = text.replace(/\{\\fonttbl[^{}]*(\{[^{}]*\}[^{}]*)*\}/g, "");
    }

    // Remove outros blocos de cabeçalho
    text = text.replace(/\{\\colortbl[^}]*\}/g, "");
    text = text.replace(/\{\\stylesheet[^}]*\}/g, "");
    text = text.replace(/\{\\info[^}]*\}/g, "");
    text = text.replace(/\{\\(\*)?\\[a-z]+[^}]*\}/g, "");

    // Decodifica caracteres especiais
    text = text.replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    // Converte \par em quebra de linha ANTES de remover outros comandos
    text = text.replace(/\\par\b/g, "\n");

    // Remove comandos RTF
    text = text.replace(/\\[a-z]{1,32}(-?\d{1,10})?[ ]?/gi, " ");

    // Remove chaves, barras e ponto e vírgula soltos
    text = text.replace(/[\{\}\\]/g, "");
    text = text.replace(/^[;\s]+/gm, ""); // Remove ; no início de linhas

    // Limpa quebras e espaços DUPLICADOS (mas mantém quebras únicas)
    text = text.replace(/[\r\n]{2,}/g, "\n"); // Múltiplas quebras viram uma
    text = text.replace(/ +/g, " "); // Múltiplos espaços viram um

    text = text.trim();

    // Remove possíveis resíduos de nomes de fontes comuns
    text = text.replace(/^(Arial|Times New Roman|Courier New|MS Sans Serif|Calibri)[;\s]*/i, "");

    // Remove espaço + ponto solto no final
    text = text.replace(/\s*\.\s*$/g, ".");

    // Remove pontos duplicados e pontos soltos no final
    text = text.replace(/\.+$/g, ".");

    return text;
  }
}
