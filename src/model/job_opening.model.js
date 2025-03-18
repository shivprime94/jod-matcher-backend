const mongoose = require("mongoose");

const jobOpeningSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    img: { type: String },
    url: { type: String, required: true },
    companyUrl: { type: String },
    date: { type: Date, required: true },
    postedDate: { type: Date, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    countryCode: { type: String },
    countryText: { type: String },
    descriptionHtml: { type: String },
    city: { type: String, required: true },
    remoteOk: { type: Boolean, required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String },
    stackRequired: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create the model
const JobOpening = mongoose.model("JobOpening", jobOpeningSchema, "job_openings"); 

module.exports = JobOpening;