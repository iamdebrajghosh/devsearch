const Resume = require("../models/Resume");
const { JOBS } = require("../data/jobs");
const { matchJobs, scoreJob } = require("../utils/jobMatcher");
const { extractSkills } = require("../utils/skillExtractor");

exports.match = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.userId }).select("extractedSkills parsedText");
    const hasSkills = Array.isArray(resume?.extractedSkills) && resume.extractedSkills.length > 0;
    let userSkills = [];
    if (hasSkills) {
      userSkills = resume.extractedSkills;
    } else if (resume?.parsedText) {
      userSkills = extractSkills(resume.parsedText);
    }
    const minScore = userSkills.length > 0 ? 30 : 0;
    let ranked = matchJobs(userSkills, JOBS, minScore);
    if (ranked.length === 0) {
      ranked = JOBS.map((j) => ({ ...j, matchScore: scoreJob(userSkills, j) }))
        .sort((a, b) => b.matchScore - a.matchScore);
    }
    return res.json({ jobs: ranked });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
