import { Link, LinksFunction } from "remix";
import { Outlet } from "remix";

import stylesUrl from "../styles/clientes.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

export default function ClientesRoute() {
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
            <li>
              <Link to="cliente-random-id">Cooperativa de trabajo SUBTE</Link>
            </li>
          </ul>
        </div>
        <div className="clientes-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
