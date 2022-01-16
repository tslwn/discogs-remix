import Link from "~/components/common/Link";
import type { Pagination } from "~/types/pagination";

interface PageControlsProps {
  items: number;
  pagination: Pagination;
  url: string;
}

export default function PageControls({
  items,
  pagination,
  url,
}: PageControlsProps) {
  const { page, perPage } = defaultPagination(pagination);

  const isPrevious = page > 1;

  const previousUrl = getPreviousUrl(url, pagination);

  const isNext = page * perPage < items;

  const nextUrl = getNextUrl(url, pagination);

  return (
    <div className="font-semibold space-x-4">
      <span>
        {((page - 1) * perPage + 1).toLocaleString()} –{" "}
        {Math.min(items, page * perPage).toLocaleString()} of{" "}
        {items.toLocaleString()}
      </span>
      {isPrevious ? (
        <Link to={previousUrl} visited>
          Previous
        </Link>
      ) : null}
      {isNext ? (
        <Link to={nextUrl} visited>
          Next
        </Link>
      ) : null}
    </div>
  );
}

function defaultPagination({
  page,
  perPage,
}: Pagination): Required<Pagination> {
  return {
    page: page !== undefined ? page : 1,
    perPage: perPage !== undefined ? perPage : 50,
  };
}

function getPreviousUrl(url: string, { page, perPage }: Pagination): string {
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

function getNextUrl(url: string, { page, perPage }: Pagination): string {
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
