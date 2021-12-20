import { Client } from "@prisma/client";
import { Form, Link } from "remix";

export function ClientDisplay({
  client,
  isOwner,
  canDelete = true,
}: {
  client: Pick<Client, "contactEmail" | "name">;
  isOwner: boolean;
  canDelete?: boolean;
}) {
  return (
    <div>
      <p>Esta es la info del cliente</p>
      <p>Nombre: {client.name}</p>
      <Link to=".">{client.name} Permalink</Link>
      <p>
        Email de contacto:{" "}
        <a href={client.contactEmail} rel="noreferrer noopener" target="_blank">
          {client.contactEmail}
        </a>
      </p>
      {isOwner && (
        <Form method="post">
          <input name="_method" type="hidden" value="delete" />
          <button className="button" disabled={!canDelete} type="submit">
            Borrar
          </button>
        </Form>
      )}
    </div>
  );
}
