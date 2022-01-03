import ArtistLinks from '~/components/ArtistLinks';
import Chips from '~/components/Chips';
import { concatenateArtists } from '~/lib/release';
import type { Release } from '~/types/discojs';

interface ReleaseHeadingProps {
  artists: Release['artists'];
  title: string;
  src?: string;
  year: string | number;
  genres?: string[];
  styles?: string[];
}

export default function ReleaseHeading({
  artists,
  title,
  src,
  year,
  genres,
  styles,
}: ReleaseHeadingProps) {
  return (
    <div className="flex mb-4">
      {src !== undefined ? (
        <img
          alt={`${concatenateArtists(artists)} - ${title}`}
          className="h-56 w-56 mr-4"
          src={src}
        ></img>
      ) : null}
      <div>
        <div>
          <h2 className="text-xl">
            <ArtistLinks artists={artists} />
            {' - '}
            {title}
          </h2>
        </div>
        <div className="flex">
          <div className="flex flex-wrap items-center">
            <div className="mb-1 mr-3 text-lg">{year}</div>
            <Chips chips={genres ?? []} className="bg-gray-300" />
            <Chips chips={styles ?? []} className="bg-gray-200" />
          </div>
          {/* <div className="w-1/2"></div> */}
        </div>
      </div>
    </div>
  );
}
