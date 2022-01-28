import { PrismaClient, QueueItemType } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  const user = await db.user.create({ data: { username: "tslwn" } });

  await db.queueItem.create({
    data: {
      userId: user.id,
      type: QueueItemType.MASTER,
      discogsId: 5656,
      artists: "Coil",
      title: "Musick To Play In The Dark",
    },
  });

  await db.queueItem.create({
    data: {
      userId: user.id,
      type: QueueItemType.RELEASE,
      discogsId: 56898,
      artists: "Coil",
      title: "Musick To Play In The Dark²",
    },
  });

  await db.queueHistory.create({
    data: {
      userId: user.id,
      type: QueueItemType.MASTER,
      discogsId: 5656,
    },
  });
}

seed();
