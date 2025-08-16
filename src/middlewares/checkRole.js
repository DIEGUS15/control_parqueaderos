export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

// Helpers para roles específicos
export const adminOnly = checkRole(["ADMIN"]);
export const adminAndSocio = checkRole(["ADMIN", "SOCIO"]);
export const socioOnly = checkRole(["SOCIO"]);
