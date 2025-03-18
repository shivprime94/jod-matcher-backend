const { Router } = require("express");
const { getJob, getJobsBySkill, getSkillSuggestions } = require('../controller/job.controller');

const jobRouter = Router();

jobRouter
  .route("/skill")
  .get(getJob)

// Route to get jobs by specific skill
jobRouter
  .route("/skill/:skill")
  .get(getJobsBySkill)

// Route to get skill suggestions
jobRouter
  .route("/suggestions")
  .get(getSkillSuggestions)

module.exports = {jobRouter};