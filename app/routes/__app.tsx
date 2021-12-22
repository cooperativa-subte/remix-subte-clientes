import { Link, Outlet } from "remix";

export default function AppLayout() {
  return (
    <div>
      <header className="max-w-screen-xl mx-auto py-4 flex justify-between items-center">
        <Link to="/">
          <div className="flex flex-col items-end">
            <img alt="Logo de SUBTE" className="w-40" src="/subte-logo.png" />
            <p className="font-bold">Clientes</p>
          </div>
        </Link>
        <nav>
          <ul className="flex justify-end">
            <li className="ml-4">
              <Link to="/clientes">Clientes</Link>
            </li>
            <li className="ml-4">
              <Link to="/dominios">Dominios</Link>
            </li>
            <li className="ml-4">
              <Link to="/hostings">Hostings</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
