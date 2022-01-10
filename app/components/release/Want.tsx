interface WantProps {
  want: number;
}

export default function Want({ want }: WantProps) {
  return (
    <div className="border-l-4 border-red-600 px-4 py-2">
      <span className="block font-semibold text-2xl">
        {want.toLocaleString()}
      </span>
      <span className="block text-neutral-500">want</span>
    </div>
  );
}
