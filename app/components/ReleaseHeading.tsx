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
    <div className="flex">
      {src !== undefined ? (
        <img
          alt={`${formatReleaseArtists(artists)} - ${title}`}
          className="h-56 w-56 mr-4"
          src={src}
        ></img>
      ) : null}
      <div className="">
        <div className="mb-4">
          <h2 className="font-semibold text-3xl">{title}</h2>
          <div className="flex items-baseline mb-2 text-lg">
            <h3>
              <ArtistLinks artists={artists} />
            </h3>
            <span className="mx-2 ">·</span>
            <span className="">{year}</span>
            {country !== undefined ? (
              <>
                <span className="mx-2 ">·</span>
                <span className="text-gray-500">{country}</span>
              </>
            ) : null}
          </div>
        </div>
        <div>
          {labels !== undefined ? (
            <span className="block">{labels}</span>
          ) : null}
          {formats !== undefined ? (
            <span className="block mb-2 text-gray-500">{formats}</span>
          ) : null}
          <div className="flex">
            <div className="flex flex-wrap items-center">
              <Chips chips={genres} className="bg-gray-300" />
              <Chips chips={styles} className="bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
