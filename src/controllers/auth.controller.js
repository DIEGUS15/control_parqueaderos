import { AuthService } from "../services/authService.js";

const authService = new AuthService();

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);

    res.cookie("token", token);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    authService.logout();

    res.cookie("token", "", {
      expires: new Date(0),
    });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
