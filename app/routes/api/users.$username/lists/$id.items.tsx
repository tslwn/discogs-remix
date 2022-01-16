import { useLoaderData } from "remix";
import Button from "~/components/Button";
import Page from "~/components/Page";
import QueueItemCard from "~/components/QueueItemCard";
import TopBar from "~/components/TopBar";
import { useQueue } from "~/contexts/QueueContext";
import type { ListItems } from "~/loaders/lists.server";

export { listItems as loader } from "~/loaders/lists.server";

export default function Route() {
  const { list, items } = useLoaderData<ListItems>();

  const { enqueue } = useQueue();

  // TODO: what if item has no videos?
  const handleClick = () => {
    for (const item of items) {
      enqueue(item);
    }
  };

  return (
    <>
      <TopBar
        left={<h2 className="font-semibold">{list.name}</h2>}
        right={<Button onClick={handleClick}>Add to queue</Button>}
      />
      <Page>
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
    </>
  );
}
