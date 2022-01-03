import { Link } from 'remix';
import type { Release } from '~/types/discojs';

interface ArtistsLinksProps {
  artists: Release['artists'];
}

export default function ArtistLinks({ artists }: ArtistsLinksProps) {
  return (
    <>
      {artists.map((artist) => (
        <div className="inline" key={artist.id}>
          <Link className="hover:underline" to={`/api/artists/${artist.id}`}>
            {artist.anv !== '' ? artist.anv : artist.name}
          </Link>
          <span>
            {artist.join !== ',' ? ' ' : ''}
            {artist.join}{' '}
          </span>
        </div>
      ))}
    </>
  );
}
