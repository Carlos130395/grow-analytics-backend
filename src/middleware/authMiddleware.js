const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token no proporcionado o formato incorrecto." });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
    req.user = verified; // Almacenar los datos verificados
    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    res.status(403).json({ error: "Token no válido o expirado." }); // Responder con un estado 403 (Forbidden) en lugar de 400
  }
};

module.exports = authMiddleware;
