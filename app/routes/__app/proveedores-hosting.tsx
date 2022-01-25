import { HostingProvider } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = {
  hostingProviders: HostingProvider[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const hostingProviders = await db.hostingProvider.findMany({
    orderBy: { name: "asc" },
  });

  const data: LoaderData = { hostingProviders };

  return data;
};

export default function HostingProvidersRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <section className="mx-auto max-w-screen-xl">
      <table>
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Proveedor</th>
            <th className="border border-gray-400 p-2">Nombre del Servidor</th>
            <th className="border border-gray-400 p-2">Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {data.hostingProviders.map((provider) => (
            <tr key={provider.id}>
              <td className="border border-gray-400 p-2">{provider.provider}</td>
              <td className="border border-gray-400 p-2">{provider.name}</td>
              <td className="border border-gray-400 p-2">{provider.expirationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
