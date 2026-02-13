import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 3000;

console.log("Starting server...");
console.log("PORT from Render:", process.env.PORT);
console.log("Final PORT used:", PORT);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
