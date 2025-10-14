const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const courtroomLocations = {
  "1": {
    en: "Courtroom 1 is on the 2nd floor, left wing.",
    sw: "Chumba cha mahakama nambari 1 kiko ghorofa ya pili, upande wa kushoto."
  },
  "2": {
    en: "Courtroom 2 is on the 2nd floor, right wing.",
    sw: "Chumba cha mahakama nambari 2 kiko ghorofa ya pili, upande wa kulia."
  },
  "3": {
    en: "Courtroom 3 is on the 2nd floor, left wing.",
    sw: "Chumba cha mahakama nambari 3 kiko ghorofa ya pili, upande wa kushoto."
  },
  "4": {
    en: "Courtroom 4 is on the 3rd floor, right wing.",
    sw: "Chumba cha mahakama nambari 4 kiko ghorofa ya tatu, upande wa kulia."
  },
  "5": {
    en: "Courtroom 5 is on the 3rd floor, left wing.",
    sw: "Chumba cha mahakama nambari 5 kiko ghorofa ya tatu, upande wa kushoto."
  }
};

app.post('/webhook', (req, res) => {
  const number = req.body.queryResult.parameters['courtroom-number'];
  const location = courtroomLocations[number];

  if (location) {
    res.json({
      fulfillmentMessages: [
        { text: { text: [location.en] } },
        { text: { text: [location.sw] } }
      ]
    });
  } else {
    res.json({
      fulfillmentMessages: [
        { text: { text: ["Sorry, I don't have directions for that courtroom."] } }
      ]
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Webhook server is running');
});
