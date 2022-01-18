import { useLoaderData } from "remix";
import QueueListItem from "~/components/QueueListItem";
import Page from "~/components/common/Page";
import QuadImage from "~/components/common/QuadImage";
import { useQueue } from "~/contexts/QueueContext";
import type { ListItems } from "~/loaders/lists.server";
import { formatDate } from "~/util/date";

export { listItems as loader } from "~/loaders/lists.server";

export default function Route() {
  const { list, items, username } = useLoaderData<ListItems>();

  const { enqueue } = useQueue();

  // TODO: what if item has no videos?
  const handleClick = () => {
    for (const item of items) {
      enqueue(item);
    }
  };

  return (
    <Page>
      <div className="flex mb-4">
        <QuadImage className="mr-4" items={items} />
        <div className="flex flex-col">
          <h2 className="font-semibold text-3xl">{list.name}</h2>
          <div className="mb-2 text-lg">
            <h3>{username}</h3>
            <div className="text-neutral-500">{`Updated ${formatDate(
              list.dateChanged
            )}`}</div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <QueueButton count={items.length} onClick={handleClick} />
      </div>
      <ul>
        {items.map((item, index) => {
          return (
            <li className="mb-2" key={item.id}>
              <QueueListItem
                item={item}
                left={
                  <div className="text-center text-md w-10">{index + 1}</div>
                }
              />
            </li>
          );
        })}
      </ul>
    </Page>
  );
}

interface QueueButtonProps {
  count: number;
  onClick: () => void;
}

function QueueButton({ count, onClick }: QueueButtonProps) {
  return (
    <button
      className="flex flex-col focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 hover:bg-neutral-100 px-4 py-2 rounded"
      onClick={onClick}
      type="button"
    >
      <span className="font-semibold text-2xl">Add to queue</span>

      <span className="text-neutral-500">
        {count > 0 ? count.toLocaleString() : "No"} release
        {count !== 1 ? "s" : ""}
      </span>
    </button>
  );
}
