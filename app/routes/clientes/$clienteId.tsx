import type { Client } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = { client: Client };

export const loader: LoaderFunction = async ({ params }) => {
  const client = await db.client.findUnique({
    where: { id: params.clienteId },
  });

  if (!client) throw new Error("El cliente no fue encontrado");
  const data: LoaderData = { client };

  return data;
};

export default function ClienteRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Esta es la info del cliente</p>
      <p>Nombre: {data.client.name}</p>
      <p>
        Email de contacto:{" "}
        <a href={data.client.contactEmail} rel="noreferrer noopener" target="_blank">
          {data.client.contactEmail}
        </a>
      </p>
    </div>
  );
}
