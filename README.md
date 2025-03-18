# Job Technology Matcher - Backend API

The backend service for Job Technology Matcher application, providing API endpoints for job searching with fuzzy matching capabilities.

## Features

- **RESTful API**: Clean and consistent API design
- **Fuzzy Search**: Find similar technology terms using Levenshtein distance algorithm
- **Pagination**: Support for paginated results to handle large datasets efficiently
- **Autocomplete Suggestions**: API endpoint for providing technology search suggestions
- **MongoDB Integration**: Efficient database queries for job retrieval

<!-- ## Architecture

This backend is part of a full-stack application with a React frontend. -->
<!-- 
![Architecture Diagram](../frontend/docs/architecture-diagram.png) -->

### Backend Architecture Components

#### Routing Layer
- `job.router.js`: Defines API endpoints for job search operations

#### Controller Layer  
- `job.controller.js`: Implements business logic for job searching and suggestions

#### Utility Layer
- `fuzzySearch.js`: Implements Levenshtein distance algorithm for fuzzy matching

#### Model Layer
- `job_opening.model.js`: Schema for job listings
- `skill_job_id.model.js`: Maps skills to job IDs for efficient searches

## API Endpoints

| Endpoint | Method | Description | Query Parameters |
|----------|--------|-------------|------------------|
| `/job/skill` | GET | Get all jobs with pagination | `page`, `limit` |
| `/job/skill/:skill` | GET | Get jobs by technology skill | `page`, `limit`, `fuzzy` |
| `/job/suggestions` | GET | Get skill suggestion autocomplete | `q` (search query) |

### Example Requests

**Get jobs by skill:**
