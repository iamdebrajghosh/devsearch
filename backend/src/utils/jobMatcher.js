function normalize(arr) {
  return Array.isArray(arr) ? arr.map((s) => String(s).toLowerCase().trim()) : [];
}

function scoreJob(userSkills, job) {
  const user = new Set(normalize(userSkills));
  const req = normalize(job.requiredSkills);
  const opt = normalize(job.optionalSkills);
  let score = 0;
  for (const s of req) {
    if (user.has(s)) score += 10;
  }
  for (const s of opt) {
    if (user.has(s)) score += 5;
  }
  const max = req.length * 10 + opt.length * 5;
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  return pct;
}

function matchJobs(userSkills, jobs, minScore = 30) {
  const results = [];
  for (const job of jobs) {
    const matchScore = scoreJob(userSkills, job);
    if (matchScore >= minScore) {
      results.push({ ...job, matchScore });
    }
  }
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

module.exports = { matchJobs, scoreJob };
