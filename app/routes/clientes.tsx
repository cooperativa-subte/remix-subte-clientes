import { User } from "@prisma/client";
import { Form, Link, LinksFunction, LoaderFunction, useCatch, useLoaderData } from "remix";
import { Outlet } from "remix";

import { db } from "~/utils/db.server";
import { getUser, getUserId } from "~/utils/session.server";

import stylesUrl from "../styles/clientes.css";

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
    <div>
      <header className="mt-4 flex justify-between">
        <h1 className="text-center">
          <Link
            aria-label="Subte Clientes"
            className="font-bold text-xl"
            title="Subte clientes"
            to="/"
          >
            <img alt="Logo SUBTE" className="w-60 mb-2" src="/subte-logo.png" />
            Clientes
          </Link>
        </h1>
        {data.user ? (
          <div className="flex items-center">
            <p>
              ¡Hola <span className="capitalize font-bold">{`${data.user.username}`}!</span>
            </p>
            <Form action="/logout" className="ml-4" method="post">
              <button className="border-2 border-black px-4 py-0 rounded" type="submit">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </header>
      <main>
        <div className="clients-list flex flex-col">
          <Link to=".">Mostrar un cliente random</Link>
          <p>Este es un cliente random a mostrar</p>
          <Link className="self-end mt-8 mb-4 border-2 border-black px-2 rounded" to="nuevo">
            Agregar cliente
          </Link>
          <table className="table-auto border-collapse mt">
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
        </div>
        <div className="clientes-outlet ml-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img alt="Logo SUBTE" className="w-80 " src="/subte-logo.png" />
        <p className="mb-8 text-xl mt-2 font-bold">Clientes</p>
        <p className="text-4xl">Tienes que estar autenticado para usar la app.</p>
        <Link
          className="rounded bg-black text-white py-2 px-4 font-bold uppercase mt-6"
          to="/login"
        >
          Login
        </Link>
      </div>
    );
  }
}
