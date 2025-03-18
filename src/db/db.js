const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection URI
const uri = process.env.MONGO_URI;

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

// Function to get all collection names
const getCollections = async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map(col => col.name).filter(name => name.startsWith("jobs_"));
};

// Function to extract job_id and company from a collection
const getJobDetails = async (collectionName) => {
    const collection = mongoose.connection.db.collection(collectionName);
    // const jobs = await collection.find({}, { projection: { id: 1, company: 1, _id: 0 } }).toArray();
    const jobs = await collection.find({}).toArray();

    // console.log(jobs[0]);
    // return jobs.map(job => ({ job_id: job.id, company: job.company }));
    return jobs;
};

// Function to aggregate job data and insert into `openings`
const aggregateJobOpenings = async () => {
    try {
        const collections = await getCollections();
        const jobOpenings = [];

        for (const collectionName of collections) {
            const jobs = await getJobDetails(collectionName);
            jobOpenings.push(...jobs);
        }

        // Insert into `openings` collection
        const openingsCollection = mongoose.connection.db.collection("job_openings");
        await openingsCollection.deleteMany({}); // Clear old data
        await openingsCollection.insertMany(jobOpenings);

        console.log("Job openings stored successfully in `openings` collection!");
    } catch (error) {
        console.error("Error aggregating job openings:", error.message);
    }
};

module.exports = { connectToMongoDB };