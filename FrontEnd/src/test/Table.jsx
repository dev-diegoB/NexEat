import { useEffect, useState } from "react";
import { useTable } from "../context/TableContext";

function Table() {
  const {
    tables,
    currentTable,
    loading,
    errors,
    loadTables,
    addTable,
    editTable,
    getTable,
    claim,
    validateSession,
    changeStatus,
  } = useTable();

  const [form, setForm] = useState({ name: "" });
  const [selectedTableId, setSelectedTableId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTables();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTable = () => {
    if (!form.name) return;
    addTable({ name: form.name });
    setForm({ name: "" });
  };

  const handleEdit = (table) => {
    const name = window.prompt("Nuevo nombre", table.name);
    if (!name || name === table.name) return;
    editTable(table._id, { name });
  };

  const handleClaim = async (tableId) => {
    const existingSession = localStorage.getItem("tableSession");

    if (existingSession) {
      setMessage("Ya tienes una mesa activa, libera la anterior");
      return;
    }

    const table = await claim(tableId);
    if (table) {
      setMessage("Mesa reclamada correctamente");
    }
  };

  const handleRelease = async (tableId) => {
    const session = localStorage.getItem("tableSession");
    if (!session) return;

    await changeStatus(tableId, "release", session);
    localStorage.removeItem("tableSession");
    localStorage.removeItem("tableId");
    setMessage("Mesa liberada");
  };

  const handleValidate = async () => {
    if (!selectedTableId) return;
    await validateSession(selectedTableId);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Panel de pruebas de mesas</h2>

      {loading && <p>Cargando...</p>}

      {message && <p>{message}</p>}

      {errors.map((e, i) => (
        <p key={i}>{e}</p>
      ))}

      <div className="mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre de la mesa"
        />
        <button onClick={handleAddTable}>Crear mesa</button>
      </div>

      <ul className="space-y-4">
        {tables.map((t) => (
          <li key={t._id}>
            <div>
              {t.name} · estado: {t.status}
            </div>

            <div className="space-x-2 mt-2">
              <button onClick={() => getTable(t._id)}>Obtener</button>

              {t.status === "free" && (
                <>
                  <button onClick={() => handleClaim(t._id)}>Reclamar</button>
                  <button onClick={() => changeStatus(t._id, "disable")}>
                    Deshabilitar
                  </button>
                </>
              )}

              {(t.status === "waiting_payment" || t.status === "occupied") && (
                <button onClick={() => handleRelease(t._id)}>Liberar</button>
              )}

              {t.status === "disabled" && (
                <button onClick={() => changeStatus(t._id, "activate")}>
                  Activar
                </button>
              )}

              <button onClick={() => handleEdit(t)}>Editar</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <input
          placeholder="ID de la mesa"
          value={selectedTableId}
          onChange={(e) => setSelectedTableId(e.target.value)}
        />
        <button onClick={handleValidate}>Validar sesión</button>
      </div>

      {currentTable && (
        <div className="mt-4">
          Mesa actual: {currentTable.name} · {currentTable.status}
        </div>
      )}
    </div>
  );
}

export default Table;
