import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const creator = await prisma.user.create({
    data: {
      username: "francisco",
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  getClients().map(async (client, index) => {
    const data = { creatorId: creator.id, ...client };

    try {
      const clientCreated = await prisma.client.create({
        data,
      });

      const domain = getDomains()[index];

      const domainData = { clientId: clientCreated.id, ...domain };

      await prisma.domain.create({ data: domainData });

      const hosting = getHostings()[index];

      const hostingData = { clientId: clientCreated.id, ...hosting };

      return prisma.hosting.create({ data: hostingData });
    } catch (error) {
      console.log(error);
    }
  });
}

seed();

function getClients() {
  return [
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
function getHostings() {
  return [
    {
      serverName: "cooperativacomuna.uy",
      provider: "Hosting Montevideo",
      website: "https://cooperativacomuna.uy",
      price: 40,
      currency: "USD",
      expirationDate: new Date("2022-11-06"),
      payoutDate: new Date("2022-11-06"),
    },
    {
      serverName: "elpicadero.org.uy",
      provider: "Hosting Montevideo",
      website: "https://terratabu.uy",
      price: 40,
      currency: "USD",
      expirationDate: new Date("2022-01-17"),
      payoutDate: new Date("2022-01-17"),
    },
  ];
}
function getDomains() {
  return [
    {
      domain: "cooperativacomuna.uy",
      price: 850,
      currency: "UYU",
      expirationDate: new Date("2022-11-06"),
      payoutDate: new Date("2022-11-06"),
    },
    {
      domain: "terratabu.uy",
      price: 800,
      currency: "UYU",
      expirationDate: new Date("2022-01-14"),
      payoutDate: new Date("2022-01-14"),
    },
  ];
}
