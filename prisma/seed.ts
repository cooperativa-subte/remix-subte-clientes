import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const creator = await prisma.user.create({
    data: {
      username: "francisco",
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  await Promise.all(
    getClients().map((client) => {
      const data = { creatorId: creator.id, ...client };

      return prisma.client.create({
        data,
      });
    }),
  );
}

seed();

function getClients() {
  return [
    {
      name: "Cooperativa de trabajo SUBTE",
      contactEmail: "hola@subte.uy",
    },
    {
      name: "Cooperativa de trabajo COMUNA",
      contactEmail: "contacto@cooperativacomuna.uy",
    },
    {
      name: "Terra Tabú",
      contactEmail: "hola@terratabu.uy",
    },
  ];
}
