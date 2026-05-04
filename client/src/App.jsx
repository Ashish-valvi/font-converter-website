import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!input) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();
      setOutput(data.converted);
    } catch (err) {
      console.error(err);
      alert("Error converting text");
    }

    setLoading(false);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "#fff",
      padding: "40px",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ color: "#38bdf8" }}>
        Valvi.io Converter
      </h1>

      <p style={{ opacity: 0.7 }}>
        DV TT Surekh → Unicode
      </p>

      {/* INPUT */}
      <div style={{ marginTop: "20px" }}>
        <textarea
          rows="8"
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            background: "#1e293b",
            color: "#fff",
            fontSize: "14px",
            overflowY: "auto"
          }}
          placeholder="Paste DV TT text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* BUTTONS */}
      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <button onClick={handleConvert} style={btnStyle}>
          {loading ? "Converting..." : "Convert"}
        </button>

        <button onClick={clearAll} style={btnSecondary}>
          Clear
        </button>

        <button onClick={copyOutput} style={btnSecondary}>
          Copy Output
        </button>
      </div>

      {/* OUTPUT */}
      <div style={{ marginTop: "25px" }}>
        <h3>Output</h3>

        <textarea
          rows="10"
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            background: "#020617",
            color: "#38bdf8",
            fontSize: "14px",
            overflowY: "auto"
          }}
          value={output}
          readOnly
        />
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  background: "#38bdf8",
  border: "none",
  borderRadius: "8px",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold"
};

const btnSecondary = {
  padding: "10px 20px",
  background: "#1e293b",
  border: "1px solid #38bdf8",
  borderRadius: "8px",
  color: "#38bdf8",
  cursor: "pointer"
};

export default App;