import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const creator = await prisma.user.create({
    data: {
      username: "francisco",
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  let hostingProviders: {
    id?: string;
    name: string;
    provider: string;
    price: number;
    currency: string;
    expirationDate: Date;
  }[] = getHostingProviders();

  Promise.all(
    hostingProviders.map(async (hostingProvider) => {
      return prisma.hostingProvider.create({
        data: { ownerId: creator.id, ...hostingProvider },
      });
    }),
  )
    .then(async (hostingProvidersCreated) => {
      hostingProviders = hostingProvidersCreated;
    })
    .catch((error) => {
      console.log(error);
    });

  getClients().map(async (client, index) => {
    const data = { creatorId: creator.id, ...client };

    try {
      const clientCreated = await prisma.client.create({
        data,
      });

      const domain = getDomains()[index];

      await prisma.domain.create({ data: { clientId: clientCreated.id, ...domain } });

      const hosting = getHostings()[index];

      const hostingData = {
        clientId: clientCreated.id,
        providerId: index === 0 ? hostingProviders[1].id : hostingProviders[2].id,
        ...hosting,
      };

      await prisma.hosting.create({ data: hostingData });
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

function getHostingProviders() {
  return [
    {
      name: "ceifem.ei.udelar.edu.uy",
      provider: "Hosting Montevideo",
      price: 160.65,
      currency: "USD",
      expirationDate: new Date("2022-07-29"),
    },
    {
      name: "cooperativacomuna.uy",
      provider: "Hosting Montevideo",
      price: 186.15,
      currency: "USD",
      expirationDate: new Date("2022-07-29"),
    },
    {
      name: "elpicadero.org.uy",
      provider: "Hosting Montevideo",
      price: 186.15,
      currency: "USD",
      expirationDate: new Date("2022-05-19"),
    },
    {
      name: "historiasdebarro.uy",
      provider: "Funio",
      price: 9.99,
      currency: "USD",
      expirationDate: new Date("2022-01-13"),
    },
    {
      name: "subte.uy",
      provider: "Banah Hosting",
      price: 107.46,
      currency: "USD",
      expirationDate: new Date("2022-01-22"),
    },
    {
      name: "suinau.org.uy",
      provider: "Hosting Montevideo",
      price: 119,
      currency: "USD",
      expirationDate: new Date("2022-06-24"),
    },
  ];
}

function getHostings() {
  return [
    {
      serverName: "cooperativacomuna.uy",
      website: "https://cooperativacomuna.uy",
      price: 40,
      currency: "USD",
      expirationDate: new Date("2022-11-06"),
      payoutDate: new Date("2022-11-06"),
    },
    {
      serverName: "elpicadero.org.uy",
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
