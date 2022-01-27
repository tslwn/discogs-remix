import Image from "~/components/common/Image";
import Artists from "~/components/release/Artists";
import Formats from "~/components/release/Formats";
import GenresAndStyles from "~/components/release/GenresAndStyles";
import Labels from "~/components/release/Labels";
import type { Release } from "~/util/discogs";
import { formatReleaseArtists, primaryOrFirstImage } from "~/util/release";

type HeadingReleasesProps = Pick<
  Release,
  | "artists"
  | "country"
  | "formats"
  | "genres"
  | "labels"
  | "images"
  | "styles"
  | "title"
  | "year"
>;

export default function HeadingReleases({
  artists,
  country,
  formats,
  genres,
  labels,
  images,
  styles,
  title,
  year,
}: HeadingReleasesProps) {
  return (
    <div className="flex">
      <Image
        alt={`${formatReleaseArtists(artists)} - ${title}`}
        className="mr-4"
        size={56}
        src={primaryOrFirstImage(images)?.uri}
      />
      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="font-semibold text-3xl">{title}</h2>
          <div className="mb-2 text-lg">
            <Artists artists={artists} />
            <div>
              <span className="">{year !== 0 ? year : "Unknown"}</span>
              <span className="mx-2 ">·</span>
              <span className="text-neutral-500">{country}</span>
            </div>
          </div>
        </div>
        <div>
          <Labels labels={labels} />
          <Formats className="mb-2 text-neutral-500" formats={formats} />
          <GenresAndStyles genres={genres} styles={styles} />
        </div>
      </div>
    </div>
  );
}
