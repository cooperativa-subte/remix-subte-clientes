import { Client, Domain, Hosting } from "@prisma/client";
import { Form } from "remix";

export function ClientDisplay({
  client,
  isOwner,
  canDelete = true,
  domains = [],
  hostings = [],
}: {
  client: Pick<Client, "contactEmail" | "name">;
  isOwner: boolean;
  canDelete?: boolean;
  domains?: Domain[];
  hostings?: Hosting[];
}) {
  return (
    <div className="border rounded p-4 bg-gray-100">
      <p className="font-bold text-xl mb-4">Cliente:</p>
      <p className="italic text-xl">{client.name}</p>
      <p className="mb-4">
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
      {hostings.length > 0 && (
        <table className="table-fixed">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 w-48">Nombre Hosting</th>
              <th className="border border-gray-300 p-2 w-48">Vence</th>
            </tr>
          </thead>
          <tbody>
            {hostings.map((hosting) => (
              <tr key={hosting.id}>
                <td className="border border-gray-300 p-2">{hosting.serverName}</td>
                <td className="border border-gray-300 p-2">{hosting.expirationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {domains.length > 0 && (
        <table className="mt-4 table-fixed">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 w-48">Dominio</th>
              <th className="border border-gray-300 p-2 w-48">Vence</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.id}>
                <td className="border border-gray-300 p-2">{domain.domain}</td>
                <td className="border border-gray-300 p-2">{domain.expirationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isOwner && (
        <Form className="flex justify-end" method="post">
          <input name="_method" type="hidden" value="DELETE" />
          <button
            className="border-2 border-black px-4 py-1 rounded hover:bg-gray-700 hover:text-white"
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
