import {
  ActionFunction,
  json,
  Link,
  LinksFunction,
  MetaFunction,
  useActionData,
  useSearchParams,
} from "remix";
import { AiFillHome } from "react-icons/ai";

import { createUserSession, login } from "~/utils/session.server";

import stylesUrl from "../styles/login.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => {
  return {
    title: "SUBTE Clientes | Login",
    description: "Login",
  };
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return "El nombre de usuario debe tener al menos 3 caracteres";
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return "La contraseña debe tener al menos 3 caracteres";
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/clientes";

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: "El formulario está incorrecto",
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  const user = await login({ username, password });

  if (!user) {
    return badRequest({
      fields,
      formError: "Username/Password compination is incorrect",
    });
  }

  return createUserSession(user.id, redirectTo);
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-col items-center">
      <img alt="Logo SUBTE" className="mt-10 w-80" src="/subte-logo.png" />
      <p className="mb-8 mt-2 text-xl font-bold">Clientes</p>
      <div data-light="">
        <form
          aria-describedby={actionData?.formError ? "form-error-message" : undefined}
          className="rounded bg-gray-100 px-8 py-4"
          method="post"
        >
          <h1 className="mb-4 text-center text-xl font-bold">Login</h1>
          <input
            name="redirectTo"
            type="hidden"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <div>
            <label className="font-bold" htmlFor="username-input">
              Usuario
            </label>
            <input
              aria-describedby={actionData?.fieldErrors?.username ? "username-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              className="inline-block w-full px-2"
              defaultValue={actionData?.fields?.username}
              id="username-input"
              name="username"
              type="text"
            />
            {actionData?.fieldErrors?.username && (
              <p className="form-validation-error" id="username-error" role="alert">
                {actionData?.fieldErrors.username}
              </p>
            )}
          </div>
          <div className="mt-2">
            <label className="font-bold" htmlFor="password-input">
              Contraseña
            </label>
            <input
              aria-describedby={actionData?.fieldErrors?.password ? "password-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
              className="inline-block w-full px-2"
              defaultValue={actionData?.fields?.password}
              id="password-input"
              name="password"
              type="password"
            />
            {actionData?.fieldErrors?.password && (
              <p className="form-validation-error" id="password-error" role="alert">
                {actionData?.fieldErrors.password}
              </p>
            )}
          </div>
          <div id="form-error-message">
            {actionData?.formError && <p>{actionData?.formError}</p>}
          </div>
          <button className="mt-4 w-full rounded bg-gray-700 py-2 text-white" type="submit">
            Entrar
          </button>
        </form>
      </div>
      <div className="mt-4">
        <ul>
          <li>
            <Link className="flex items-center" to="/">
              <AiFillHome className="mr-2" />
              Volver al Home
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
