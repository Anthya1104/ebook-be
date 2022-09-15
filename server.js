const express = require('express');
const app = express();

const dbController = require('./controller/test');

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

app.use('/api/1.0/test', (req, res, next) => {
  res.send('Hello From BE');
});

// db test -> 確定可以連上
// app.use('/api/1.0/db-test', dbController.getMemberList);

// 404
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

// 500
app.use((err, req, res, next) => {
  console.error('錯誤處理', err);
  console.error('path:', req.path);
  res.status(500).json({ message: '請洽系統管理員' });
});

app.listen(port, () => {
  console.log(`server start at ${port}`);
});
