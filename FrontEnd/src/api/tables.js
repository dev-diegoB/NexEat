import axios from "./axios";

export const getTables = () => axios.get("/tables");

export const getTableById = (id) => axios.get(`/tables/${id}`);

export const createTable = (data) => axios.post("/tables", data);

export const updateTable = (id, data) => axios.put(`/tables/${id}`, data);

export const claimTable = (id, sessionId = null) =>
  axios.post(`/tables/${id}/claim`, {
    sessionId,
  });


export const validateTableSession = (id, sessionId) =>
  axios.get(`/tables/${id}/validate`, {
    params: { session: sessionId },
  });

export const keepAliveTable = (id, sessionId) =>
  axios.post(`/tables/${id}/keep-alive`, {
    session: sessionId,
  });

  export const changeTableStatus = (id, action, session = null) =>
    axios.patch(`/tables/${id}/status`, {
      action,
      session,
    });

