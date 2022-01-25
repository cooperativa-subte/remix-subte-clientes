import { Hosting } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

interface HostingListExtendes extends Hosting {
  provider: {
    name: string;
  };
  client: {
    name: string;
  };
}

type LoaderData = {
  hostingsList: HostingListExtendes[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("No estás autenticado", { status: 401 });
  }

  const hostingsList = await db.hosting.findMany({
    orderBy: { serverName: "asc" },
    include: {
      provider: {
        select: {
          name: true,
        },
      },
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  const data: LoaderData = {
    hostingsList,
  };

  return data;
};

export default function HostingsRoute() {
  const data = useLoaderData<LoaderData>();

  console.log(data);

  return (
    <div className="mx-auto mt-10 max-w-screen-xl">
      <table>
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Proveedor</th>
            <th className="border border-gray-400 p-2">Nombre Servidor</th>
            <th className="border border-gray-400 p-2">Cliente</th>
            <th className="border border-gray-400 p-2">Sitio</th>
            <th className="border border-gray-400 p-2">Precio 2022</th>
            <th className="border border-gray-400 p-2">Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {data.hostingsList.map((hosting) => (
            <tr key={hosting.id}>
              <td className="border border-gray-400 p-2">
                <Link className="hover:underline" to={`/proveedores-hosting/${hosting.providerId}`}>
                  {hosting.provider.name}
                </Link>
              </td>
              <td className="border border-gray-400 p-2">{hosting.serverName}</td>
              <td className="border border-gray-400 p-2">
                <Link className="hover:underline" to={`/clientes/${hosting.clientId}`}>
                  {hosting.client.name}
                </Link>
              </td>
              <td className="border border-gray-400 p-2">
                <a
                  className="hover:underline"
                  href={hosting.website}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {hosting.website}
                </a>
              </td>
              <td className="border border-gray-400 p-2">{hosting.price}</td>
              <td className="border border-gray-400 p-2">{hosting.expirationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
