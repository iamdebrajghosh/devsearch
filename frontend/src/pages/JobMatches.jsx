import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function JobMatches() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError("");
      try {
        const res = await api.get("/api/jobs/match");
        if (mounted) setJobs(res.data?.jobs || []);
      } catch {
        setError("Failed to load matches");
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return jobs.filter((j) => j.title.toLowerCase().includes(t));
  }, [jobs, q]);

  return (
    <div className="grid">
      <div className="card">
        <div className="row">
          <h2>Job Matches</h2>
          <span className="badge">Personalized</span>
        </div>
        <input className="input" placeholder="Search job titles" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <p className="error">{error}</p>}
      {filtered.length === 0 && <div className="card">No matches yet</div>}
      {filtered.map((j) => (
        <div key={j.id} className="card">
          <div className="row">
            <div>
              <div style={{ fontWeight: 700 }}>{j.title}</div>
              <div className="muted">{j.experienceLevel}</div>
            </div>
            <div style={{ minWidth: 120, textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>{j.matchScore}% match</div>
              <div className="progress"><span style={{ width: `${j.matchScore}%` }}></span></div>
            </div>
          </div>
          <div className="chips" style={{ marginTop: 12 }}>
            {Array.isArray(j.requiredSkills) &&
              j.requiredSkills.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
