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
    <>
      <header />
      <div className="flex flex-col items-center p-8">
        <img alt="Logo SUBTE" className="w-80 " src="/subte-logo.png" />
        <p className="mb-8 text-xl mt-2 font-bold">Clientes</p>
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
    </>
  );
}
