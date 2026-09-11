
const express = require('express');
const app = express();
app.use(express.json());

app.get('/webhook/whatsapp', (req, res) => {
  const VERIFY_TOKEN = 'SpazaSnapVerify2025';
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('✅ VERIFIED!');
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook/whatsapp', (req, res) => {
  console.log('Message:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.json({ status: 'LIVE', service: 'SpazaSnap API', number: '064 795 3143' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 SpazaSnap on ${PORT}`));
