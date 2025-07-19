export function getPagination(page: number, limit: number) {
  const start = page * limit - limit + 1
  const end = page * limit

  return {
    start,
    end,
  }
}
