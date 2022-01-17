import { json } from "remix";
import type { ActionFunction } from "remix";
import { getDiscojs } from "~/util/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = Number(formData.get("id"));

  const client = await getDiscojs(request);

  const response = await client.addToWantlist(id);

  return json(response);
};
