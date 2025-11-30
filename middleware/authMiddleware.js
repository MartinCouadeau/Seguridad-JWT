import jwt from "jsonwebtoken";
import 'dotenv/config';

export const jwtAuth = (...requiredRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token requerido" });
        }

        const token = authHeader.split(" ")[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            if (requiredRoles.length && !requiredRoles.includes(payload.Role)) {
                return res.status(403).json({ message: "No autorizado" });
            }

            req.user = payload;
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({ message: "Token inválido" });
        }
    };
};
