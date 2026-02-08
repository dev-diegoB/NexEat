import { createContext, useContext, useState, useEffect } from "react";
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  claimTable,
  validateTableSession,
  keepAliveTable,
  changeTableStatus,
} from "../api/tables";

import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

export const TableContext = createContext();

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable debe usarse dentro de un TableProvider");
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const loadTables = async () => {
    try {
      const res = await getTables();
      setTables(res.data);
    } catch (error) {
      handleApiError(error, "Error cargando mesas", setErrors);
    } finally {
      setLoading(false);
    }
  };

  const getTable = async (id) => {
    try {
      const res = await getTableById(id);
      setCurrentTable(res.data);
      return res.data;
    } catch (error) {
      handleApiError(error, "Error obteniendo mesa", setErrors);
      return null;
    }
  };

  const addTable = async (data) => {
    try {
      const res = await createTable(data);
      setTables((prev) => [...prev, res.data]);
    } catch (error) {
      handleApiError(error, "Error creando mesa", setErrors);
    }
  };

  const editTable = async (id, data) => {
    try {
      const res = await updateTable(id, data);
      setTables((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      handleApiError(error, "Error actualizando mesa", setErrors);
    }
  };

  const claim = async (id) => {
    try {
      const existingSession = localStorage.getItem("tableSession");

      const res = await claimTable(id, existingSession);

      localStorage.setItem("tableSession", res.data.sessionId);
      localStorage.setItem("tableId", id);

      const table = await getTableById(id);
      setCurrentTable(table.data);

      return table.data;
    } catch (error) {
      handleApiError(error, "Error reclamando mesa", setErrors);
      return null;
    }
  };


  const validateSession = async (id) => {
    try {
      const session = localStorage.getItem("tableSession");
      if (!session) return false;

      const res = await validateTableSession(id, session);

      if (!res.data.valid) {
        localStorage.removeItem("tableSession");
        localStorage.removeItem("tableId");
        setCurrentTable(null);
        return false;
      }

      const table = await getTableById(id);
      setCurrentTable(table.data);

      return true;
    } catch (error) {
      handleApiError(error, "Error validando sesión", setErrors);
      return false;
    }
  };
const keepAlive = async () => {
  try {
    const id = localStorage.getItem("tableId");
    const session = localStorage.getItem("tableSession");

    if (!id || !session) return;
    if (!currentTable || currentTable.status !== "occupied") return;

    await keepAliveTable(id, session);
  } catch (error) {
    console.error("Error en keepAlive:", error);
  }
};

  const changeStatus = async (id, action, session = null) => {
    try {
      const res = await changeTableStatus(id, action, session);
      setTables((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      handleApiError(error, "Error cambiando estado", setErrors);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (!currentTable || currentTable.status !== "occupied") return;

    const interval = setInterval(() => {
      keepAlive();
    }, 60000);

    return () => clearInterval(interval);
  }, [currentTable]);


  useAutoClearErrors(errors, setErrors);

  return (
    <TableContext.Provider
      value={{
        tables,
        currentTable,
        loading,
        errors,

        loadTables,
        getTable,
        addTable,
        editTable,

        claim,
        validateSession,
        keepAlive,
        changeStatus,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
