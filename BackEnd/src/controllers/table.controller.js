import Table from "../models/table.model.js";
import { v4 as uuid } from "uuid";

const PREPAY_MINUTES = 10;
const CONSUME_MINUTES = 30;

const isSessionExpired = (session) => {
  return !session || new Date(session.expiresAt) < new Date();
};

export const createTable = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Es necesario un nombre para la mesa" });
    }

    const exists = await Table.findOne({ name });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Ya existe una mesa con este nombre" });
    }

    const table = new Table({ name });
    await table.save();

    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!table) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ order: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeTableStatus = async (req, res) => {
  try {
    const { action, session } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    switch (action) {
      case "disable": {
        if (table.status !== "free") {
          return res.status(400).json({
            message: "No se puede deshabilitar una mesa en uso",
          });
        }
        table.status = "disabled";
        break;
      }

      case "activate": {
        if (table.status !== "disabled") {
          return res.status(400).json({
            message: "Solo se puede activar una mesa deshabilitada",
          });
        }
        table.status = "free";
        break;
      }

      case "release": {
        if (!table.currentSession) {
          return res.status(400).json({ message: "Mesa ya libre" });
        }

        if (table.currentSession.sessionId !== session) {
          return res.status(403).json({ message: "No autorizado" });
        }

        table.status = "free";
        table.currentSession = null;
        break;
      }

      default:
        return res.status(400).json({ message: "Acción inválida" });
    }

    await table.save();
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const claimTable = async (req, res) => {
  try {
    const tableId = req.params.id;
    const now = new Date();
    const { sessionId: incomingSessionId } = req.body;

    const table = await Table.findById(tableId);

    if (!table) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    if (table.status === "disabled") {
      return res.status(400).json({ message: "Mesa deshabilitada" });
    }

    if (
      table.currentSession &&
      new Date(table.currentSession.expiresAt) < now
    ) {
      table.status = "free";
      table.currentSession = null;
      await table.save();
    }

    if (table.status !== "free") {
      return res.status(409).json({ message: "Mesa no disponible" });
    }

    if (incomingSessionId) {
      const activeTable = await Table.findOne({
        "currentSession.sessionId": incomingSessionId,
        status: { $ne: "free" },
      });

      if (activeTable) {
        return res.status(409).json({
          message: "Esta sesión ya tiene una mesa activa",
        });
      }
    }

    const sessionId = incomingSessionId || uuid();

    table.status = "waiting_payment";
    table.currentSession = {
      sessionId,
      claimedAt: now,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + PREPAY_MINUTES * 60000),
    };

    await table.save();

    res.json({
      tableId: table._id,
      sessionId,
      expiresAt: table.currentSession.expiresAt,
      status: table.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateSession = async (req, res) => {
  try {
    const { session } = req.query;
    const table = await Table.findById(req.params.id);

    if (!table || !table.currentSession) {
      return res.json({ valid: false });
    }

    if (table.currentSession.sessionId !== session) {
      return res.json({ valid: false });
    }

    if (isSessionExpired(table.currentSession)) {
      table.status = "free";
      table.currentSession = null;
      await table.save();
      return res.json({ valid: false });
    }

    table.currentSession.lastActivityAt = new Date();
    await table.save();

    res.json({ valid: true, status: table.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const keepAlive = async (req, res) => {
  try {
    const { session } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table || !table.currentSession) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    if (table.currentSession.sessionId !== session) {
      return res.status(403).json({ message: "Sesión inválida" });
    }

    if (table.status !== "occupied") {
      return res.status(400).json({ message: "Mesa no está en consumo" });
    }

    const now = new Date();

    table.currentSession.lastActivityAt = now;
    table.currentSession.expiresAt = new Date(
      now.getTime() + CONSUME_MINUTES * 60000,
    );

    await table.save();

    res.json({ expiresAt: table.currentSession.expiresAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
