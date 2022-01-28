import { db } from "~/models/db.server";

export function createOrUpdateUser(username: string) {
  return db.user.upsert({
    create: { username },
    update: {},
    where: { username },
  });
}
