#!/usr/bin/env node

const express = require('express');
const app = express();
const port = 8081;
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const https = require('https');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const logsFolder = os.homedir() + '/neural-notes-database';

console.log('Events log folder: ', logsFolder);

fs.mkdirSync(logsFolder, { recursive: true });

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(limiter)

app.post('/event/login', (req, res) => {
  const user = req.body;
  const now = new Date();
  const nowISOString = now.toISOString();

  console.log(`${nowISOString} Recording user login:`, user);
  fs.appendFile(`${logsFolder}/login.log`, `${nowISOString} ${user.email}\n`, () => {});
  res.sendStatus(200);
  res.end();
});

if (process.env.NODE_ENV === 'production') {
  const sslCertsFolder = os.homedir() + '/ssl-certs';
  const privateKey = fs.readFileSync(sslCertsFolder + '/neural-notes.key', 'utf8');
  const certificate = fs.readFileSync(sslCertsFolder + '/neural-notes.crt', 'utf8');
  const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);
  httpsServer.listen(port);
  console.log(`Server listening at https://localhost:${port}`);
} else {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

