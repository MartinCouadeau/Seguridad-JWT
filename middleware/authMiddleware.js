const jwt = require("jsonwebtoken");
const config = require("../config.json");

const SECRET = config.Jwt.Secret;

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split("")[1];

  if (!token) {
    return res.status(401).json({ error: "Tokenno proporcionado" });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    req.user = user;
    next();
  });
};
