import type { Release } from "~/types/discojs";
import { SearchType } from "./discogs";

export function formatReleaseArtists(artists: Release["artists"]) {
  return artists
    .reduce(
      (artists, artist) =>
        [artists, artist.anv !== "" ? artist.anv : artist.name, artist.join]
          .join(" ")
          .replace(" , ", ", "),
      ""
    )
    .trim();
}

export function formatReleaseFormats(
  formats: { name: string; qty: string; descriptions: string[] }[]
) {
  const formatStrings = [];
  for (const format of formats) {
    let string = "";
    if (parseInt(format.qty, 10) > 1) {
      string += format.qty + " x ";
    }
    string += format.name;
    if (format.descriptions !== undefined) {
      string += ", " + format.descriptions.join(", ");
    }
    formatStrings.push(string);
  }
  return formatStrings.join("; ");
}

export function formatReleaseLabels(labels: { name: string; catno: string }[]) {
  const labelStrings = [];
  for (const label of labels) {
    labelStrings.push(label.name + " — " + label.catno);
  }
  return labelStrings.join(", ");
}

export function primaryOrFirstImage(images: Release["images"]) {
  return (
    images?.filter((image) => image.type === "primary")[0] ??
    (images && images[0])
  );
}

export const byYear = (a: { year: number }, b: { year: number }) => {
  if (a.year === 0) {
    return 1;
  }
  return a.year > b.year ? 1 : -1;
};

export function getResourceUrl(resource: {
  id: number;
  type?: SearchType;
}): string {
  return "/api/" + (resource.type ?? "release") + "s/" + resource.id.toString();
}
