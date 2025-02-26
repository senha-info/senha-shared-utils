type CapitalizeModeType = "words" | "first-letter";

export class FormatText {
  public normalize(text?: string): string {
    if (!text) {
      return "";
    }

    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

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
      if (word.match(/^(?:pj|ga7|lg|mt|gp|gbl|wl|hkd|nm|amd|crm|gg|rca)$/i)) {
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

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return capitalizedWords.join(" ").replace("`", "'");
  }

  public removeSpecialCharacters(text?: string): string {
    if (!text) {
      return "";
    }

    return text.replace(/[^a-zA-Z0-9]/g, "");
  }
}
