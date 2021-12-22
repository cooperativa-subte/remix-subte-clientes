import { Client } from "@prisma/client";
import { LoaderFunction, useCatch } from "remix";
import { RiErrorWarningLine } from "react-icons/ri";

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
  return (
    <div>
      <p className="bg-yellow-200 p-4 rounded text-gray-800 flex items-center">
        <RiErrorWarningLine className="text-3xl mr-2" />
        Selecciona un cliente en la lista de la izquierda para mostrar su información.
      </p>
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
