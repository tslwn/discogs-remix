import { useLoaderData } from "remix";
import QueueItemCard from "~/components/QueueItemCard";
import Button from "~/components/common/Button";
import Page from "~/components/common/Page";
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
      <div className="mb-4">
        <h2 className="font-semibold text-3xl">{list.name}</h2>
        <div className="mb-2 text-lg">
          <h3>{username}</h3>
          <div className="text-neutral-500">{`Updated ${formatDate(
            list.dateChanged
          )}`}</div>
        </div>
        <div className="mb-4 text-sm">{list.description}</div>
        <Button onClick={handleClick}>Add to queue</Button>
      </div>
      <ul>
        {items.map((item, index) => {
          return (
            <li className="mb-2" key={item.id}>
              <QueueItemCard
                item={item}
                left={
                  <div className="text-center text-md w-6">{index + 1}</div>
                }
              />
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
