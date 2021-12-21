import { Client } from "@prisma/client";
import { Link, LoaderFunction, useCatch, useLoaderData } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = { randomClient: Client };

export const loader: LoaderFunction = async () => {
  const count = await db.client.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomClient] = await db.client.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  if (!randomClient) throw new Response("No hay ningún cliente", { status: 404 });

  const data: LoaderData = { randomClient };

  return data;
};

export default function ClientesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p className="font-bold">Cliente:</p>
      <p>{data.randomClient.name}</p>
      <Link to={data.randomClient.id}>&quot;{data.randomClient.name}&quot; Permalink</Link>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        <p>No hay ningún cliente que mostrar</p>
      </div>
    );
  }
  throw new Error(`Hubo un error inesperado con el status ${caught.status}`);
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      <p>Ups, pasó algo malo. :(</p>
    </div>
  );
}
