import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useTransition,
} from "remix";

import { ClientDisplay } from "~/components/client";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw new Response("No estás autenticado", { status: 401 });
  }

  return {};
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
  const transition = useTransition();

  if (transition.submission) {
    const name = transition.submission.formData.get("name");
    const email = transition.submission.formData.get("email");

    if (
      typeof name === "string" &&
      typeof email === "string" &&
      !validateClientName(name) &&
      !validateClientEmail(email)
    ) {
      return <ClientDisplay isOwner canDelete={false} client={{ name, contactEmail: email }} />;
    }
  }

  return (
    <div>
      <p className="text-xl font-bold">Agregar un cliente</p>
      <Form method="post">
        <div className="mt-4">
          <label className="font-bold">
            Nombre:{" "}
            <input
              aria-describedby={actionData?.fieldErrors?.name ? "name-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              className="inline-block w-full rounded border px-2"
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
            />
          </label>
          {actionData?.fieldErrors?.name && (
            <p className="text-red-600" id="name-error" role="alert">
              {actionData.fieldErrors.name}
            </p>
          )}
        </div>
        <div className="mt-2">
          <label className="font-bold">
            Email de contacto:{" "}
            <input
              aria-describedby={actionData?.fieldErrors?.email ? "email-error" : undefined}
              aria-invalid={Boolean(actionData?.fieldErrors?.email) || undefined}
              className="inline-block w-full rounded border px-2"
              defaultValue={actionData?.fields?.contactEmail}
              name="email"
              type="email"
            />
          </label>
          {actionData?.fieldErrors?.email && (
            <p className="text-red-600" id="email-error" role="alert">
              {actionData.fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <button
            className="mt-4 rounded border-2 border-black px-4 py-1 hover:bg-gray-700 hover:text-white"
            type="submit"
          >
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
        <p>Tienes que estar autenticado para usar la app</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error);

  return (
    <div className="error-container">
      <p>Ups, algo pasó mal. Inténtelo de nuevo.</p>
    </div>
  );
}
