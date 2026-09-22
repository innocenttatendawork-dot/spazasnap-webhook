const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "spazasnap123";

app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post('/', async (req, res) => {
  try {
    const val = req.body.entry?.[0]?.changes?.[0]?.value;
    const msg = val?.messages?.[0];
    if (msg) {
      const from = msg.from;
      const phoneId = val.metadata.phone_number_id;
      const token = process.env.WHATSAPP_TOKEN;
      await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: "🛒 SpazaSnap Welcome!\n\n1. Bread R10\n2. Milk R15\n3. Eggs R25\n\nReply number to order" }
        })
      });
    }
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(200);
  }
});

module.exports = app;
