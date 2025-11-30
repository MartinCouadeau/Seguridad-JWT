import { Router } from "express";
import { jwtAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/usuario", jwtAuth("user", "admin"), (req, res) => {
    res.json({ 
        message: `Hola ${req.user.Name}, eres un usuario`,
        user: req.user
    });
});

router.get("/admin", jwtAuth("admin"), (req, res) => {
    res.json({ 
        message: `Hola ${req.user.Name}, eres un admin`,
        admin: req.user 
    });
});

export default router;