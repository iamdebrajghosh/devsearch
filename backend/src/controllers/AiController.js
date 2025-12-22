const Resume = require("../models/Resume");
const { JOBS } = require("../data/jobs");
const { matchJobs, scoreJob } = require("../utils/jobMatcher");
const { extractSkills } = require("../utils/skillExtractor");

function topTwoRoles(jobs) {
  const sorted = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  return sorted.slice(0, 2).map((j) => ({ title: j.title, matchScore: j.matchScore }));
}

function computeMissingSkills(userSkills, jobs) {
  const user = new Set((userSkills || []).map((s) => String(s).toLowerCase().trim()));
  const miss = new Set();
  for (const j of jobs.slice(0, 3)) {
    const req = (j.requiredSkills || []).map((s) => String(s).toLowerCase().trim());
    for (const s of req) {
      if (!user.has(s)) miss.add(s);
    }
  }
  return Array.from(miss).slice(0, 8);
}

function buildRoadmap(missing, experience) {
  const ms = missing.slice(0, 6);
  const base = experience && String(experience).toLowerCase().includes("fresh") ? "fresher" : "junior";
  const weeks = [
    `Week 1: Fundamentals and setup. Focus on ${ms[0] || "core JS/HTML/CSS"}. Build simple exercises daily.`,
    `Week 2: Apply basics. Implement mini projects using ${ms[1] || "DOM + fetch"} and Git workflows.`,
    `Week 3: Framework practice. Build a small app with ${ms[2] || "React"}. Add routing and API calls.`,
    `Week 4: Backend basics. Implement ${ms[3] || "Node.js + Express"} endpoints, connect a DB like ${ms[4] || "MongoDB"}.`,
    `Week 5: Integration and auth. Add ${ms[5] || "REST API patterns, JWT auth"} to your project.`,
    `Week 6: Portfolio and mock interviews. Polish your project, write a README, deploy, and practice problem-solving.`,
  ];
  return `${base.toUpperCase()} 30-day plan:\n` + weeks.join("\n");
}

exports.recommend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bodySkills = Array.isArray(req.body?.extractedSkills) ? req.body.extractedSkills : null;
    const experience = req.body?.experienceLevel || "fresher";
    let resume = await Resume.findOne({ userId }).select("extractedSkills parsedText");
    if (!resume && !bodySkills) {
      return res.status(400).json({ message: "No resume found for this user" });
    }
    let skills = [];
    if (bodySkills && bodySkills.length > 0) {
      skills = bodySkills;
    } else if (Array.isArray(resume?.extractedSkills) && resume.extractedSkills.length > 0) {
      skills = resume.extractedSkills;
    } else if (resume?.parsedText) {
      skills = extractSkills(resume.parsedText);
    }
    if (!skills || skills.length === 0) {
      return res.status(200).json({
        roles: [],
        missingSkills: [],
        roadmap: "No skills extracted. Upload a text-based PDF/DOCX resume to enable guidance.",
      });
    }
    const reqJobs = Array.isArray(req.body?.jobs) ? req.body.jobs : null;
    let matched = [];
    if (reqJobs && reqJobs.length > 0 && typeof reqJobs[0] === "object") {
      matched = reqJobs.map((j) => ({ ...j, matchScore: scoreJob(skills, j) })).sort((a, b) => b.matchScore - a.matchScore);
    } else {
      matched = matchJobs(skills, JOBS, 0);
    }
    const roles = topTwoRoles(matched);
    const missingSkills = computeMissingSkills(skills, matched);
    const roadmap = buildRoadmap(missingSkills, experience);
    return res.json({ roles, missingSkills, roadmap });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

