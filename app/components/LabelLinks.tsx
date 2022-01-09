import Link from '~/components/Link';
import type { Release } from '~/types/discojs';

interface LabelLinksProps {
  labels: Release['labels'];
}

export default function LabelLinks({ labels }: LabelLinksProps) {
  return (
    <>
      {labels.map((label, index) => (
        <div className="inline" key={label.id}>
          {index > 0 ? <span>, </span> : null}
          <Link to={`/api/labels/${label.id}`} visited>
            {label.name}
          </Link>
          <span>{` — ${label.catno}`}</span>
        </div>
      ))}
    </>
  );
}
