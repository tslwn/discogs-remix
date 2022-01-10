interface HaveProps {
  have: number;
}

export default function Have({ have }: HaveProps) {
  return (
    <div className="border-l-4 border-green-600 px-4 py-2">
      <span className="block font-semibold text-2xl">
        {have.toLocaleString()}
      </span>
      <span className="block text-neutral-500">have</span>
    </div>
  );
}
