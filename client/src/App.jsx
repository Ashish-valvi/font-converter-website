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

  const [darkMode, setDarkMode] = useState(true);

  const isMobile = window.innerWidth < 768;

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

    <div
      style={{
        ...styles.page,

        background: darkMode
          ? "#020617"
          : "#f1f5f9",

        color: darkMode
          ? "#ffffff"
          : "#0f172a"
      }}
    >

      {/* =====================================
          NAVBAR
      ===================================== */}

      <div
        style={{
          ...styles.navbar,

          background: darkMode
            ? "#020617"
            : "#ffffff"
        }}
      >

        {/* LOGO */}

        <div style={styles.logoWrap}>

          <div>

            <div style={styles.logoText}>
              valvi.io
            </div>

            <div
              style={{
                ...styles.logoSub,

                color: darkMode
                  ? "#94a3b8"
                  : "#475569"
              }}
            >
              Unicode Technology
            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <div
          style={{
            ...styles.navLinks,
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile
              ? "center"
              : "flex-end"
          }}
        >

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
            About
          </button>

          <button
            style={styles.navBtn}
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode
              ? "☀ Light"
              : "🌙 Dark"}
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

            {/* HERO */}

            <div style={styles.hero}>

              <h1
                style={{
                  ...styles.title,
                  fontSize: isMobile
                    ? "52px"
                    : "90px"
                }}
              >
                Marathi Font
                <br />
                Converter
              </h1>

              <p
                style={{
                  ...styles.subtitle,

                  color: darkMode
                    ? "#cbd5e1"
                    : "#475569",

                  fontSize: isMobile
                    ? "18px"
                    : "24px"
                }}
              >
                Convert Legacy Marathi Fonts to Unicode
              </p>

            </div>

            {/* MODE SWITCH */}

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

            {/* =====================================
                TEXT MODE
            ===================================== */}

            {mode === "text" && (

              <div
                style={{
                  ...styles.card,

                  background: darkMode
                    ? "linear-gradient(180deg,#111827,#0f172a)"
                    : "#ffffff"
                }}
              >

                <textarea
                  style={{
                    ...styles.textarea,

                    background: darkMode
                      ? "#020617"
                      : "#f8fafc",

                    color: darkMode
                      ? "#ffffff"
                      : "#0f172a"
                  }}
                  placeholder="Paste legacy Marathi font text..."
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                />

                <div style={styles.row}>

                  <button
                    style={styles.primaryBtn}
                    onClick={handleConvert}
                  >
                    {loading
                      ? "Converting..."
                      : "Convert"}
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
                  style={{
                    ...styles.output,

                    background: darkMode
                      ? "#020617"
                      : "#f8fafc",

                    color: darkMode
                      ? "#38bdf8"
                      : "#0284c7"
                  }}
                  placeholder="Unicode output..."
                  value={output}
                  readOnly
                />

              </div>
            )}

            {/* =====================================
                FILE MODE
            ===================================== */}

            {mode === "file" && (

              <div
                style={{
                  ...styles.dropZone,

                  background: darkMode
                    ? "linear-gradient(180deg,#111827,#0f172a)"
                    : "#ffffff"
                }}

                onDragOver={(e) =>
                  e.preventDefault()
                }

                onDrop={handleDrop}
              >

                <h2
                  style={{
                    fontSize: isMobile
                      ? "34px"
                      : "42px"
                  }}
                >
                  Upload DOCX File
                </h2>

                <p
                  style={{
                    ...styles.uploadText,

                    color: darkMode
                      ? "#cbd5e1"
                      : "#475569"
                  }}
                >
                  Drag & Drop or Select File
                </p>

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(
                      e.target.files[0]
                    )
                  }
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

                      a.download =
                        "converted.docx";

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

        {/* ABOUT */}

        {page === "about" && (

          <div
            style={{
              ...styles.infoCard,

              background: darkMode
                ? "linear-gradient(180deg,#111827,#0f172a)"
                : "#ffffff"
            }}
          >

            <h2
              style={{
                fontSize: "42px",
                marginBottom: "30px"
              }}
            >
              About
            </h2>

            <p style={styles.aboutText}>
              .AV Converter 1.1.2
            </p>

            <p style={styles.aboutText}>
              Developer - Aashish Valvi
            </p>

            <p style={styles.aboutText}>
              Contact Us - contact@valvi.io
            </p>

          </div>
        )}

      </div>

      {/* FOOTER */}

      <footer
        style={{
          ...styles.footer,

          color: darkMode
            ? "#94a3b8"
            : "#475569"
        }}
      >
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
    fontFamily:
      "'Segoe UI', sans-serif",
    transition: "0.3s"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 28px",
    borderBottom: "1px solid #1e293b",
    flexWrap: "wrap",
    gap: "16px",

    position: "sticky",
    top: 0,
    zIndex: 100
  },

  logoWrap: {
    display: "flex",
    alignItems: "center"
  },

  logoText: {
    fontSize: "52px",
    fontWeight: "900",
    color: "#38bdf8",
    lineHeight: "50px"
  },

  logoSub: {
    fontSize: "14px",
    marginTop: "6px",
    letterSpacing: "1px"
  },

  navLinks: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },

  navBtn: {
    background: "#1e293b",
    color: "#ffffff",
    border: "1px solid #334155",
    padding: "12px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
    width: "100%",
    boxSizing: "border-box"
  },

  hero: {
    textAlign: "center",
    marginBottom: "40px",
    marginTop: "40px"
  },

  title: {
    color: "#38bdf8",
    lineHeight: "0.85",
    marginBottom: "22px",
    fontWeight: "900"
  },

  subtitle: {
    fontWeight: "600"
  },

  modeWrap: {
    display: "flex",
    gap: "14px",
    marginBottom: "30px",
    flexWrap: "wrap",
    justifyContent: "center"
  },

  modeBtn: {
    padding: "14px 26px",
    borderRadius: "18px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600"
  },

  activeModeBtn: {
    padding: "14px 26px",
    borderRadius: "18px",
    border: "none",
    background: "#38bdf8",
    color: "#000",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "18px"
  },

  card: {
    padding: "26px",
    borderRadius: "28px",
    border: "1px solid #1e293b",
    boxShadow:
      "0 0 40px rgba(0,0,0,0.12)"
  },

  textarea: {
    width: "100%",
    minHeight: "260px",
    borderRadius: "22px",
    border: "1px solid #334155",
    padding: "18px",
    fontSize: "17px",
    resize: "vertical",
    boxSizing: "border-box",
    outline: "none"
  },

  output: {
    width: "100%",
    minHeight: "280px",
    borderRadius: "22px",
    border: "1px solid #334155",
    padding: "18px",
    fontSize: "17px",
    marginTop: "20px",
    resize: "vertical",
    boxSizing: "border-box",
    outline: "none"
  },

  row: {
    display: "flex",
    gap: "14px",
    marginTop: "22px",
    flexWrap: "wrap"
  },

  primaryBtn: {
    background: "#38bdf8",
    color: "#000",
    border: "none",
    padding: "14px 24px",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "17px"
  },

  secondaryBtn: {
    background: "#1e293b",
    color: "#ffffff",
    border: "1px solid #475569",
    padding: "14px 24px",
    borderRadius: "18px",
    cursor: "pointer",
    fontSize: "17px"
  },

  downloadBtn: {
    marginTop: "24px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "16px 28px",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "18px"
  },

  dropZone: {
    border: "2px dashed #38bdf8",
    padding: "80px 20px",
    textAlign: "center",
    borderRadius: "28px",
    boxShadow:
      "0 0 40px rgba(0,0,0,0.12)"
  },

  uploadText: {
    fontSize: "24px",
    marginBottom: "20px"
  },

  fileName: {
    marginTop: "18px",
    color: "#38bdf8",
    fontSize: "18px",
    fontWeight: "700"
  },

  success: {
    color: "#22c55e",
    marginTop: "12px",
    fontWeight: "700"
  },

  infoCard: {
    padding: "40px",
    borderRadius: "28px",
    border: "1px solid #1e293b",
    boxShadow:
      "0 0 40px rgba(0,0,0,0.12)"
  },

  aboutText: {
    fontSize: "22px",
    marginBottom: "18px",
    lineHeight: "1.7"
  },

  footer: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    fontWeight: "600"
  }
};

export default App;