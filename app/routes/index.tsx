import { Link, LinksFunction } from "remix";

import stylesUrl from "../styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
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
