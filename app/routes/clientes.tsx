import { Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { Outlet } from "remix";

import { db } from "~/utils/db.server";

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
  clientsListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    clientsListItems: (await db.client.findMany()) ?? [],
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
      </header>
      <main>
        <div className="clients-list">
          <Link to=".">Mostrar un cliente random</Link>
          <p>Este es un cliente random a mostrar</p>
          <ul>
            {data.clientsListItems.map((client) => (
              <li key={client.id}>
                <Link to={client.id}>{client.name}</Link>
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
