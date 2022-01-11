import {
  defaultPagination,
  Pagination,
  getPreviousUrl,
  getNextUrl,
} from "~/util/pagination";
import Link from "./Link";

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
        {(page * perPage).toLocaleString()} of {items.toLocaleString()}
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
