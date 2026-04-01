import express from "express";
import cors from "cors";
import animalsRouter from "./routes/animals.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/animals", animalsRouter);

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
