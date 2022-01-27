import type { ReleaseFormat } from "~/util/discogs";

interface FormatsProps {
  className?: string;
  formats: ReleaseFormat[];
}

export default function Formats({ className, formats }: FormatsProps) {
  return <div className={className}>{getDisplayFormats(formats)}</div>;
}

function getDisplayFormats(formats: ReleaseFormat[]): string {
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
