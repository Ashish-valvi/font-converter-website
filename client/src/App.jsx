import { useState } from "react";

function App() {
  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const theme = darkMode ? dark : light;

  /* AGREEMENT */
  if (!accepted) {
    return (
      <div style={modal.overlay}>
        <div style={modal.card}>
          <h2>⚠ Important Notice</h2>
          <p>
            This application is under testing phase.<br />
            Please cross check output. Don't apply blindly.
          </p>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button style={modal.accept} onClick={() => setAccepted(true)}>
              Accept
            </button>
            <button style={modal.reject} onClick={() => window.close()}>
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* FUNCTIONS */
  const handleConvert = async () => {
    if (!input) return;
    setLoading(true);

    const res = await fetch("http://localhost:5000/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();
    setOutput(data.converted);
    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setDownloadUrl(url);

    setLoading(false);
  };

  return (
    <div style={theme.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={theme.title}>AV Font Converter</h1>
          <p style={theme.subtitle}>Convert Dhruv to Unicode</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button style={theme.secondaryBtn} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀" : "🌙"}
          </button>

          <button style={theme.secondaryBtn} onClick={() => setShowAbout(!showAbout)}>
            About US
          </button>
        </div>
      </div>

      <div style={styles.container}>

        {showAbout && (
          <div style={theme.aboutBox}>
            <b>AV Font Converter 1.0</b><br />
            Maintainer: Ashish Valvi<br />
            Contact: help@valvi.io<br />
            <a href="https://www.valvi.io" target="_blank">www.valvi.io</a>
          </div>
        )}

        <div style={styles.mode}>
          <button style={theme.primaryBtn} onClick={() => setMode("text")}>Text</button>
          <button style={theme.primaryBtn} onClick={() => setMode("file")}>File</button>
        </div>

        {mode === "text" && (
          <>
            <textarea
              style={theme.bigInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div style={styles.row}>
              <button style={theme.primaryBtn} onClick={handleConvert}>
                {loading ? "Converting..." : "Convert"}
              </button>

              <button style={theme.secondaryBtn} onClick={() => { setInput(""); setOutput(""); }}>
                Clear
              </button>

              <button style={theme.secondaryBtn} onClick={copyOutput}>
                Copy
              </button>
            </div>

            {copied && <span style={{ color: "#16a34a" }}>Copied!</span>}

            <textarea style={theme.bigOutput} value={output} readOnly />
          </>
        )}

        {mode === "file" && (
          <div
            style={theme.dropZone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <h2>📂 Drag & Drop File</h2>
            <p>or click to upload</p>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            {file && <p>📄 {file.name}</p>}

            <button style={theme.primaryBtn} onClick={handleFileUpload}>
              {loading ? "Processing..." : "Convert File"}
            </button>

            {downloadUrl && (
              <button style={theme.primaryBtn} onClick={() => {
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = "converted.docx";
                a.click();
              }}>
                Save File
              </button>
            )}
          </div>
        )}
      </div>

      <footer style={theme.footer}>
        © All rights reserved. Visit <a href="https://www.valvi.io">www.valvi.io</a>
      </footer>
    </div>
  );
}

/* LIGHT THEME (FIXED) */
const light = {
  page: { background: "#ffffff", minHeight: "100vh", color: "#0f172a" },

  title: { color: "#2563eb", fontWeight: "700" },
  subtitle: { color: "#475569" },

  bigInput: {
    width: "100%",
    height: "260px",
    padding: "15px",
    background: "#ffffff",
    color: "#0f172a",
    border: "2px solid #cbd5f5",
    borderRadius: "10px"
  },

  bigOutput: {
    width: "100%",
    height: "320px",
    padding: "15px",
    marginTop: "15px",
    background: "#f8fafc",
    color: "#0f172a",
    border: "2px solid #cbd5f5",
    borderRadius: "10px"
  },

  primaryBtn: {
    padding: "10px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  secondaryBtn: {
    padding: "10px 16px",
    background: "#ffffff",
    color: "#2563eb",
    border: "2px solid #2563eb",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
  },

  dropZone: {
    border: "2px dashed #2563eb",
    padding: "80px",
    textAlign: "center",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#0f172a"
  },

  footer: { textAlign: "center", padding: "20px", color: "#475569" },

  aboutBox: {
    background: "#f8fafc",
    padding: "12px",
    border: "2px solid #2563eb",
    borderRadius: "8px",
    marginBottom: "10px"
  }
};

/* DARK (unchanged) */
const dark = {
  page: { background: "#0f172a", minHeight: "100vh", color: "#fff" },
  title: { color: "#38bdf8" },
  subtitle: { opacity: 0.7 },

  bigInput: { width: "100%", height: "260px", background: "#1e293b", color: "#fff" },
  bigOutput: { width: "100%", height: "320px", background: "#020617", color: "#38bdf8" },

  primaryBtn: { padding: "10px", background: "#38bdf8", border: "none" },
  secondaryBtn: { padding: "10px", border: "1px solid #38bdf8", color: "#38bdf8" },

  dropZone: { border: "2px dashed #38bdf8", padding: "80px", textAlign: "center" },

  footer: { textAlign: "center", padding: "20px" },
  aboutBox: { padding: "10px", border: "1px solid #38bdf8" }
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", padding: "20px" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "20px" },
  mode: { display: "flex", gap: "10px", marginBottom: "20px" },
  row: { display: "flex", gap: "10px", marginTop: "10px" }
};

const modal = {
  overlay: { position: "fixed", width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "#111827", padding: "30px", borderRadius: "12px", color: "#fff" },
  accept: { padding: "10px 20px", background: "#22c55e", border: "none" },
  reject: { padding: "10px 20px", background: "#ef4444", border: "none" }
};

export default App;