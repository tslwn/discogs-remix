import { Release } from '~/types/discojs';

export function formatReleaseArtists(artists: Release['artists']) {
  return artists.reduce(
    (artists, artist) =>
      [artists, artist.anv !== '' ? artist.anv : artist.name, artist.join]
        .join(' ')
        .replace(' , ', ', '),
    ''
  );
}

export function formatReleaseFormats(
  formats: { name: string; qty: string; descriptions: string[] }[]
) {
  const formatStrings = [];
  for (const format of formats) {
    let string = '';
    if (parseInt(format.qty, 10) > 1) {
      string += format.qty + ' x ';
    }
    string += format.name;
    if (format.descriptions !== undefined) {
      string += ', ' + format.descriptions.join(', ');
    }
    formatStrings.push(string);
  }
  return formatStrings.join('; ');
}

export function formatReleaseLabels(labels: { name: string; catno: string }[]) {
  const labelStrings = [];
  for (const label of labels) {
    labelStrings.push(label.name + ' — ' + label.catno);
  }
  return labelStrings.join(', ');
}

export function primaryOrFirstImage(images: Release['images']) {
  return (
    images?.filter((image) => image.type === 'primary')[0] ??
    (images && images[0])
  );
}
