import Link from "~/components/common/Link";
import type { Release } from "~/types/discojs";

interface LabelsProps {
  labels: Release["labels"];
}

export default function Labels({ labels }: LabelsProps) {
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
