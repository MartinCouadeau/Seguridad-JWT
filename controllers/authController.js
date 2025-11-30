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
  
  const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({
    message: "OAuth2 login exitoso",
    user: req.user,
    jwt: token
  });
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
  listOAuthUsers
};
