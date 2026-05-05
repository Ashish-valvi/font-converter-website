const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ Allow production + local
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ✅ IMPORTANT: serve React build
app.use(express.static(path.join(__dirname, "client/build")));

app.post("/api/convert", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text required" });
  }

  const scriptPath = path.join(__dirname, "../python/converter.py");
  const inputFile = path.join(__dirname, "input.txt");

  fs.writeFileSync(inputFile, text, "utf-8");

  // ✅ FIX: use python3 for VPS
  const command = `python3 "${scriptPath}" "${inputFile}"`;

  exec(command, { encoding: "utf-8", maxBuffer: 1024 * 1024 * 20 }, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).json({ error: "Conversion failed" });
    }

    res.json({ converted: stdout.trim() });
  });
});

// ✅ OPTIONAL: file upload route (you were missing this)
app.post("/api/upload", (req, res) => {
  res.send("Upload not implemented yet");
});

// ✅ React fallback
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// ✅ PORT fix for production
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});