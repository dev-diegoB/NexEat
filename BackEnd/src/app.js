import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const app = express();

import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";

dotenv.config({ quiet: true });

const frontUrl = process.env.FRONT_URL;

app.use(
  cors({
    origin: frontUrl,
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", frontUrl, "https://accounts.google.com"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://accounts.google.com",
        ],
        frameSrc: ["'self'", "https://accounts.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

app.use(express.json());
app.use(cookieparser());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
