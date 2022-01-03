import ArtistLinks from '~/components/ArtistLinks';
import Chips from '~/components/Chips';
import { formatReleaseArtists } from '~/lib/release';
import type { Release } from '~/types/discojs';

interface ReleaseHeadingProps {
  artists: Release['artists'];
  title: string;
  src?: string;
  year: string | number;
  // TODO: separate master/release (again)?
  country?: string;
  formats?: string;
  labels?: string;
  genres?: string[];
  styles?: string[];
}

export default function ReleaseHeading({
  artists,
  title,
  src,
  year,
  country,
  formats,
  labels,
  genres,
  styles,
}: ReleaseHeadingProps) {
  return (
    <div className="flex mb-4">
      {src !== undefined ? (
        <img
          alt={`${formatReleaseArtists(artists)} - ${title}`}
          className="h-56 w-56 mr-4"
          src={src}
        ></img>
      ) : null}
      <div>
        <div className="mb-2">
          <h2 className="text-xl">
            <ArtistLinks artists={artists} />
            {' - '}
            {title}
          </h2>
        </div>
        <div className="mb-2">
          <div className="flex items-baseline">
            <div className="text-lg">{year}</div>
            {country !== undefined ? (
              <>
                <div className="mx-2 text-lg">·</div>
                <div className="text-lg">{country}</div>
              </>
            ) : null}
            {formats !== undefined ? (
              <div className="ml-2 text-gray-600 text-sm">{formats}</div>
            ) : null}
          </div>
          {labels !== undefined ? (
            <div className="text-sm">{labels}</div>
          ) : null}
        </div>
        <div className="flex">
          <div className="flex flex-wrap items-center">
            <Chips chips={genres ?? []} className="bg-gray-300" />
            <Chips chips={styles ?? []} className="bg-gray-200" />
          </div>
          {/* <div className="w-1/2"></div> */}
        </div>
      </div>
    </div>
  );
}
