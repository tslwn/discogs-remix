import Link from '~/components/Link';
import type { Release } from '~/types/discojs';

interface LabelLinksProps {
  labels: Release['labels'];
}

export default function LabelLinks({ labels }: LabelLinksProps) {
  return (
    <>
      {labels.map((label) => (
        <div className="inline" key={label.id}>
          <Link to={`/api/labels/${label.id}`}>{label.name}</Link>
          <span>{` — ${label.catno}`}</span>
        </div>
      ))}
    </>
  );
}
