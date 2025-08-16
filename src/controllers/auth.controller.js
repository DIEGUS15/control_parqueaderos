import prisma from "../db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const userFound = await prisma.user.findUnique({
      where: { email },
    });

    if (userFound) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        password: passwordHash,
        role: "SOCIO",
      },
    });

    res.status(201).json({
      id: newUser.id,
      fullname: newUser.fullname,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await prisma.user.findUnique({
      where: { email },
    });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({
      id: userFound.id,
      role: userFound.role,
    });

    res.cookie("token", token);

    res.json({
      id: userFound.id,
      fullname: userFound.fullname,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
