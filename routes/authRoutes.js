const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Login
router.post("/login", authController.login);

// Endpoint accesible solo por usuarios con rol "user"
router.get("/usuario", authMiddleware(["user", "admin"]), (req, res) => {
  res.json({
    message: "Bienvenido usuario.",
    user: req.user
  });
});

// Endpoint accesible solo por administradores
router.get("/admin", authMiddleware(["admin"]), (req, res) => {
  res.json({
    message: "Bienvenido administrador.",
    user: req.user
  });
});

module.exports = router;