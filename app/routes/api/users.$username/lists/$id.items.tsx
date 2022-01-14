import { useLoaderData } from "remix";
import Button from "~/components/Button";
import Page from "~/components/Page";
import QueueItemCard from "~/components/QueueItemCard";
import TopBar from "~/components/TopBar";
import { useQueue } from "~/contexts/QueueContext";
import type { ListItemsLoaderData } from "~/loaders/lists.server";

export { listItemsLoader as loader } from "~/loaders/lists.server";

export default function Route() {
  const { list, items } = useLoaderData<ListItemsLoaderData>();

  const queueItems = items.map((item) => {
    const { artists, title } = deformatDisplayTitle(item.display_title);
    return {
      id: item.id,
      artists,
      title,
      src: item.image_url,
    };
  });

  const { enqueue } = useQueue();

  // what about items w/ no videos?
  const handleClick = () => {
    for (const item of queueItems) {
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
          {queueItems.map((item, index) => {
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

function deformatDisplayTitle(displayTitle: string) {
  const [artists, title] = displayTitle.split(" - ");
  return { artists, title };
}
