import { Release } from '~/types/discojs';

export function concatenateArtists(artists: Release['artists']) {
  return artists.reduce(
    (artists, artist) =>
      [artists, artist.anv !== '' ? artist.anv : artist.name, artist.join]
        .join(' ')
        .replace(' , ', ', '),
    ''
  );
}

export function primaryOrFirstImage(images: Release['images']) {
  return (
    images?.filter((image) => image.type === 'primary')[0] ??
    (images && images[0])
  );
}
