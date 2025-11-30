const jwt = require("jsonwebtoken");
const config = require("../config.json");
const SECRET = config.Jwt.Secret;

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
      }

      // Guardamos los datos del usuario
      req.user = user;

      // Validación de roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Acceso denegado (rol insuficiente)" });
      }

      next();
    });
  };
};
