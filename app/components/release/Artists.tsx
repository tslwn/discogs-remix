import Link from "~/components/common/Link";
import type { Release } from "~/types/discojs";

const VARIOUS_ARTISTS_ID = 194;

interface ArtistsProps {
  artists: Release["artists"];
}

export default function Artists({ artists }: ArtistsProps) {
  return (
    <h3>
      {artists.map((artist) => {
        const name = artist.anv !== "" ? artist.anv : artist.name;
        return (
          <div className="inline" key={artist.id}>
            {artist.id !== VARIOUS_ARTISTS_ID ? (
              <Link to={`/api/artists/${artist.id}`} visited>
                {name}
              </Link>
            ) : (
              <span>{name}</span>
            )}
            <span>
              {artist.join !== "," ? " " : ""}
              {artist.join}{" "}
            </span>
          </div>
        );
      })}
    </h3>
  );
}
