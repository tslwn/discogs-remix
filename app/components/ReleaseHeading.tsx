import { MusicNoteIcon } from '@heroicons/react/solid';
import ArtistLinks from '~/components/ArtistLinks';
import Chips from '~/components/Chips';
import { formatReleaseArtists } from '~/lib/release';
import type { Release } from '~/types/discojs';
import ExternalLink from './ExternalLink';
import LabelLinks from './LabelLinks';

interface ReleaseHeadingProps {
  id: number;
  artists: Release['artists'];
  title: string;
  src?: string;
  year: string | number;
  // TODO: separate master/release (again)?
  country?: string;
  formats?: string;
  labels?: Release['labels'];
  genres?: string[];
  styles?: string[];
  numForSale: number;
  lowestPrice: number | null;
  currencyAbbreviation: string;
  master: boolean;
}

export default function ReleaseHeading({
  id,
  artists,
  title,
  src,
  year,
  country,
  formats,
  labels,
  genres,
  styles,
  numForSale,
  lowestPrice,
  currencyAbbreviation,
  master,
}: ReleaseHeadingProps) {
  return (
    <div className="flex">
      <div className="mr-4 overflow-hidden rounded">
        {src !== undefined ? (
          <img
            alt={`${formatReleaseArtists(artists)} - ${title}`}
            className="h-56 w-56"
            src={src}
          ></img>
        ) : (
          <div className="bg-neutral-200 flex h-56 items-center justify-center w-56">
            <MusicNoteIcon className="text-neutral-500 h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <h2 className="font-semibold text-3xl">{title}</h2>
            <div className="mb-2 text-lg">
              <h3>
                <ArtistLinks artists={artists} />
              </h3>
              <div className="flex items-baseline">
                <span className="">{year !== 0 ? year : 'Unknown'}</span>
                {country !== undefined ? (
                  <>
                    <span className="mx-2 ">·</span>
                    <span className="text-neutral-500">{country}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div>
            {labels !== undefined ? <LabelLinks labels={labels} /> : null}
            {formats !== undefined ? (
              <span className="block mb-2 text-neutral-500">{formats}</span>
            ) : null}
            <div className="flex">
              <div className="flex flex-wrap items-center">
                <Chips chips={genres} className="bg-neutral-300" />
                <Chips chips={styles} className="bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>
        <div>
          {numForSale > 0 ? (
            <>
              <ExternalLink
                className="font-semibold"
                href={
                  master
                    ? `https://www.discogs.com/sell/list?master_id=${id}`
                    : `https://www.discogs.com/sell/release/${id}`
                }
                visited
              >
                {numForSale} for sale
              </ExternalLink>
              <span> from </span>
              <span className="font-semibold text-orange-700">
                {lowestPrice} {currencyAbbreviation}
              </span>
            </>
          ) : (
            <span className="font-semibold">None for sale</span>
          )}
        </div>
      </div>
    </div>
  );
}
