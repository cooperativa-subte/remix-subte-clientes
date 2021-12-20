import type { Client } from "@prisma/client";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  MetaFunction,
  redirect,
  useCatch,
  useLoaderData,
  useParams,
} from "remix";

import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData | undefined }) => {
  if (!data) return { title: "SUBTE Clientes | No Encontrado", description: "No Encontrado" };

  return {
    title: `SUBTE Clientes | ${data.client.name}`,
    description: "Cliente",
  };
};

type LoaderData = { client: Client; isOwner: boolean };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const client = await db.client.findUnique({
    where: { id: params.clienteId },
  });

  if (!client) throw new Response("Cliente no encontrado", { status: 404 });
  const data: LoaderData = { client, isOwner: userId === client.creatorId };

  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") === "DELETE") {
    const userId = await requireUserId(request);
    const client = await db.client.findUnique({
      where: { id: params.clientId },
    });

    if (!client) {
      throw new Response("No se puede borrar un cliente que no existe", { status: 404 });
    }

    if (client.creatorId !== userId) {
      throw new Response("No puedes borrar un cliente que no te pertenece", { status: 401 });
    }

    await db.client.delete({ where: { id: params.clientId } });

    return redirect("/clientes");
  }
};

export default function ClienteRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Esta es la info del cliente</p>
      <p>Nombre: {data.client.name}</p>
      <Link to=".">{data.client.name} Permalink</Link>
      <p>
        Email de contacto:{" "}
        <a href={data.client.contactEmail} rel="noreferrer noopener" target="_blank">
          {data.client.contactEmail}
        </a>
      </p>
      {data.isOwner && (
        <Form method="post">
          <input name="_method" type="hidden" value="delete" />
          <button className="button" type="submit">
            Borrar
          </button>
        </Form>
      )}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          <p>No hay ningún cliente con el id {params.clientId}</p>
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          <p>Lo siento, el cliente {params.clientId} no te pertenece</p>
        </div>
      );
    }
    default: {
      throw new Error(`Hubo un error inesperado ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const { clientId } = useParams();

  return (
    <div className="error-container">{`Hubo un error al cargar el cliente con el id: ${clientId}`}</div>
  );
}
