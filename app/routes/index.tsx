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
      <div className="flex flex-col items-center p-8">
        <img alt="Logo SUBTE" className="w-80 " src="/subte-logo.png" />
        <p className="mb-8 text-xl mt-2 font-bold">Clientes</p>
        <nav className="mt-10">
          <ul>
            <li>
              <Link
                className="border-2 border-black px-4 py-1 rounded hover:bg-gray-700 hover:text-white inline-block"
                to="clientes"
              >
                Lista de Clientes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
