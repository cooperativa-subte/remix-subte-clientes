import { User } from "@prisma/client";
import { Form, Link, LoaderFunction, Outlet, useCatch, useLoaderData } from "remix";

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
      <header className="mx-auto flex max-w-screen-xl items-center justify-between py-4">
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
            <li className="ml-4">
              <Link to="/proveedores-hosting">Proveedores de Hosting</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <div className="mx-auto mt-4 flex max-w-7xl justify-end">
          {data.user ? (
            <div className="flex items-center">
              <p>
                ¡Hola <span className="font-bold capitalize">{`${data.user.username}`}!</span>
              </p>
              <Form action="/logout" className="ml-4" method="post">
                <button
                  className="rounded border-2 border-black px-4 py-1 hover:bg-gray-700 hover:text-white"
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

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <img alt="Logo SUBTE" className="w-80 " src="/subte-logo.png" />
        <p className="mb-8 mt-2 text-xl font-bold">Clientes</p>
        <p className="text-4xl">Tienes que estar autenticado para usar la app.</p>
        <Link
          className="mt-6 rounded bg-black py-2 px-4 font-bold uppercase text-white"
          to="/login"
        >
          Login
        </Link>
      </div>
    );
  }
}
