import { Link, LinksFunction, MetaFunction } from "remix";

import stylesUrl from "../styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => {
  return {
    title: "SUBTE Clientes",
    description: "Inicio",
  };
};

export default function IndexRoute() {
  return (
    <div className="flex flex-col items-center p-8">
      <img alt="logo de subte" className="w-96" src="/subte-logo.png" />
      <h1 className="text-center mt-4 text-6xl font-extrabold uppercase">Clientes</h1>
      <nav className="mt-10">
        <ul>
          <li>
            <Link className="border-2 py-2 px-4 border-black rounded" to="clientes">
              Lista de Clientes
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
