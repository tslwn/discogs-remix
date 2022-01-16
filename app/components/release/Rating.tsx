import { StarIcon } from "@heroicons/react/solid";
import clsx from "clsx";

const AMBER_500 = "#f59e0b";
const NEUTRAL_300 = "#d4d4d4";

interface RatingProps {
  average: number;
  count: number;
}

export default function Rating({ average, count }: RatingProps) {
  const percentage = 100 * (average - Math.floor(average));
  const text = `Average rating ${average.toLocaleString()} out of 5`;
  return (
    <div className="px-4 py-2">
      <div
        aria-label={text}
        className="flex h-8 items-center -ml-1"
        title={text}
      >
        <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
          <linearGradient id="rating-gradient" x2="1" y2="0">
            <stop offset="0%" stopColor={AMBER_500} />
            <stop offset={`${percentage}%`} stopColor={AMBER_500} />
            <stop offset={`${percentage + 1}%`} stopColor={NEUTRAL_300} />
            <stop offset="100%" stopColor={NEUTRAL_300} />
          </linearGradient>
        </svg>
        <StarIcon className={starIconClassName(average, 0)} />
        <StarIcon className={starIconClassName(average, 1)} />
        <StarIcon className={starIconClassName(average, 2)} />
        <StarIcon className={starIconClassName(average, 3)} />
        <StarIcon className={starIconClassName(average, 4)} />
      </div>
      <span className="block text-neutral-500">
        {count !== 0 ? count.toLocaleString() : "No"} ratings
      </span>
    </div>
  );
}

function starIconClassName(value: number, index: number): string {
  return clsx(
    "h-5 w-5",
    value < index && "fill-neutral-300",
    value >= index && value < index + 1 && "fill-[url(#rating-gradient)]",
    value >= index + 1 && "fill-amber-500"
  );
}
