import { json } from "remix";
import type { ActionFunction } from "remix";
import { getDiscogsClient } from "~/util/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

  const client = await getDiscogsClient(request);
  const { username } = await client.getIdentity();
  const want = await client.addToWantlist(username, id);

  return json(want);
};
