import dotenv from "dotenv";
dotenv.config();
console.log("SERVER.JS LOADED");
import app from "./app.js";

console.log("BANK_MASTER_KEY loaded:", !!process.env.BANK_MASTER_KEY);

const PORT = process.env.PORT || 3000;;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
