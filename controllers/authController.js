import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as Auth0Strategy } from "passport-auth0";
import 'dotenv/config';

// --- LISTA EN MEMORIA ---
const users = []; // List<User>

// --- CONFIGURACIÓN DE AUTH0 ---
passport.use(
  "auth0",
  new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {

    // Datos del usuario OAuth2
    const user = {
      Name: profile.displayName,
      Email: profile.emails?.[0]?.value ?? "no-email@unknown.com",
      Role: "user"
    };

    // --- Guardar en lista en memoria ---
    const exists = users.find(u => u.Email === user.Email);
    if (!exists) users.push(user);

    return done(null, user);
  }
));

// Serializar/deserializar usuario (necesario para Passport)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// --- LOGIN MOCK ---
export const loginMock = (req, res) => {
  const { username, password } = req.body;

  if (username === "user" && password === "1234") {
    const payload = { Name: "Usuario Mock", Email: "user@example.com", Role: "user" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  if (username === "admin" && password === "1234") {
    const payload = { Name: "Admin Mock", Email: "admin@example.com", Role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Credenciales inválidas" });
};

// --- LOGIN SOCIAL (Auth0 / Google) ---
export const loginAuth0 = passport.authenticate("auth0", {
  scope: "openid email profile"
});

export const callbackAuth0 = passport.authenticate("auth0", {
  failureRedirect: "/login",
  session: false
});

// Este handler genera el JWT INTERNO
export const auth0CallbackHandler = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });
  
  // Asegurar que el JWT contenga nombre/email y rol "user"
  const jwtPayload = {
    name: req.user.Name,
    email: req.user.Email,
    role: "user" // Rol por defecto explícito
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Devolver SOLO el JWT (más limpio)
  res.json({
    success: true,
    message: "OAuth2 login exitoso",
    jwt: token,
    user: jwtPayload
  });
};

// --- NUEVO ENDPOINT: GET /auth/external/callback ---
export const externalCallback = (req, res) => {
  try {
    // En un escenario real, aquí recibirías los datos del usuario autenticado
    // Por ahora simulamos que recibimos los datos del cuerpo de la petición
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ 
        message: "Se requieren nombre y email del usuario" 
      });
    }

    // Buscar si el usuario ya existe en memoria
    let user = users.find(u => u.Email === email);
    
    if (!user) {
      // Crear nuevo usuario con rol por defecto
      user = {
        Name: name,
        Email: email,
        Role: "user"
      };
      users.push(user);
    }

    // Emitir JWT interno con nombre/email y rol por defecto
    const tokenPayload = {
      name: user.Name,
      email: user.Email,
      role: user.Role
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { 
      expiresIn: "1h" 
    });

    // Devolver el JWT
    res.json({
      success: true,
      message: "Login externo exitoso",
      jwt: token,
      user: tokenPayload
    });

  } catch (error) {
    console.error("Error en external callback:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// --- NUEVO: LISTAR USUARIOS ---
export const listOAuthUsers = (req, res) => {
  res.json(users);
};

export default { 
  loginMock, 
  loginAuth0, 
  callbackAuth0, 
  auth0CallbackHandler,
  externalCallback, // <-- NUEVO
  listOAuthUsers
};