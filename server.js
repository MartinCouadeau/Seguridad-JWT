import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protected.js";
import passport from "passport";

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/auth", protectedRoutes);

app.listen(3001, () => console.log("Server running on port 3001"));