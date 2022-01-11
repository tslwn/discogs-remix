import Link from "~/components/Link";
import type { Release } from "~/types/discojs";

interface ArtistsLinksProps {
  artists: Release["artists"];
}

export default function ArtistLinks({ artists }: ArtistsLinksProps) {
  return (
    <>
      {artists.map((artist) => {
        const name = artist.anv !== "" ? artist.anv : artist.name;
        return (
          <div className="inline" key={artist.id}>
            {/* various artists */}
            {artist.id !== 194 ? (
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
    </>
  );
}
