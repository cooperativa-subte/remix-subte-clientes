import { RiErrorWarningLine } from "react-icons/ri";
import { useCatch } from "remix";

export default function ProveedoresHostingIndexRoute() {
  return (
    <div>
      <p className="rounded-md bg-yellow-200 p-4">
        <RiErrorWarningLine className="mr-2 text-3xl" />
        Selecciona un proveedor para ver su información
      </p>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        <p>No hay ningún proveedor de hosting que mostrar</p>
      </div>
    );
  }
  throw new Error(`Hubo un error inesperado con el status ${caught.status}`);
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      <p>Ups, pasó algo malo. :(</p>
    </div>
  );
}
