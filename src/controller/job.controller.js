const jobopening = require('../model/job_opening.model');
const skilljobid = require('../model/skill_job_id.model');
const { isSimilar } = require('../utils/fuzzySearch');

// controller for the getting all job 
const getJob = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const totalItems = await jobopening.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        
        const jobs = await jobopening.find()
            .skip(skip)
            .limit(limit);
        
        res.status(200).json({
            message: 'success',
            data: jobs,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems
            }
        });
    } catch (error) {
        res
            .status(500)
                .send({ message: error.message || "Error occurred while retrieving job" });
    }
}

// controller for getting jobs by skill
const getJobsBySkill = async (req, res) => {
    try {
        const skill = req.params.skill;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const fuzzySearch = req.query.fuzzy !== 'false'; // Enable fuzzy search by default
        
        if (!skill) {
            return res.status(400).json({
                message: 'Skill parameter is required'
            });
        }
        
        // Find the job IDs associated with this skill (exact match)
        let skillRecord = await skilljobid.findOne({ skill: skill.toLowerCase() });

        // If no exact match and fuzzy search is enabled, try fuzzy matching
        if ((!skillRecord || !skillRecord.job_ids.length) && fuzzySearch) {
            // Get all skills
            const allSkills = await skilljobid.find({}, { skill: 1, _id: 0 });
            
            // Find similar skills
            const similarSkills = allSkills
                .filter(record => isSimilar(skill, record.skill))
                .map(record => record.skill);
            
            if (similarSkills.length > 0) {
                // Get job IDs for all similar skills
                const similarRecords = await skilljobid.find({ skill: { $in: similarSkills } });
                
                // Combine all job IDs
                const allJobIds = [];
                similarRecords.forEach(record => {
                    allJobIds.push(...record.job_ids);
                });
                
                // Create a virtual skill record for the fuzzy match
                skillRecord = {
                    skill: skill,
                    job_ids: [...new Set(allJobIds)], // Remove duplicates
                    similarSkills: similarSkills
                };
            }
        }

        if (!skillRecord || !skillRecord.job_ids.length) {
            return res.status(404).json({
                message: 'No jobs found with this skill',
                data: [],
                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalItems: 0
                }
            });
        }
        
        const totalItems = skillRecord.job_ids.length;
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;
        
        // Get a slice of job IDs for the current page
        const pageJobIds = skillRecord.job_ids.slice(skip, skip + limit);
        
        // Fetch the actual jobs using the job IDs
        const jobs = await jobopening.find({ id: { $in: pageJobIds } });
        
        res.status(200).json({
            message: 'success',
            data: jobs,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems
            },
            fuzzyMatch: skillRecord.similarSkills ? {
                searchTerm: skill,
                matchedSkills: skillRecord.similarSkills
            } : null
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error occurred while retrieving jobs by skill"
        });
    }
}

// Get skill suggestions based on fuzzy search
const getSkillSuggestions = async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query || query.length < 2) {
            return res.status(400).json({
                message: 'Query parameter (q) must be at least 2 characters'
            });
        }
        
        // Get all skills
        const allSkills = await skilljobid.find({}, { skill: 1, _id: 0 });
        
        // Find similar skills
        const suggestions = allSkills
            .map(record => record.skill)
            .filter(skill => isSimilar(query, skill))
            .slice(0, 5); // Limit to 5 suggestions
        
        res.status(200).json({
            suggestions
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error occurred while retrieving skill suggestions"
        });
    }
}

module.exports = { getJob, getJobsBySkill, getSkillSuggestions }