import React, { useState } from "react";

export default function Creatives() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [model, setModel] = useState("openai");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!product.trim() || !audience.trim()) return;

    setLoading(true);
    setResult("");
    try {
      const resp = await fetch("/api/creatives/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, audience, model }),
      });
      if (!resp.ok) throw new Error("Generation failed");
      const data = await resp.json();
      setResult(data.text || JSON.stringify(data));
    } catch (err) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>AI Creative Generator</h2>
      <form onSubmit={handleGenerate} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
        <label>
          <div>Product</div>
          <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="SmartWatch Pro"
                 style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} required />
        </label>
        <label>
          <div>Audience</div>
          <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="fitness enthusiasts in Mumbai"
                 style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }} required />
        </label>
        <label>
          <div>Model</div>
          <select value={model} onChange={(e) => setModel(e.target.value)}
                  style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }}>
            <option value="openai">OpenAI</option>
            <option value="minimax">MiniMax (stub)</option>
          </select>
        </label>
        <button type="submit" disabled={loading}
                style={{ padding: "10px 14px", borderRadius: 6, background: "#1f6feb", color: "white", border: 0 }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>Result</h3>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f8fa", padding: 12, borderRadius: 6 }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
