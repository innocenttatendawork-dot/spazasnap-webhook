const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'SpazaSnapVerify2025';

function verify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.status(403).send('Forbidden');
  }
}

app.get('/', verify);
app.get('/webhook', verify);
app.get('/api/webhook', verify);

app.post('/', (req, res) => res.status(200).send('EVENT_RECEIVED'));
app.post('/webhook', (req, res) => res.status(200).send('EVENT_RECEIVED'));
app.post('/api/webhook', (req, res) => res.status(200).send('EVENT_RECEIVED'));

module.exports = app;
