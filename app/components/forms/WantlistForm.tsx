import { HeartIcon } from "@heroicons/react/outline";
import { useFetcher } from "remix";
import IconButton from "~/components/common/IconButton";

interface WantlistFormProps {
  className?: string;
  id: number;
}

export default function WantlistForm({ className, id }: WantlistFormProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/api/wantlist" className={className} method="post">
      <input hidden id="id" name="id" readOnly value={id} />
      <IconButton
        aria-label="Add to wantlist"
        disabled={fetcher.state === "submitting"}
        title="Add to wantlist"
      >
        <HeartIcon className="h-5 w-5" />
      </IconButton>
    </fetcher.Form>
  );
}
