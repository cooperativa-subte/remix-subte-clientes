import { Client } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = { randomClient: Client };

export const loader: LoaderFunction = async () => {
  const count = await db.client.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomClient] = await db.client.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  const data: LoaderData = { randomClient };

  return data;
};

export default function ClientesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Acá va un cliente random</p>
      <p>{data.randomClient.name}</p>
      <Link to={data.randomClient.id}>&quot;{data.randomClient.name}&quot; Permalink</Link>
    </div>
  );
}
