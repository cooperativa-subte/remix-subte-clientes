import { User } from "@prisma/client";
import { Form, Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { Outlet } from "remix";

import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

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
  clientsListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const clientsListItems = await db.client.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
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
      <header>
        <h1>
          <Link aria-label="Subte Clientes" title="Subte clientes" to="/">
            SUBTE CLIENTES
          </Link>
        </h1>
        {data.user ? (
          <div>
            <span>{`Hi ${data.user.username}`}</span>
            <Form action="/logout" method="post">
              <button className="button" type="submit">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </header>
      <main>
        <div className="clients-list">
          <Link to=".">Mostrar un cliente random</Link>
          <p>Este es un cliente random a mostrar</p>
          <ul>
            {data.clientsListItems.map((client) => (
              <li key={client.id}>
                <Link prefetch="intent" to={client.id}>
                  {client.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="button" to="nuevo">
            Agregar cliente
          </Link>
        </div>
        <div className="clientes-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
