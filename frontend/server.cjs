const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`ShellQuest frontend running on port ${port}`);
});