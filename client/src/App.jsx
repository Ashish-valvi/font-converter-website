import { useState } from "react";

function App() {

  const [page, setPage] = useState("converter");

  const [mode, setMode] = useState("text");

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState("");

  const [copied, setCopied] = useState(false);

  /* =========================================
     TEXT CONVERT
  ========================================= */

  const handleConvert = async () => {

    if (!input) return;

    setLoading(true);

    try {

      const res = await fetch("/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: input
        })
      });

      const data = await res.json();

      setOutput(data.converted);

    } catch (err) {
      alert("Conversion failed");
    }

    setLoading(false);
  };

  /* =========================================
     COPY
  ========================================= */

  const copyOutput = () => {

    navigator.clipboard.writeText(output);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /* =========================================
     FILE DROP
  ========================================= */

  const handleDrop = (e) => {

    e.preventDefault();

    setFile(e.dataTransfer.files[0]);
  };

  /* =========================================
     FILE UPLOAD
  ========================================= */

  const handleFileUpload = async () => {

    if (!file) return;

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {

      const res = await fetch("/upload", {
        method: "POST",
        body: formData
      });

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);

    } catch (err) {

      alert("File conversion failed");
    }

    setLoading(false);
  };

  /* =========================================
     CLEAR FILE
  ========================================= */

  const clearFile = () => {

    setFile(null);

    setDownloadUrl("");
  };

  return (

    <div style={styles.page}>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <div style={styles.navbar}>

        <div style={styles.logo}>
          valvi.io
        </div>

        <div style={styles.navLinks}>

          <button
            style={styles.navBtn}
            onClick={() => setPage("converter")}
          >
            Converter
          </button>

          <button
            style={styles.navBtn}
            onClick={() => setPage("about")}
          >
            About Us
          </button>

          <button
            style={styles.navBtn}
            onClick={() => setPage("register")}
          >
            Register
          </button>

        </div>
      </div>

      {/* =====================================
          MAIN
      ===================================== */}

      <div style={styles.container}>

        {/* =================================
            CONVERTER PAGE
        ================================= */}

        {page === "converter" && (

          <>

            <div style={styles.hero}>

              <h1 style={styles.title}>
                Marathi Font Converter
              </h1>

              <p style={styles.subtitle}>
                Convert Legacy Marathi Fonts to Unicode
              </p>

            </div>

            {/* ============================
                MODE SWITCH
            ============================ */}

            <div style={styles.modeWrap}>

              <button
                style={
                  mode === "text"
                    ? styles.activeModeBtn
                    : styles.modeBtn
                }
                onClick={() => setMode("text")}
              >
                Text Converter
              </button>

              <button
                style={
                  mode === "file"
                    ? styles.activeModeBtn
                    : styles.modeBtn
                }
                onClick={() => setMode("file")}
              >
                File Converter
              </button>

            </div>

            {/* ============================
                TEXT MODE
            ============================ */}

            {mode === "text" && (

              <div style={styles.card}>

                <textarea
                  style={styles.textarea}
                  placeholder="Paste legacy Marathi font text..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                <div style={styles.row}>

                  <button
                    style={styles.primaryBtn}
                    onClick={handleConvert}
                  >
                    {loading ? "Converting..." : "Convert"}
                  </button>

                  <button
                    style={styles.secondaryBtn}
                    onClick={() => {
                      setInput("");
                      setOutput("");
                    }}
                  >
                    Clear
                  </button>

                  <button
                    style={styles.secondaryBtn}
                    onClick={copyOutput}
                  >
                    Copy
                  </button>

                </div>

                {copied && (
                  <p style={styles.success}>
                    Copied Successfully
                  </p>
                )}

                <textarea
                  style={styles.output}
                  placeholder="Unicode output..."
                  value={output}
                  readOnly
                />

              </div>
            )}

            {/* ============================
                FILE MODE
            ============================ */}

            {mode === "file" && (

              <div
                style={styles.dropZone}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >

                <h2>Upload DOCX File</h2>

                <p>
                  Drag & Drop or Select File
                </p>

                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {file && (
                  <p style={styles.fileName}>
                    📄 {file.name}
                  </p>
                )}

                <div style={styles.row}>

                  <button
                    style={styles.primaryBtn}
                    onClick={handleFileUpload}
                  >
                    {loading
                      ? "Processing..."
                      : "Convert File"}
                  </button>

                  <button
                    style={styles.secondaryBtn}
                    onClick={clearFile}
                  >
                    Clear
                  </button>

                </div>

                {downloadUrl && (

                  <button
                    style={styles.downloadBtn}
                    onClick={() => {

                      const a =
                        document.createElement("a");

                      a.href = downloadUrl;

                      a.download = "converted.docx";

                      a.click();
                    }}
                  >
                    Download File
                  </button>

                )}

              </div>
            )}

          </>
        )}

        {/* =================================
            ABOUT
        ================================= */}

        {page === "about" && (

          <div style={styles.infoCard}>

            <h2>About Us</h2>

            <p>
              valvi.io provides Marathi font
              conversion tools for Unicode,
              document conversion and
              publishing workflows.
            </p>

            <p>
              Developed by Ashish Valvi
            </p>

          </div>
        )}

        {/* =================================
            REGISTER
        ================================= */}

        {page === "register" && (

          <div style={styles.infoCard}>

            <h2>Register</h2>

            <p>
              Registration module coming soon.
            </p>

          </div>
        )}

      </div>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer style={styles.footer}>
        © 2026 valvi.io — All Rights Reserved
      </footer>

    </div>
  );
}

/* =========================================
   STYLES
========================================= */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    fontFamily: "Arial"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #1e293b",
    flexWrap: "wrap"
  },

  logo: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#38bdf8"
  },

  navLinks: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  navBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #334155",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px"
  },

  hero: {
    textAlign: "center",
    marginBottom: "30px"
  },

  title: {
    fontSize: "42px",
    color: "#38bdf8"
  },

  subtitle: {
    opacity: 0.8
  },

  modeWrap: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  modeBtn: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#fff",
    cursor: "pointer"
  },

  activeModeBtn: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#38bdf8",
    color: "#000",
    cursor: "pointer",
    fontWeight: "700"
  },

  card: {
    background: "#111827",
    padding: "20px",
    borderRadius: "16px"
  },

  textarea: {
    width: "100%",
    height: "220px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    padding: "14px",
    fontSize: "16px",
    resize: "vertical"
  },

  output: {
    width: "100%",
    height: "260px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#38bdf8",
    padding: "14px",
    fontSize: "16px",
    marginTop: "20px",
    resize: "vertical"
  },

  row: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap"
  },

  primaryBtn: {
    background: "#38bdf8",
    color: "#000",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700"
  },

  secondaryBtn: {
    background: "#1e293b",
    color: "#fff",
    border: "1px solid #334155",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  downloadBtn: {
    marginTop: "20px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "14px 22px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700"
  },

  dropZone: {
    background: "#111827",
    border: "2px dashed #38bdf8",
    padding: "60px 20px",
    textAlign: "center",
    borderRadius: "16px"
  },

  fileName: {
    marginTop: "14px",
    color: "#38bdf8"
  },

  success: {
    color: "#22c55e",
    marginTop: "10px"
  },

  infoCard: {
    background: "#111827",
    padding: "30px",
    borderRadius: "16px"
  },

  footer: {
    textAlign: "center",
    padding: "30px",
    opacity: 0.7
  }
};

export default App;