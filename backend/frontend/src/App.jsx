import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Creatives from "./pages/Creatives.jsx";
import Campaigns from "./pages/Campaigns.jsx";

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>DSP Frontend ✅</h1>
      <p>Home. Use the nav to open modules.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside style={{ width: 220, padding: 16, borderRight: "1px solid #eee" }}>
          <h3 style={{ marginBottom: 12 }}>Navigation</h3>
          <nav style={{ display: "grid", gap: 8 }}>
            <Link to="/">Home</Link>
            <Link to="/creatives">AI Creatives</Link>
            <Link to="/campaigns">Campaigns</Link>
          </nav>
        </aside>

        {/* Main area */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/creatives" element={<Creatives />} />
            <Route path="/campaigns" element={<Campaigns />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
