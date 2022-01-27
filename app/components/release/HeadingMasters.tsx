import Image from "~/components/common/Image";
import Artists from "~/components/release/Artists";
import GenresAndStyles from "~/components/release/GenresAndStyles";
import type { MasterRelease } from "~/util/discogs";
import {
  formatReleaseArtistsAndTitle,
  primaryOrFirstImage,
} from "~/util/release";

type HeadingMastersProps = Pick<
  MasterRelease,
  "artists" | "genres" | "images" | "styles" | "title" | "year"
>;

export default function HeadingMasters({
  artists,
  genres,
  images,
  styles,
  title,
  year,
}: HeadingMastersProps) {
  return (
    <div className="flex">
      <Image
        alt={formatReleaseArtistsAndTitle(artists, title)}
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
            </div>
          </div>
        </div>
        <GenresAndStyles genres={genres} styles={styles} />
      </div>
    </div>
  );
}
