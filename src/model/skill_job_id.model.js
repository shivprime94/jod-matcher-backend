const mongoose = require("mongoose");

const skillJobIdsSchema = new mongoose.Schema({
    skill: { type: String, required: true, unique: true, index: true }, // Name of the skill
    job_ids: { type: [String], required: true } // Array of job IDs related to the skill
});

const skillJobIdModel = mongoose.model("skillJobIdModel", skillJobIdsSchema, "skill_job_ids" )


module.exports = skillJobIdModel


