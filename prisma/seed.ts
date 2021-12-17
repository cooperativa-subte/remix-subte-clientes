import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getClients().map((client) => {
      return db.client.create({
        data: client,
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
