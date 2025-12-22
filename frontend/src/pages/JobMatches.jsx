import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function JobMatches() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [advice, setAdvice] = useState(null);
  const [adviceError, setAdviceError] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);

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

  async function getAdvice() {
    setAdviceError("");
    setAdvice(null);
    if (jobs.length === 0) {
      setAdviceError("Upload your resume to generate advice.");
      return;
    }
    try {
      setAdviceLoading(true);
      const top = jobs.slice(0, 5).map((j) => ({
        id: j.id,
        title: j.title,
        requiredSkills: j.requiredSkills,
        optionalSkills: j.optionalSkills,
      }));
      const res = await api.post("/api/ai/recommend", {
        experienceLevel: "fresher",
        jobs: top,
      });
      setAdvice(res.data);
    } catch {
      setAdviceError("Could not generate advice");
    } finally {
      setAdviceLoading(false);
    }
  }

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
      <div className="card">
        <div className="row">
          <h3>AI Career Guidance</h3>
          <button className="btn secondary" onClick={getAdvice} disabled={adviceLoading}>
            {adviceLoading ? "Generating..." : "Get Advice"}
          </button>
        </div>
        {adviceError && <p className="error">{adviceError}</p>}
        {advice && (
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Suggested Roles:</strong>
              <div>
                {Array.isArray(advice.roles) && advice.roles.length > 0
                  ? advice.roles.map((r, i) => (
                      <div key={i}>{r.title} ({r.matchScore}%)</div>
                    ))
                  : "No roles suggested"}
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Missing Skills:</strong>
              <div>
                {Array.isArray(advice.missingSkills) && advice.missingSkills.length > 0
                  ? advice.missingSkills.join(", ")
                  : "None detected"}
              </div>
            </div>
            <div>
              <strong>30-day Roadmap:</strong>
              <pre style={{ whiteSpace: "pre-wrap" }}>{advice.roadmap}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
