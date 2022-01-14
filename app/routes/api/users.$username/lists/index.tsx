import { useLoaderData } from "remix";
import Page from "~/components/Page";
import type { ListsForUserLoaderData as LoaderData } from "~/loaders/lists.server";

export { listsForUserLoader as loader } from "~/loaders/lists.server";

export default function Route() {
  const { lists } = useLoaderData<LoaderData>();

  return (
    <Page>
      {lists.map((list) => (
        <div>{list.name}</div>
      ))}
    </Page>
  );
}
