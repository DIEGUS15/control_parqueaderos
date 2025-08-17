import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { UserRepository } from "../repositories/userRepository.js";
import { RegisterDto, LoginDto, AuthResponseDto } from "../dto/auth.dto.js";
import {
  UserAlreadyExistsException,
  UserNotFoundException,
  InvalidCredentialsException,
} from "../exceptions/authExceptions.js";

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(registerData) {
    const { fullname, email, password } = registerData;

    const userExists = await this.userRepository.existsByEmail(email);
    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    const registerDto = new RegisterDto({ fullname, email, password });
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.userRepository.create({
      ...registerDto,
      password: passwordHash,
    });

    return {
      user: new AuthResponseDto(newUser),
      message: "Usuario registrado correctamente",
    };
  }

  async login(loginData) {
    const loginDto = new LoginDto(loginData);

    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UserNotFoundException("User not found");
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new InvalidCredentialsException("Incorrect password");
    }

    const token = await createAccessToken({
      id: user.id,
      role: user.role,
    });

    return {
      user: new AuthResponseDto(user),
      token,
    };
  }

  logout() {
    return { success: true };
  }
}
