const jwt = require("jsonwebtoken");
const config = require("../config.json");

const SECRET = config.Jwt.Secret;

// Usuarios mock
const users = [
  {
    username: "admin",
    password: "1234",
    name: "Administrador",
    email: "admin@example.com",
    role: "admin"
  },
  {
    username: "user",
    password: "1234",
    name: "Usuario Normal",
    email: "user@example.com",
    role: "user"
  }
];

exports.login = (req, res) => {
  const { username, password } = req.body;

  const found = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!found) {
    return res.status(401).json({ error: "Usuario o contraseña inválidos" });
  }

  const token = jwt.sign(
    {
      name: found.name,
      email: found.email,
      role: found.role,
      sub: found.username,
      iat: Math.floor(Date.now() / 1000) // issued at
    },
    SECRET,
    { expiresIn: "15m" }
  );

  return res.json({ token });
};