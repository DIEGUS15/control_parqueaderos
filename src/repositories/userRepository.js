import prisma from "../db.js";
import { User } from "../entities/user.js";

export class UserRepository {
  async findByEmail(email) {
    const userData = await prisma.user.findUnique({
      where: { email },
    });

    return userData ? new User(userData) : null;
  }

  async findById(id) {
    const userData = await prisma.user.findUnique({
      where: { id },
    });

    return userData ? new User(userData) : null;
  }

  async create(userData) {
    const newUserData = await prisma.user.create({
      data: userData,
    });

    return new User(newUserData);
  }

  async existsByEmail(email) {
    const count = await prisma.user.count({
      where: { email },
    });

    return count > 0;
  }
}
