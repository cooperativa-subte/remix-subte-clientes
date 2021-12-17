export default function NuevoClienteRoute() {
  return (
    <div>
      <p>Agregar un cliente</p>
      <form method="post">
        <div>
          <label>
            Nombre: <input name="name" type="text" />
          </label>
        </div>
        <div>
          <label>
            Email de contacto: <input name="email" type="email" />
          </label>
        </div>
        <div>
          <button className="button" type="submit">
            Agregar
          </button>
        </div>
      </form>
    </div>
  );
}
