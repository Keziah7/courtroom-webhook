const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Courtroom directions map
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
  10:{ en: "Courtroom 10 is in the basement level.", sw: "Chumba cha mahakama nambari 10 kiko katika ghorofa ya chini ya ardhi." }
};

// Centralized responses object
const responses = {
  CauseList: {
    en: "You can view today’s cause list on the Judiciary portal: [Click here](https://judiciary.go.ke/cause-list).",
    sw: "Unaweza kuona orodha ya kesi ya leo kwenye tovuti ya Mahakama."
  },
  CaseFiling: {
    en: "To file a case, visit [https://efiling.court.go.ke](https://efiling.court.go.ke), upload your documents, pay the filing fee, and await confirmation.",
    sw: "Tembelea tovuti ya e-filing, pakia hati zako, lipa ada, na subiri uthibitisho."
  },
  JudgmentCollection: {
    en: "Visit the registry with your case number and ID. You may also check [https://efiling.court.go.ke](https://efiling.court.go.ke) for digital copies.",
    sw: "Tembelea ofisi ya usajili ukiwa na nambari ya kesi na kitambulisho chako."
  },
  FormsTemplates: {
    en: "Download forms from [https://judiciary.go.ke/downloads/](https://judiciary.go.ke/downloads/).",
    sw: "Pakua fomu kutoka tovuti ya Mahakama."
  },
  LanguageSupport: {
    en: "Yes, I can respond in Kiswahili. Please go ahead.",
    sw: "Ndiyo, naweza kujibu kwa Kiswahili. Tafadhali uliza swali lako."
  },
  RegistryHelp: {
    en: "The registry is on the ground floor near the main entrance. Ask the help desk for assistance.",
    sw: "Ofisi ya usajili iko ghorofa ya chini karibu na mlango mkuu."
  },
  PaymentInfo: {
    en: "You can pay via the e-filing portal or at the court cashier’s office.",
    sw: "Unaweza kulipa kupitia tovuti ya e-filing au kwa mhasibu wa mahakama."
  },
  ContactSupport: {
    en: "For further assistance, call the Judiciary helpdesk at +2547-3018-1000 or email ictsupportdesk@court.go.ke.",
    sw: "Kwa msaada zaidi, piga simu au tuma barua pepe."
  },
  ThankYou: {
    en: "You’re welcome! How else can I assist you today?",
    sw: "Karibu! Kuna njia nyingine ninayoweza kukusaidia leo?"
  },
  Goodbye: {
    en: "Goodbye! Have a great day.",
    sw: "Kwaheri! Kuwa na siku njema."
  },
  Greeting: {
    en: "Hello! I’m your Legal Assistant. How can I help you today? 😊",
    sw: "Habari! Mimi ni Msaidizi wako wa Kisheria. Naweza kukusaidia vipi leo?"
  },
  DefaultWelcomeIntent: {
    en: "Hello! I’m your Legal Assistant. How can I help you today? 😊",
    sw: "Habari! Mimi ni Msaidizi wako wa Kisheria. Naweza kukusaidia vipi leo?"
  },
  DefaultFallbackIntent: {
    en: "Sorry, I didn't get that. Can you ask differently?",
    sw: "Samahani, sikuelewa. Tafadhali uliza kwa njia nyingine."
  }
};

// Map similar intents to single response
const intentAliases = {
  Greeting: "Greeting",
  "Default Welcome Intent": "DefaultWelcomeIntent",
  "Thank You": "ThankYou",
  "Default Fallback Intent": "DefaultFallbackIntent",
  Goodbye: "Goodbye"
};

app.post('/webhook', (req, res) => {
  console.log("Webhook triggered");

  // Debug: log entire request body
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const intentName = req.body.queryResult.intent.displayName;
  const userQuery = req.body.queryResult?.queryText || "";
  const params = req.body.queryResult?.parameters || {};

  // Handle CourtroomDirections (dynamic)
  if(intentName === "CourtroomDirections") {
    let courtroomNumber = parseInt(params.number);
    if (isNaN(courtroomNumber)) {
      const match = userQuery.match(/\d+/);
      if (match) {
        courtroomNumber = parseInt(match[0]);
        console.log("Detected number from text:", courtroomNumber);
      }
    }

    const responseCourtroom = courtroomMap[courtroomNumber] || {
      en: "Sorry, I couldn't find that courtroom. Please check the number.",
      sw: "Samahani, siwezi kupata chumba cha mahakama hicho. Tafadhali angalia nambari."
    };

    console.log("Responding with:", `${responseCourtroom.en} ${responseCourtroom.sw}`);
    return res.json({ fulfillmentText: `${responseCourtroom.en} ${responseCourtroom.sw}` });
  }

  // Map alias if exists
  const canonicalIntent = intentAliases[intentName] || intentName;

  // Fetch response from centralized object
  const response = responses[canonicalIntent] || {
    en: "This feature is not yet implemented.",
    sw: "Huduma hii bado haijatekelezwa."
  };

  console.log("Responding with:", `${response.en} ${response.sw}`);
  res.json({ fulfillmentText: `${response.en} ${response.sw}` });
});

app.listen(port, () => {
  console.log(`Webhook listening on port ${port}`);
});
