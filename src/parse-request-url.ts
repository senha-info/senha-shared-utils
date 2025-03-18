export function parseRequestURL(page: number, maxPage: number, url: string) {
  if (page > maxPage) {
    return {
      previousURL: url.replace(`page=${page}`, `page=${maxPage}`),
      nextURL: null,
    };
  }

  const separator = url.includes("?") ? "&" : "?";
  const hasPage = url.includes("page");
  const previousURL =
    page > 1
      ? hasPage
        ? url.replace(`page=${page}`, `page=${page - 1}`)
        : `${url}${separator}page=${page - 1}`
      : null;

  const nextURL =
    page < maxPage
      ? hasPage
        ? url.replace(`page=${page}`, `page=${page + 1}`)
        : `${url}${separator}page=${page + 1}`
      : null;

  return {
    previousURL,
    nextURL,
  };
}
