const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND = "https://sharpedge-backend-production.up.railway.app";

app.use(express.json());
app.use(express.static(__dirname));

// Proxy odds to avoid CORS
app.get("/proxy/odds", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND}/api/odds`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Proxy chat to avoid CORS
app.post("/proxy/chat", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await fetch(`${BACKEND}/api/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": token })
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Proxy auth
app.post("/proxy/auth/:action", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND}/api/auth/${req.params.action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "landing.html")));
app.get("/app", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "landing.html")));

app.listen(PORT, () => {
  console.log(`SharpEdge running on port ${PORT}`);
  console.log(`Files in directory:`, fs.readdirSync(__dirname).join(", "));
});
