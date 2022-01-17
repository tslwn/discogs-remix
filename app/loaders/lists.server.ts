import type { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { LoaderData } from "~/types/loaders";
import { getDiscojs } from "~/util/auth.server";

export const lists = async ({ request }: DataFunctionArgs) => {
  const client = await getDiscojs(request);

  const [{ username }, { lists }] = await Promise.all([
    client.getIdentity(),
    client.getLists(),
  ]);

  return { lists, username };
};

export type Lists = LoaderData<typeof lists>;

export const userLists = async ({ params, request }: DataFunctionArgs) => {
  const username = params.username;
  invariant(typeof username === "string", "expected params.username");

  const client = await getDiscojs(request);

  const { lists } = await client.getListsForUser(username);

  return { lists, username };
};

export type UserLists = LoaderData<typeof userLists>;

export const listItems = async ({ params, request }: DataFunctionArgs) => {
  const username = params.username;
  invariant(typeof username === "string", "expected params.username");

  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscojs(request);

  const [{ lists }, { items }] = await Promise.all([
    client.getListsForUser(username),
    client.getListItems(id),
  ]);

  const list = lists.find((list) => list.id === id);
  if (list === undefined) {
    throw new Response("Not found", { status: 404 });
  }

  return {
    list: {
      name: list.name,
      description: list.description,
      public: list.public,
      dateAdded: list.date_added,
      dateChanged: list.date_changed,
    },
    items: items.map((item) => {
      const { artists, title } = deformatDisplayTitle(item.display_title);
      return {
        id: item.id,
        artists,
        title,
        src: item.image_url,
        type: item.type,
      };
    }),
    username,
  };
};

// TODO: doesn't work if either contains " - "
function deformatDisplayTitle(displayTitle: string) {
  const [artists, title] = displayTitle.split(" - ");
  return { artists, title };
}

export type ListItems = LoaderData<typeof listItems>;
