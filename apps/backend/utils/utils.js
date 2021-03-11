const axios = require('axios').default

exports.random_rgba = function random_rgba() {
  var o = Math.round,
    r = Math.random,
    s = 255
  return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')'
}

exports.sendSlackMessage = async function sendSlackMessage(route) {
  const URL = "https://hooks.slack.com/services/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"
  const config = { 'Content-type': 'application/json' };
  const data = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `
Ahoj, poutník *${route.user}* vložil novou pouť! \n 
Můžeš prosím zkontrolovat, že je všechno v pořádku a pokud ne, tak příspěvek smazat? Díky!\n
👧🧒➡️⛪️\n
• *user*: ${route.user} \n
• *distance*: ${route.distance} \n
• *startPoint*: ${route.startPoint} \n
• *endPoint*: ${route.endPoint} \n
• *id*: ${route.id} \n
            `
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "image",
        "title": {
          "type": "plain_text",
          "text": "selfie",
          "emoji": true
        },
        "image_url": `${process.env.SERVER_URL}/images/${route.imagePath}`,
        "alt_text": "selfie z poute"
      },
      {
        "type": "divider"
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Odstranit závadný příspěvek",
              "emoji": true
            },
            "value": "click_me_123",
            "url": `${process.env.SERVER_URL}/delete/${route.id}?adminToken=${process.env.ADMIN_TOKEN}`
          }
        ]
      }
    ]
  };
  axios.post(URL, data, config)
}