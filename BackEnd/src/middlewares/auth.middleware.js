import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const TOKEN_SECRET = process.env.JWT_SECRET;

export const auth =
  (roles = null) =>
  (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: "Token inválido" });

      if (roles && !roles.includes(user.role))
        return res.status(403).json({ message: "No tienes permisos" });

      req.user = user;
      next();
    });
  };
