const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.post("/convert", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text required" });
  }

  const scriptPath = path.join(__dirname, "../python/converter.py");

  const inputFile = path.join(__dirname, "input.txt");

  // ✅ write text exactly as-is
  fs.writeFileSync(inputFile, text, "utf-8");

  const command = `python "${scriptPath}" "${inputFile}"`;

  exec(command, { encoding: "utf-8", maxBuffer: 1024 * 1024 * 20 }, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).json({ error: "Conversion failed" });
    }

    res.json({ converted: stdout.trim() });
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});