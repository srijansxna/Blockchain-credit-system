import express from "express";
import cors from "cors";

import creditRoutes from "./routes/credit.routes.js";
// blockchainRoutes can stay, but proof page is paused
// import blockchainRoutes from "./routes/blockchain.routes.js";

const app = express();

// 🔑 ENABLE CORS
app.use(cors());

// JSON parsing
app.use(express.json());

// Routes
app.use("/credit", creditRoutes);
// app.use("/blockchain", blockchainRoutes);

export default app;
