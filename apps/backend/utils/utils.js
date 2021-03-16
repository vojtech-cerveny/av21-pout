const axios = require('axios').default

exports.random_rgba = function random_rgba() {
  var o = Math.round,
    r = Math.random,
    s = 255
  return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')'
}



exports.sendSlackMessage = async function sendSlackMessage(route) {
  let text = `
Ahoj, poutník *${route.user}* vložil novou pouť! \n 
Můžeš prosím zkontrolovat, že je všechno v pořádku a pokud ne, tak příspěvek smazat? Díky!\n
👧🧒➡️⛪️\n
• *user*: ${route.user} \n
• *distance*: ${route.distance} \n
• *startPoint*: ${route.startPoint} \n
• *endPoint*: ${route.endPoint} \n
• *note*: ${route.note} \n
• *id*: ${route.id} \n
            `
  let imageUrl = process.env.ENV === 'localhost' ? 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=400&fit=max' : `${process.env.SERVER_URL}/images/${route.imagePath}`
  let urlToDelete = `${process.env.SERVER_URL}/delete/${route.id}?adminToken=${process.env.ADMIN_TOKEN}`


  const URL = process.env.SLACK_URL
  const config = { 'Content-type': 'application/json' };
  const data = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": text
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
        "image_url": imageUrl,
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
            "url": urlToDelete
          }
        ]
      }
    ]
  };
  axios.post(URL, data, config)
    .catch(e => console.log(e))
}