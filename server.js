const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

const PORT = 3001;
app.listen(PORT, () => console.log("Servidor escuchando en http://localhost:" + PORT));