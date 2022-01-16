import { Pagination } from "~/types/pagination";

export function getPagination(request: Request): Pagination {
  const url = new URL(request.url);

  const page = url.searchParams.get("page");
  const perPage = url.searchParams.get("per_page");

  return {
    page: page !== null ? Number(page) : undefined,
    perPage: perPage !== null ? Number(perPage) : undefined,
  };
}
