const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "SpazaSnapVerify2025";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.PHONE_NUMBER_ID;

app.get("/", (req, res) => res.send("SpazaSnap Bot Live!"));

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  console.log("DATA RECEIVED:", JSON.stringify(req.body, null, 2));
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    if (entry?.messages) {
      const msg = entry.messages[0];
      const from = msg.from;
      const text = msg.text?.body || "";

      console.log(`Message from ${from}: ${text}`);

      const url = `https://graph.facebook.com/v20.0/${PHONE_ID}/messages`;
      await axios.post(url, {
        messaging_product: "whatsapp",
        to: from,
        text: { body: `SpazaSnap bot is working! ✅\nYou said: ${text}\n\nSend: menu, hours, order, or location` }
      }, {
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" }
      });
    }
  } catch (e) {
    console.log("ERROR:", e.response?.data || e.message);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Live on ${PORT}`));
