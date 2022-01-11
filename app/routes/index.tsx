import { redirect } from "remix";
import type { LoaderFunction } from "remix";
import { requireAuthSession } from "~/util/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request);
  return redirect("/api");
};
