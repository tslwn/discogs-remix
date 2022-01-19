import type { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { LoaderData } from "~/types/loaders";
import { getDiscogsClient } from "~/util/auth.server";

export const lists = async ({ request }: DataFunctionArgs) => {
  const client = await getDiscogsClient(request);

  const { username } = await client.getIdentity();

  const { lists } = await client.getUserLists(username);

  return { lists };
};

export type Lists = LoaderData<typeof lists>;

export const list = async ({ params, request }: DataFunctionArgs) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);

  const list = await client.getList(id);

  return {
    list: {
      name: list.name,
      description: list.description,
      public: list.public,
      dateAdded: list.date_added,
      dateChanged: list.date_changed,
    },
    items: list.items.map((item) => {
      const { artists, title } = deformatDisplayTitle(item.display_title);
      return {
        id: item.id,
        artists,
        title,
        src: item.image_url,
        type: item.type,
      };
    }),
  };
};

export type List = LoaderData<typeof list>;

// TODO: doesn't work if either contains " - "
function deformatDisplayTitle(displayTitle: string) {
  const [artists, title] = displayTitle.split(" - ");
  return { artists, title };
}
