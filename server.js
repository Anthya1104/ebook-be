const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.SERVER_PORT || 3002;

const path = require('path');

const cors = require('cors');
const corsOptions = {
  Credential: true,
  origin: ['http://localhost:3005'],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/1.0/test',(req, res, next) => {
  res.send('Hello From BE');
});

app.listen(port, () => {
  console.log(`server start at ${port}`);
});
