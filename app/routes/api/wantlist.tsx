import { json } from 'remix';
import type { ActionFunction } from 'remix';
import { getSessionAndClient } from '~/lib/client.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = Number(formData.get('id'));

  const { client } = await getSessionAndClient(request);

  const response = await client.addToWantlist(id);

  return json(response);
};
