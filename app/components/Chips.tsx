import clsx from 'clsx';

interface ChipsProps {
  chips?: string[];
  className?: string;
}

export default function Chips({ chips, className }: ChipsProps) {
  return chips !== undefined ? (
    <>
      {chips.map((chip) => (
        <div
          className={clsx('mb-1 mr-1 px-2 py-1 rounded-lg text-xs', className)}
          key={chip}
        >
          {chip}
        </div>
      ))}
    </>
  ) : null;
}
