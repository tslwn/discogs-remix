import { StarIcon } from '@heroicons/react/solid';
import clsx from 'clsx';

const AMBER_500 = '#f59e0b';
const NEUTRAL_300 = '#d4d4d4';
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
            <stop offset="0%" stop-color={AMBER_500} />
            <stop offset={`${percentage}%`} stop-color={AMBER_500} />
            <stop offset={`${percentage + 1}%`} stop-color={NEUTRAL_300} />
            <stop offset="100%" stop-color={NEUTRAL_300} />
          </linearGradient>
        </svg>
        <StarIcon
          className={clsx(
            'h-5 w-5',
            average < 1 && 'fill-[url(#rating-gradient)]',
            average >= 1 && 'fill-amber-500'
          )}
        />
        <StarIcon
          className={clsx(
            'h-5 w-5',
            average < 1 && 'fill-neutral-300',
            average >= 1 && average < 2 && 'fill-[url(#rating-gradient)]',
            average >= 2 && 'fill-amber-500'
          )}
        />
        <StarIcon
          className={clsx(
            'h-5 w-5',
            average < 2 && 'fill-neutral-300',
            average >= 2 && average < 3 && 'fill-[url(#rating-gradient)]',
            average >= 3 && 'fill-amber-500'
          )}
        />
        <StarIcon
          className={clsx(
            'h-5 w-5',
            average < 3 && 'fill-neutral-300',
            average >= 3 && average < 4 && 'fill-[url(#rating-gradient)]',
            average >= 4 && 'fill-amber-500'
          )}
        />
        <StarIcon
          className={clsx(
            'h-5 w-5',
            average < 4 && 'fill-neutral-300',
            average >= 4 && average < 5 && 'fill-[url(#rating-gradient)]',
            average >= 5 && 'fill-amber-500'
          )}
        />
      </div>
      <span className="block text-neutral-500">
        {count !== 0 ? count.toLocaleString() : 'No'} ratings
      </span>
    </div>
  );
}
