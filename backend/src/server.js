import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "https://srijansaxena.github.io"
}));

app.use(express.json());

export default app;
