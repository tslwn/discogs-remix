export interface Pagination {
  page?: number;
  perPage?: number;
}

export function defaultPagination({
  page,
  perPage,
}: Pagination): Required<Pagination> {
  return {
    page: page !== undefined ? page : 1,
    perPage: perPage !== undefined ? perPage : 50,
  };
}

export function getPagination(request: Request): Pagination {
  const url = new URL(request.url);

  const page = url.searchParams.get("page");
  const perPage = url.searchParams.get("per_page");

  return {
    page: page !== null ? Number(page) : undefined,
    perPage: perPage !== null ? Number(perPage) : undefined,
  };
}

export function getPreviousUrl(
  url: string,
  { page, perPage }: Pagination
): string {
  const searchParams = [];

  if (page !== undefined) {
    searchParams.push(`page=${Math.max(page - 1, 1).toString()}`);
  }
  if (perPage !== undefined) {
    searchParams.push(`per_page=${perPage.toString()}`);
  }

  if (searchParams.length > 0) {
    return `${url}?${searchParams.join("&")}`;
  }
  return url;
}

export function getNextUrl(url: string, { page, perPage }: Pagination): string {
  const searchParams = [];

  if (page !== undefined) {
    searchParams.push(`page=${Math.max(page + 1, 1).toString()}`);
  }
  if (perPage !== undefined) {
    searchParams.push(`per_page=${perPage.toString()}`);
  }

  if (searchParams.length > 0) {
    return `${url}?${searchParams.join("&")}`;
  }
  return url;
}
