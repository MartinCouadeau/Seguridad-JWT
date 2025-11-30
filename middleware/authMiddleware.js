import jwt from "jsonwebtoken";
import 'dotenv/config';

export const jwtAuth = (...requiredRoles) => { // acepta 1 o más roles
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token requerido" });
        }

        const token = authHeader.split(" ")[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            // Si se pasan roles, revisamos si el rol del usuario está incluido
            if (requiredRoles.length && !requiredRoles.includes(payload.Role)) {
                return res.status(403).json({ message: "No autorizado" });
            }

            req.user = payload;
            next();
        } catch (err) {
            console.error(err); // para debugging
            return res.status(401).json({ message: "Token inválido" });
        }
    };
};
