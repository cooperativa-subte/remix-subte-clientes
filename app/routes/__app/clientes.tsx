import { User } from "@prisma/client";
import { Link, LinksFunction, LoaderFunction, useCatch, useLoaderData } from "remix";
import { Outlet } from "remix";

import { db } from "~/utils/db.server";
import { getUser, getUserId } from "~/utils/session.server";

import stylesUrl from "../../styles/clientes.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

type LoaderData = {
  user: User | null;
  clientsListItems: Array<{ id: string; name: string; contactEmail: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("No estás autenticado", { status: 401 });
  }

  const clientsListItems = await db.client.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, contactEmail: true },
  });

  const user = await getUser(request);

  const data: LoaderData = {
    clientsListItems,
    user,
  };

  return data;
};

export default function ClientesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <main className="mx-auto max-w-7xl">
        <h1 className="my-4 text-center text-4xl">Listado de Clientes</h1>
        <div className="grid grid-cols-2 gap-10">
          <div className="">
            <table className="mt w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2">Nombre</th>
                  <th className="border border-gray-200 p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {data.clientsListItems.map((client) => (
                  <tr key={client.id}>
                    <td className="border border-gray-200 p-2">
                      <Link to={client.id}>{client.name}</Link>
                    </td>
                    <td className="border border-gray-200 p-2">
                      <Link to={client.id}>{client.contactEmail}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link
              className="mt-4 inline-block rounded border-2 border-black px-4 py-1 hover:bg-gray-700 hover:text-white"
              to="nuevo"
            >
              Agregar cliente
            </Link>
          </div>
          <div className="clientes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <img alt="Logo SUBTE" className="w-80 " src="/subte-logo.png" />
        <p className="mb-8 mt-2 text-xl font-bold">Clientes</p>
        <p className="text-4xl">Tienes que estar autenticado para usar la app.</p>
        <Link
          className="mt-6 rounded bg-black py-2 px-4 font-bold uppercase text-white"
          to="/login"
        >
          Login
        </Link>
      </div>
    );
  }
}
