import { Client } from "@prisma/client";
import { Form } from "remix";

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
      <p className="font-bold text-xl mb-4">Cliente:</p>
      <p className="italic text-xl">{client.name}</p>
      <p>
        <span className="font-bold">Email de contacto: </span>
        <a
          className="underline"
          href={client.contactEmail}
          rel="noreferrer noopener"
          target="_blank"
        >
          {client.contactEmail}
        </a>
      </p>
      {isOwner && (
        <Form className="flex justify-end" method="post">
          <input name="_method" type="hidden" value="DELETE" />
          <button
            className="border-2 border-black px-2 rounded"
            disabled={!canDelete}
            type="submit"
          >
            Borrar
          </button>
        </Form>
      )}
    </div>
  );
}
