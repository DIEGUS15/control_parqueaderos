export const errorHandler = (error, req, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
    });
  }

  console.error("Error no controlado:", error);
  return res.status(500).json({
    error: "InternalServerError",
    message: "Error interno del servidor",
  });
};
