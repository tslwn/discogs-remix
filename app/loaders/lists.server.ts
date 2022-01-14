import type { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getDiscogsClient } from "~/util/auth.server";

export const listsLoader = async ({ request }: DataFunctionArgs) => {
  const client = await getDiscogsClient(request);

  const [{ username }, { lists }] = await Promise.all([
    client.getIdentity(),
    client.getLists(),
  ]);

  return { lists, username };
};

export type ListsLoaderData = Awaited<ReturnType<typeof listsLoader>>;

export const listsForUserLoader = async ({
  params,
  request,
}: DataFunctionArgs) => {
  const username = params.username;
  invariant(typeof username === "string", "expected params.username");

  const client = await getDiscogsClient(request);

  const { lists } = await client.getListsForUser(username);

  return { lists, username };
};

export type ListsForUserLoaderData = Awaited<
  ReturnType<typeof listsForUserLoader>
>;

export const listForUserLoader = async ({
  params,
  request,
}: DataFunctionArgs) => {
  const username = params.username;
  invariant(typeof username === "string", "expected params.username");

  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);

  const { lists } = await client.getListsForUser(username);

  const list = lists.find((list) => list.id === id);
  if (list === undefined) {
    throw new Response("Not found", { status: 404 });
  }

  return { list, username };
};

export type ListForUserLoaderData = Awaited<
  ReturnType<typeof listForUserLoader>
>;

export const listItemsLoader = async ({
  params,
  request,
}: DataFunctionArgs) => {
  const username = params.username;
  invariant(typeof username === "string", "expected params.username");

  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);

  const [{ lists }, { items }] = await Promise.all([
    client.getListsForUser(username),
    client.getListItems(id),
  ]);

  const list = lists.find((list) => list.id === id);
  if (list === undefined) {
    throw new Response("Not found", { status: 404 });
  }

  return { list, items };
};

export type ListItemsLoaderData = Awaited<ReturnType<typeof listItemsLoader>>;
