const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

app.listen(PORT, () => {
  console.log(`SharpEdge running on port ${PORT}`);
  console.log(`Files:`, fs.readdirSync(__dirname).filter(f => f.endsWith('.html') || f.endsWith('.js')).join(", "));
});
