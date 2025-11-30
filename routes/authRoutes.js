import express from "express";
import session from "express-session";
import passport from "passport";
import authController from "../controllers/authController.js";

const router = express.Router();

router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.post("/login", authController.loginMock);

router.get("/login/auth0", authController.loginAuth0);

router.get("/users", authController.listOAuthUsers);

router.get(
  "/external/callback",
  authController.callbackAuth0,
  authController.auth0CallbackHandler
);

router.get("/login-failed", (req, res) => {
  res.status(401).json({ message: "Falló el login con Auth0/Google" });
});

export default router;