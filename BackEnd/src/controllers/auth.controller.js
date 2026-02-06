import User from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import { CreateAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const TOKEN_SECRET = process.env.JWT_SECRET;

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Token requerido" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    let userFound = await User.findOne({ googleId });

    if (!userFound) {
      userFound = await User.create({
        googleId,
        email,
        name,
        picture,
        role: "client",
        points: 0,
        isActive: true,
      });
    } else {
      if (picture && userFound.picture !== picture) {
        userFound.picture = picture;
        await userFound.save();
      }
    }

    if (!userFound.isActive) {
      return res.status(403).json({ message: "Usuario desactivado" });
    }

    const token = await CreateAccessToken({
      id: userFound._id,
      role: userFound.role,
    });

res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

    res.json({
      id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      picture: userFound.picture,
      role: userFound.role,
      points: userFound.points,
    });
  } catch (error) {
    res.status(500).json({ message: "Error autenticando con Google" });
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "No autorizado" });

    res.json({
      id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      picture: userFound.picture,
      role: userFound.role,
      points: userFound.points,
    });
  });
};
