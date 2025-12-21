import { useState } from "react";
import api from "../services/api";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function onChange(e) {
    setMsg("");
    setError("");
    const f = e.target.files?.[0] || null;
    if (!f) return setFile(null);
    const ext = f.name.toLowerCase();
    const valid = ext.endsWith(".pdf") || ext.endsWith(".docx");
    if (!valid) {
      setError("Only .pdf or .docx allowed");
      return setFile(null);
    }
    if (f.size > 2 * 1024 * 1024) {
      setError("File too large (max 2MB)");
      return setFile(null);
    }
    setFile(f);
  }

  async function upload() {
    setMsg("");
    setError("");
    if (!file) return setError("Select a file");
    try {
      const fd = new FormData();
      fd.append("resume", file);
      await api.post("/api/resume/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Uploaded");
    } catch {
      setError("Upload failed");
    }
  }

  return (
    <div className="container page-center">
      <div className="card" style={{ maxWidth: 540, margin: "0 auto" }}>
        <h2>Upload Resume</h2>
        <input type="file" onChange={onChange} />
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={upload}>Upload</button>
        </div>
        {msg && <p className="success">{msg}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
