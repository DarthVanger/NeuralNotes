const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const fs = require('fs');

const logsFolder = './';

app.use(express.json());
app.use(cors());

app.post('/event/login', (req, res) => {
  const user = req.body;
  const now = new Date();
  const nowISOString = now.toISOString();

  console.log(`${nowISOString} Recording user login:`, user);
  fs.appendFile(`${logsFolder}/login.log`, `${nowISOString} ${user.email}\n`, () => {});
  res.sendStatus(200);
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
