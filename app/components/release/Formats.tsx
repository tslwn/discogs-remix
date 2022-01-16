interface Format {
  name: string;
  qty: string;
  descriptions?: string[];
}

interface FormatsProps {
  className?: string;
  formats: Format[];
}

export default function Formats({ className, formats }: FormatsProps) {
  return <div className={className}>{getDisplayFormats(formats)}</div>;
}

function getDisplayFormats(formats: Format[]): string {
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
