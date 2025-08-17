import React, { useEffect, useState } from "react";

export default function Campaigns() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "draft",
  });
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchRows = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/campaigns");
      const data = await r.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load campaigns");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  // helpers
  const startEdit = (id) => setEditId(id);
  const cancelEdit = () => setEditId(null);

  const handleChange = (id, key, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const saveRow = async (id) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (!row.name || !row.budget) {
      alert("Name and budget are required");
      return;
    }
    setSavingId(id);
    setError("");
    try {
      const resp = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: row.name,
          budget: Number(row.budget),
          startDate: row.startDate || "",
          endDate: row.endDate || "",
          status: row.status || "draft",
        }),
      });
      if (!resp.ok) throw new Error("Save failed");
      await resp.json().catch(() => ({}));
      setEditId(null);
    } catch (e) {
      console.error(e);
      setError("Failed to save campaign");
    } finally {
      setSavingId(null);
      fetchRows();
    }
  };

  const deleteRow = async (id) => {
    if (!confirm("Delete this campaign?")) return;
    setDeletingId(id);
    setError("");
    try {
      const resp = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Delete failed");
    } catch (e) {
      console.error(e);
      setError("Failed to delete campaign");
    } finally {
      setDeletingId(null);
      fetchRows();
    }
  };

  const createRow = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.budget) {
      alert("Name and budget are required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const resp = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem.name,
          budget: Number(newItem.budget),
          startDate: newItem.startDate || "",
          endDate: newItem.endDate || "",
          status: newItem.status || "draft",
        }),
      });
      if (!resp.ok) throw new Error("Create failed");
      await resp.json().catch(() => ({}));
      setNewItem({ name: "", budget: "", startDate: "", endDate: "", status: "draft" });
    } catch (e) {
      console.error(e);
      setError("Failed to create campaign");
    } finally {
      setCreating(false);
      fetchRows();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Campaigns</h2>

      {/* Add New */}
      <form
        onSubmit={createRow}
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr auto",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
          maxWidth: "100%",
        }}
      >
        <input
          placeholder="Name *"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
          required
        />
        <input
          type="number"
          placeholder="Budget *"
          value={newItem.budget}
          onChange={(e) => setNewItem({ ...newItem, budget: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
          required
        />
        <input
          type="date"
          value={newItem.startDate}
          onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <input
          type="date"
          value={newItem.endDate}
          onChange={(e) => setNewItem({ ...newItem, endDate: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <select
          value={newItem.status}
          onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        >
          <option value="draft">draft</option>
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="completed">completed</option>
        </select>
        <button
          type="submit"
          disabled={creating}
          style={{ padding: "10px 14px", borderRadius: 6, background: "#1f6feb", color: "#fff", border: 0 }}
        >
          {creating ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Table */}
      {error && (
        <div style={{ background: "#ffe1e1", color: "#900", padding: 8, borderRadius: 6, marginBottom: 8 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : rows.length === 0 ? (
        <p>No campaigns yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Budget</th>
                <th style={th}>Start</th>
                <th style={th}>End</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isEditing = editId === r.id;
                return (
                  <tr key={r.id}>
                    <td style={td}>
                      {isEditing ? (
                        <input
                          value={r.name || ""}
                          onChange={(e) => handleChange(r.id, "name", e.target.value)}
                          style={inp}
                          required
                        />
                      ) : (
                        r.name
                      )}
                    </td>
                    <td style={td}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={r.budget ?? ""}
                          onChange={(e) => handleChange(r.id, "budget", e.target.value)}
                          style={inp}
                          required
                        />
                      ) : (
                        r.budget
                      )}
                    </td>
                    <td style={td}>
                      {isEditing ? (
                        <input
                          type="date"
                          value={r.startDate || ""}
                          onChange={(e) => handleChange(r.id, "startDate", e.target.value)}
                          style={inp}
                        />
                      ) : (
                        r.startDate || ""
                      )}
                    </td>
                    <td style={td}>
                      {isEditing ? (
                        <input
                          type="date"
                          value={r.endDate || ""}
                          onChange={(e) => handleChange(r.id, "endDate", e.target.value)}
                          style={inp}
                        />
                      ) : (
                        r.endDate || ""
                      )}
                    </td>
                    <td style={td}>
                      {isEditing ? (
                        <select
                          value={r.status || "draft"}
                          onChange={(e) => handleChange(r.id, "status", e.target.value)}
                          style={inp}
                        >
                          <option value="draft">draft</option>
                          <option value="active">active</option>
                          <option value="paused">paused</option>
                          <option value="completed">completed</option>
                        </select>
                      ) : (
                        r.status || "draft"
                      )}
                    </td>
                    <td style={td}>
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveRow(r.id)}
                            disabled={savingId === r.id}
                            style={btnPrimary}
                          >
                            {savingId === r.id ? "Saving..." : "Save"}
                          </button>
                          <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(r.id)} style={btnPrimary}>Edit</button>
                          <button
                            onClick={() => deleteRow(r.id)}
                            disabled={deletingId === r.id}
                            style={btnDanger}
                          >
                            {deletingId === r.id ? "Deleting..." : "Delete"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { textAlign: "left", borderBottom: "1px solid #eee", padding: "10px 8px", fontWeight: 600 };
const td = { borderBottom: "1px solid #f0f0f0", padding: "8px" };
const inp = { padding: 6, border: "1px solid #ccc", borderRadius: 6, width: "100%" };
const btnPrimary = { marginRight: 8, padding: "6px 10px", borderRadius: 6, background: "#1f6feb", color: "#fff", border: 0 };
const btnGhost = { padding: "6px 10px", borderRadius: 6, background: "#f3f4f6", border: "1px solid #e5e7eb" };
const btnDanger = { marginLeft: 8, padding: "6px 10px", borderRadius: 6, background: "#dc2626", color: "#fff", border: 0 };
