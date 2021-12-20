import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
} from "remix";

import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("No estás autenticado", { status: 401 });
  }
};

function validateClientName(name: string) {
  if (name.length < 3) {
    return "El nombre debe tener al menos 3 caracteres";
  }
}

function validateClientEmail(email: string) {
  if (email.length < 3) {
    return "El Email debe tener al menos 3 caracteres";
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    email: string | undefined;
  };
  fields?: {
    name: string;
    contactEmail: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const email = form.get("email");

  if (typeof name !== "string" || typeof email !== "string") {
    return badRequest({
      formError: "El formulario está incorrecto",
    });
  }

  const fieldErrors = {
    name: validateClientName(name),
    email: validateClientEmail(email),
  };

  const fields = { name, contactEmail: email };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const client = await db.client.create({ data: { ...fields, creatorId: userId } });

  return redirect(`/clientes/${client.id}`);
};

export default function NuevoClienteRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <p>Agregar un cliente</p>
      <Form method="post">
        <div>
          <label>
            Nombre:{" "}
            <input
              aria-describedby={actionData?.fieldErrors?.name ? "name-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
            />
          </label>
          {actionData?.fieldErrors?.name && (
            <p className="form-validation-error" id="name-error" role="alert">
              {actionData.fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label>
            Email de contacto:{" "}
            <input
              aria-describedby={actionData?.fieldErrors?.email ? "email-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.email) || undefined}
              defaultValue={actionData?.fields?.contactEmail}
              name="email"
              type="email"
            />
          </label>
          {actionData?.fieldErrors?.email && (
            <p className="form-validation-error" id="email-error" role="alert">
              {actionData.fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <button className="button" type="submit">
            Agregar
          </button>
        </div>
      </Form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>Tienes que estar logueado para crear un cliente</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      <p>Pasó algo malo, intente de nuevo.</p>
    </div>
  );
}
