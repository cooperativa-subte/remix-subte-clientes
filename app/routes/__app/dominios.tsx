import { Domain, User } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";

import { db } from "~/utils/db.server";
import { getUser, getUserId } from "~/utils/session.server";

type LoaderData = {
  user: User | null;
  domainsList: Array<Domain>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) throw new Response("No estás autenticado", { status: 401 });

  const domainsList = await db.domain.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const user = await getUser(request);
  const data: LoaderData = {
    user,
    domainsList,
  };

  return data;
};

export default function DominiosRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-center text-4xl font-bold">Listado de Dominios</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre Dominio</th>
            <th>Precio</th>
            <th>Moneda</th>
            <th>Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {data.domainsList.map((domain) => (
            <tr key={domain.id}>
              <td>{domain.domain}</td>
              <td>{domain.price}</td>
              <td>{domain.currency}</td>
              <td>{domain.expirationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
