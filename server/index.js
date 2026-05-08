const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

const app = express();

/* ================= CONFIG ================= */

const PORT = 5000;

// ✅ Normal Python now (NO UNO)
const PYTHON_CMD =
  process.platform === "win32"
    ? "python"
    : "python2";

// ✅ Folders
const uploadsDir = path.join(__dirname, "uploads");
const outputsDir = path.join(__dirname, "outputs");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir);
}

app.use(cors());

app.use(
  express.json({
    limit: "20mb"
  })
);

/* ================= MULTER ================= */

const upload = multer({
  dest: uploadsDir,

  limits: {
    fileSize: 20 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedMime =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (file.mimetype === allowedMime) {
      cb(null, true);
    } else {
      cb(new Error("Only DOCX files are allowed"));
    }
  }
});

/* ================= TEXT API ================= */

app.post("/convert", (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const id = crypto.randomUUID();

    const inputFile = path.join(
      outputsDir,
      `input_${id}.txt`
    );

    fs.writeFileSync(inputFile, text, "utf-8");

    const scriptPath = path.join(
      __dirname,
      "../python/converter.py"
    );

    exec(
      `${PYTHON_CMD} "${scriptPath}" "${inputFile}"`,
      {
        encoding: "utf-8",
        maxBuffer: 1024 * 1024 * 20,
        timeout: 1000 * 60 * 2
      },
      (err, stdout, stderr) => {

        if (fs.existsSync(inputFile)) {
          fs.unlinkSync(inputFile);
        }

        if (err) {
          console.error(stderr);

          return res.status(500).json({
            error: "Text conversion failed"
          });
        }

        res.json({
          converted: stdout.trim()
        });
      }
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error"
    });
  }
});

/* ================= FILE API ================= */

app.post("/upload", upload.single("file"), (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    // ✅ add extension
    const inputPath = req.file.path + ".docx";

    fs.renameSync(req.file.path, inputPath);

    const outputPath = path.join(
      outputsDir,
      `converted_${Date.now()}.docx`
    );

    const scriptPath = path.join(
      __dirname,
      "../python/convert_docx.py"
    );

    exec(
      `${PYTHON_CMD} "${scriptPath}" "${inputPath}" "${outputPath}"`,
      {
        encoding: "utf-8",
        maxBuffer: 1024 * 1024 * 50,
        timeout: 1000 * 60 * 5
      },
      (err, stdout, stderr) => {

        console.log(stdout);

        // cleanup uploaded file
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }

        if (err) {

          console.error(stderr);

          return res.status(500).json({
            error: "DOCX conversion failed"
          });
        }

        res.download(
          outputPath,
          "converted.docx",
          (downloadErr) => {

            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }

            if (downloadErr) {
              console.error(downloadErr);
            }
          }
        );
      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Server error"
    });
  }
});

/* ================= HEALTH ================= */

app.use(
  express.static(
    path.join(__dirname, "../client/dist")
  )
);

app.get(/.*/, (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../client/dist/index.html"
    )
  );

});

/* ================= START ================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});