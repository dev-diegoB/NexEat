import http from "http";
import app from "./app.js";
import { connectDB } from "./db.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const port = process.env.PORT;
const main = async () => {
  try {
    console.log("[INIT] Inicio del proceso de arranque del servidor...");

    await connectDB();

    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(
        `[SERVER] Servidor HTTP está activo en el puerto ${port}`,
      );
    });

    console.log("[INIT] Proceso de inicialización completado con éxito.");
  } catch (error) {
    console.error("[INIT] Error durante inicialización:", error);
    process.exit(1);
  }
};

main();