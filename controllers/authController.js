const jwt = require("jsonwebtoken");
const config = require("../config.json");

const SECRET = config.Jwt.Secret;

const mockUser = {
  username: "admin",
  password: "1234"
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username || password !== mockUser.password) {
    return res.status(401).json({ error: "Usuario o contraseña inválidos" });
  }

  const token = jwt.sign(
    {
      sub: username,
      iat: Math.floor(Date.now() / 1000)
    },
    SECRET,
    { expiresIn: "15m" }
  );

  return res.json({ token });
};
