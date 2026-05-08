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
          : "#f8fafc",
        color: darkMode
          ? "#ffffff"
          : "#020617"
      }}
    >

      {/* =====================================
          NAVBAR
      ===================================== */}

      <div style={styles.navbar}>

        {/* LOGO */}

        <div style={styles.logoWrap}>

          <div style={styles.logoIcon}>
            V
          </div>

          <div>

            <div style={styles.logoText}>
              valvi.io
            </div>

            <div style={styles.logoSub}>
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
            About Us
          </button>

          <button
            style={styles.navBtn}
            onClick={() => setPage("register")}
          >
            Register
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
                    ? "58px"
                    : "82px"
                }}
              >
                Marathi Font
                <br />
                Converter
              </h1>

              <p
                style={{
                  ...styles.subtitle,
                  fontSize: isMobile
                    ? "16px"
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

              <div style={styles.card}>

                <textarea
                  style={styles.textarea}
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
                  style={styles.output}
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
                style={styles.dropZone}
                onDragOver={(e) =>
                  e.preventDefault()
                }
                onDrop={handleDrop}
              >

                <h2
                  style={{
                    fontSize: isMobile
                      ? "36px"
                      : "42px"
                  }}
                >
                  Upload DOCX File
                </h2>

                <p style={styles.uploadText}>
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

          <div style={styles.infoCard}>

            <h2>About valvi.io</h2>

            <p>
              valvi.io builds Unicode
              conversion tools for Marathi,
              Hindi and Indian language
              publishing workflows.
            </p>

            <p>
              We provide DOCX conversion,
              legacy font conversion,
              Unicode migration and desktop
              publishing tools.
            </p>

            <p>
              Developed by Ashish Valvi
            </p>

          </div>
        )}

        {/* REGISTER */}

        {page === "register" && (

          <div style={styles.infoCard}>

            <h2>Register</h2>

            <p>
              User registration system
              coming soon.
            </p>

          </div>
        )}

      </div>

      {/* FOOTER */}

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
    fontFamily:
      "'Segoe UI', sans-serif",
    transition: "0.3s"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid #1e293b",
    flexWrap: "wrap",
    gap: "16px"
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  logoIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#38bdf8,#2563eb)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    fontSize: "30px",
    fontWeight: "900",
    color: "#fff",

    boxShadow:
      "0 0 25px rgba(56,189,248,0.4)"
  },

  logoText: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#38bdf8",
    lineHeight: "34px"
  },

  logoSub: {
    fontSize: "12px",
    opacity: 0.7,
    letterSpacing: "1px",
    marginTop: "3px"
  },

  navLinks: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  navBtn: {
    background:
      "rgba(255,255,255,0.05)",

    color: "#fff",

    border: "1px solid #334155",

    padding: "12px 18px",

    borderRadius: "14px",

    cursor: "pointer",

    fontSize: "15px",

    transition: "0.3s"
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
    marginTop: "30px"
  },

  title: {
    color: "#38bdf8",
    lineHeight: "0.85",
    marginBottom: "20px",
    fontWeight: "800"
  },

  subtitle: {
    opacity: 0.8,
    fontWeight: "500"
  },

  modeWrap: {
    display: "flex",
    gap: "14px",
    marginBottom: "30px",
    flexWrap: "wrap",
    justifyContent: "center"
  },

  modeBtn: {
    padding: "14px 24px",
    borderRadius: "16px",
    border: "1px solid #334155",
    background:
      "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "18px"
  },

  activeModeBtn: {
    padding: "14px 24px",
    borderRadius: "16px",
    border: "none",
    background: "#38bdf8",
    color: "#000",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "18px"
  },

  card: {
    background:
      "linear-gradient(180deg,#111827,#0f172a)",

    padding: "24px",

    borderRadius: "24px",

    border: "1px solid #1e293b",

    boxShadow:
      "0 0 30px rgba(0,0,0,0.3)"
  },

  textarea: {
    width: "100%",
    minHeight: "260px",

    borderRadius: "20px",

    border: "1px solid #334155",

    background: "#020617",

    color: "#fff",

    padding: "18px",

    fontSize: "17px",

    resize: "vertical",

    boxSizing: "border-box",

    outline: "none"
  },

  output: {
    width: "100%",
    minHeight: "280px",

    borderRadius: "20px",

    border: "1px solid #334155",

    background: "#020617",

    color: "#38bdf8",

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
    marginTop: "20px",
    flexWrap: "wrap"
  },

  primaryBtn: {
    background: "#38bdf8",

    color: "#000",

    border: "none",

    padding: "14px 24px",

    borderRadius: "16px",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "17px"
  },

  secondaryBtn: {
    background:
      "rgba(255,255,255,0.05)",

    color: "#fff",

    border: "1px solid #475569",

    padding: "14px 24px",

    borderRadius: "16px",

    cursor: "pointer",

    fontSize: "17px"
  },

  downloadBtn: {
    marginTop: "24px",

    background: "#22c55e",

    color: "#fff",

    border: "none",

    padding: "16px 28px",

    borderRadius: "16px",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "18px"
  },

  dropZone: {
    background:
      "linear-gradient(180deg,#111827,#0f172a)",

    border: "2px dashed #38bdf8",

    padding: "80px 20px",

    textAlign: "center",

    borderRadius: "28px",

    boxShadow:
      "0 0 30px rgba(0,0,0,0.3)"
  },

  uploadText: {
    fontSize: "24px",
    marginBottom: "20px"
  },

  fileName: {
    marginTop: "18px",
    color: "#38bdf8",
    fontSize: "18px"
  },

  success: {
    color: "#22c55e",
    marginTop: "12px",
    fontWeight: "600"
  },

  infoCard: {
    background:
      "linear-gradient(180deg,#111827,#0f172a)",

    padding: "40px",

    borderRadius: "24px",

    border: "1px solid #1e293b"
  },

  footer: {
    textAlign: "center",
    padding: "40px",
    opacity: 0.7,
    fontSize: "18px"
  }
};

export default App;