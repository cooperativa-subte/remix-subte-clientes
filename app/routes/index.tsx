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
    <div>
      <h1>SUBTE Clientes</h1>
      <nav>
        <ul>
          <li>
            <Link to="clientes">Lista de Clientes</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
