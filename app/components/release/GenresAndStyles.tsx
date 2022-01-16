import Chips from "~/components/common/Chips";

interface GenresAndStylesProps {
  genres?: string[];
  styles?: string[];
}

export default function GenresAndStyles({
  genres,
  styles,
}: GenresAndStylesProps) {
  return (
    <div className="flex flex-wrap items-center">
      {genres !== undefined ? (
        <Chips chips={genres} className="bg-neutral-300" />
      ) : null}
      {styles !== undefined ? (
        <Chips chips={styles} className="bg-neutral-200" />
      ) : null}
    </div>
  );
}
