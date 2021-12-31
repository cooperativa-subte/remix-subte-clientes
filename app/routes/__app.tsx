import { User } from "@prisma/client";
import { Form, Link, LoaderFunction, Outlet, useLoaderData } from "remix";

import { getUser, getUserId } from "~/utils/session.server";

type LoaderData = {
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("No estás autenticado", { status: 401 });
  }

  const user = await getUser(request);

  const data: LoaderData = {
    user,
  };

  return data;
};

export default function AppLayout() {
  const data = useLoaderData<LoaderData>();

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
        <div className="mt-4 flex justify-end max-w-7xl mx-auto">
          {data.user ? (
            <div className="flex items-center">
              <p>
                ¡Hola <span className="capitalize font-bold">{`${data.user.username}`}!</span>
              </p>
              <Form action="/logout" className="ml-4" method="post">
                <button
                  className="border-2 border-black px-4 py-1 rounded hover:bg-gray-700 hover:text-white"
                  type="submit"
                >
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
        <Outlet />
      </main>
    </div>
  );
}
