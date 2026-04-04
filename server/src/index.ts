import express from "express";
import cors from "cors";
import dotenv from "dotenv"; //miljövariabler

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
