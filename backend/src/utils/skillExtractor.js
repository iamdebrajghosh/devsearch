const { SKILLS } = require("./skillDictionary");

function esc(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SYNONYMS = {
  "javascript": ["javascript"],
  "react": ["react", "react js", "reactjs", "react.js"],
  "node.js": ["node", "node js", "nodejs", "node.js"],
  "express": ["express"],
  "mongodb": ["mongodb", "mongo db", "mongo"],
  "mysql": ["mysql"],
  "postgresql": ["postgresql", "postgres"],
  "html": ["html"],
  "css": ["css"],
  "tailwind": ["tailwind", "tailwind css"],
  "git": ["git"],
  "github": ["github"],
  "docker": ["docker"],
  "rest api": ["rest api", "restful api"],
  "jwt": ["jwt", "json web token"],
  "oauth": ["oauth", "oauth2", "oauth 2"],
  "data structures": ["data structures"],
  "algorithms": ["algorithms"],
};

function toPatterns(term) {
  const terms = SYNONYMS[term] || [term];
  return terms.map((t) => {
    const pattern = esc(t).replace(/\s+/g, "\\s+");
    return new RegExp(`(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`, "i");
  });
}

function extractSkills(resumeText) {
  if (!resumeText || typeof resumeText !== "string") return [];
  const text = resumeText.toLowerCase().replace(/\s+/g, " ").trim();
  const found = new Set();
  for (const skill of SKILLS) {
    const patterns = toPatterns(skill);
    for (const rx of patterns) {
      if (rx.test(text)) {
        found.add(skill);
        break;
      }
    }
  }
  return Array.from(found).sort();
}

module.exports = { extractSkills };

