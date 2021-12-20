import { ActionFunction, json, Link, LinksFunction, useActionData, useSearchParams } from "remix";

import { db } from "~/utils/db.server";
import { createUserSession, login } from "~/utils/session.server";

import stylesUrl from "../styles/login.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
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
    loginType: string;
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/clientes";

  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: "El formulario está incorrecto",
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case "login":
      const user = await login({ username, password });

      console.log({ user });

      if (!user) {
        return badRequest({
          fields,
          formError: "Username/Password compination is incorrect",
        });
      }

      return createUserSession(user.id, redirectTo);
    case "register":
      const userExists = await db.user.findFirst({ where: { username } });

      if (userExists) {
        return badRequest({
          fields,
          formError: `El usuario ${username} ya existe`,
        });
      }

      return badRequest({
        fields,
        formError: "No implementado",
      });
    default:
      return badRequest({
        fields,
        formError: "El tipo de login es incorrecto",
      });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form
          aria-describedby={actionData?.formError ? "form-error-message" : undefined}
          method="post"
        >
          <input
            name="redirectTo"
            type="hidden"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                defaultChecked={
                  !actionData?.fields?.loginType || actionData?.fields?.loginType === "login"
                }
                name="loginType"
                type="radio"
                value="login"
              />{" "}
              Login
            </label>
            <label>
              <input
                defaultChecked={actionData?.fields?.loginType === "register"}
                name="loginType"
                type="radio"
                value="register"
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              aria-describedby={actionData?.fieldErrors?.username ? "username-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
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
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              aria-describedby={actionData?.fieldErrors?.password ? "password-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
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
          <button className="button" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="clientes">Clientes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
