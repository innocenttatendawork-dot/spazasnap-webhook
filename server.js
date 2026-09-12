const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'SpazaSnapVerify2025';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONENUMBERID || process.env.PHONE_NUMBER_ID || '1312905462620274';

app.get('/webhook/whatsapp', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('✅ VERIFIED');
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook/whatsapp', async (req, res) => {
  console.log('Message:', JSON.stringify(req.body, null, 2));
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body?.toLowerCase() || '';

      let reply = `👋 Sawubona! Welcome to *SpazaSnap* 🛒\n\nReply with:\n1️⃣ Bread\n2️⃣ Milk\n3️⃣ Airtime\n4️⃣ Help\n\nNumber: 064 795 3143`;

      if (text.includes('bread')) reply = `🍞 Bread - R18\nReply YES to order.`;
      else if (text.includes('milk')) reply = `🥛 Milk 1L - R25\nReply YES to order.`;
      else if (text.includes('airtime')) reply = `📱 Airtime available!\nSend amount: e.g., "R20 airtime"`;
      else if (text === 'hi' || text === 'hello') reply = `👋 Hey! SpazaSnap here!\n\nWhat you need today?\n1. Bread (R18)\n2. Milk (R25)\n3. Airtime\n\nJust type the item name!`;

      await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: reply }
      }, {
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
      });
      console.log('✅ Replied to', from);
    }
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.json({ status: 'LIVE', service: 'SpazaSnap API', number: '064 795 3143' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`SpazaSnap on ${PORT}`));
