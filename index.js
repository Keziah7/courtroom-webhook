const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const courtroomMap = {
  1: { en: "Courtroom 1 is on the 2nd floor, left wing.", sw: "Chumba cha mahakama nambari 1 kiko ghorofa ya pili, upande wa kushoto." },
  2: { en: "Courtroom 2 is on the 2nd floor, right wing.", sw: "Chumba cha mahakama nambari 2 kiko ghorofa ya pili, upande wa kulia." },
  3: { en: "Courtroom 3 is on the 1st floor, left wing.", sw: "Chumba cha mahakama nambari 3 kiko ghorofa ya kwanza, upande wa kushoto." },
  4: { en: "Courtroom 4 is on the 1st floor, right wing.", sw: "Chumba cha mahakama nambari 4 kiko ghorofa ya kwanza, upande wa kulia." },
  5: { en: "Courtroom 5 is on the 3rd floor, left wing.", sw: "Chumba cha mahakama nambari 5 kiko ghorofa ya tatu, upande wa kushoto." },
  6: { en: "Courtroom 6 is on the 3rd floor, right wing.", sw: "Chumba cha mahakama nambari 6 kiko ghorofa ya tatu, upande wa kulia." },
  7: { en: "Courtroom 7 is on the ground floor, left wing.", sw: "Chumba cha mahakama nambari 7 kiko ghorofa ya chini, upande wa kushoto." },
  8: { en: "Courtroom 8 is on the ground floor, right wing.", sw: "Chumba cha mahakama nambari 8 kiko ghorofa ya chini, upande wa kulia." },
  9: { en: "Courtroom 9 is in the annex building.", sw: "Chumba cha mahakama nambari 9 kiko katika jengo la nyongeza." },
  10: { en: "Courtroom 10 is in the basement level.", sw: "Chumba cha mahakama nambari 10 kiko katika ghorofa ya chini ya ardhi." }
};

app.post('/webhook', (req, res) => {
  const courtroomNumber = parseInt(req.body.sessionInfo?.parameters?.number);

  const response = courtroomMap[courtroomNumber] || {
    en: "Sorry, I couldn't find that courtroom. Please check the number.",
    sw: "Samahani, siwezi kupata chumba cha mahakama hicho. Tafadhali angalia nambari."
  };

  res.json({
    fulfillment_response: {
      messages: [
        {
          text: {
            text: [`${response.en} ${response.sw}`]
          }
        }
      ]
    }
  });
});


app.listen(port, () => {
  console.log(`Webhook listening on port ${port}`);
});

