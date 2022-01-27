import clsx from "clsx";

interface StatProps {
  // The colour of the left border
  className: string;
  text: string;
  value: number;
}

export default function Stat({ className, text, value }: StatProps) {
  return (
    <div className={clsx("border-l-4 px-4 py-2", className)}>
      <span className="block font-semibold text-2xl">
        {value.toLocaleString()}
      </span>
      <span className="block text-neutral-500">{text}</span>
    </div>
  );
}
