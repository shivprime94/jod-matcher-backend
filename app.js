const express = require('express');
const cors = require('cors');
const {connectToMongoDB} = require('./src/db/db')
const {jobRouter} = require('./src/router/job.router') 


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend Vite server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/job', jobRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, async () => {
    console.log('Server is running on port 3000');
    await connectToMongoDB();
});
