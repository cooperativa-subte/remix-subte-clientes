import type { Client, Domain, Hosting } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  useCatch,
  useLoaderData,
  useParams,
} from "remix";

import { ClientDisplay } from "~/components/client";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = ({ data }: { data: LoaderData | undefined }) => {
  if (!data) return { title: "SUBTE Clientes | No Encontrado", description: "No Encontrado" };

  return {
    title: `SUBTE Clientes | ${data.client.name}`,
    description: "Cliente",
  };
};

type LoaderData = { client: Client; isOwner: boolean; hostings: Hosting[]; domains: Domain[] };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const client = await db.client.findUnique({
    where: { id: params.clienteId },
  });

  if (!client) throw new Response("Cliente no encontrado", { status: 404 });

  const hostings = await db.hosting.findMany({
    where: { client: { id: client.id } },
  });

  const domains = await db.domain.findMany({
    where: { client: { id: client.id } },
  });

  const data: LoaderData = { client, isOwner: userId === client.creatorId, hostings, domains };

  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") === "DELETE") {
    const userId = await requireUserId(request);
    const client = await db.client.findUnique({
      where: { id: params.clienteId },
    });

    if (!client) {
      throw new Response("No se puede borrar un cliente que no existe", { status: 404 });
    }

    if (client.creatorId !== userId) {
      throw new Response("No puedes borrar un cliente que no te pertenece", { status: 401 });
    }

    await db.client.delete({ where: { id: params.clienteId } });

    return redirect("/clientes");
  }
};

export default function ClienteRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="mx-auto max-w-screen-xl">
      <ClientDisplay
        client={data.client}
        domains={data.domains}
        hostings={data.hostings}
        isOwner={data.isOwner}
      />
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
          <p>No hay ning??n cliente con el id {params.clientId}</p>
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

export function ErrorBoundary({ error }: { error: Error }) {
  const { clientId } = useParams();

  return (
    <div className="error-container">{`Hubo un error al cargar el cliente con el id: ${clientId}`}</div>
  );
}
