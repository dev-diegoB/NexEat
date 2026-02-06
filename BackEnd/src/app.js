import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const app = express();

import dotenv from "dotenv";

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
        connectSrc: ["'self'", frontUrl],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

app.use(express.json());
app.use(cookieparser());

export default app;
