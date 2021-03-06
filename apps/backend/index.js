require('dotenv').config()

const { v4: uuidv4 } = require('uuid');
const express = require('express');
const formidable = require('formidable');
const sharp = require('sharp')
const cors = require('cors')
const fs = require('fs')

const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

const DB_URL = `mongodb://${process.env.ENV === 'docker' ? 'mongo' : 'localhost'}:27017/av21-pout`
const DB_NAME = 'av-routes'
const client = require('mongodb').MongoClient;
const { random_rgba, sendSlackMessage } = require('./utils/utils');


const app = express();


const isProduction = () => process.env.ENV === 'docker'
const proxyPath = isProduction() ? '/api' : ''

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());


app.use(cors())
app.use(proxyPath, express.static('public'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

if (!fs.existsSync(`${__dirname}/public/images/`)) {
  fs.mkdirSync(`${__dirname}/public/`, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`${__dirname}/public/images/`, (err) => {
    if (err) throw err
  })
}

app.get(proxyPath + '/', (req, res) => {
  res.send(`
    <h2>Hello from backend</h2>
  `);
});

app.get(proxyPath + '/routes', (req, res) => {
  client.connect(DB_URL, async function (err, client) {
    if (err) throw err

    var db = client.db(DB_NAME)
    db.collection("routes").find({}).toArray(async function (err, result) {
      if (err) throw err;
      client.close();
      res.json(result)
    });
  })
})

app.post(proxyPath + '/register', (req, res, next) => {
  const UUID = uuidv4().split('-')[0]
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const newRoute = JSON.parse(fields.routeInfo)
    newRoute.distance = Math.abs(Number.parseInt(newRoute.distance))
    newRoute.id = uuidv4().split('-')[0]
    newRoute.color = random_rgba()
    newRoute.imagePathSmall = `${UUID}-small.${files.image.type.split('/')[1]}`
    newRoute.imagePath = `${UUID}.${files.image.type.split('/')[1]}`

    await sharp(files.image.path)
      .resize({ width: 500 })
      .toFile(`${__dirname}/public/images/${newRoute.imagePathSmall}`)

    await sharp(files.image.path)
      .resize({ width: 1200 })
      .toFile(`${__dirname}/public/images/${newRoute.imagePath}`)

    client.connect(DB_URL, async function (err, client) {
      if (err)
        throw err;

      var db = client.db(DB_NAME);
      db.collection("routes").insertOne(newRoute, async function (err, result) {
        if (err) {
          res.send(err);
        }
        console.log(`Inserted route ${newRoute.id} - ${newRoute.user} ${newRoute.startPoint} ${newRoute.endPoint} ${newRoute.distance}`);
        await sendSlackMessage(result.ops[0]);
        client.close();
        res.json(result.result);
      });
    })
  });
});

app.get(proxyPath + '/delete/:routeId?', function (req, res) {
  client.connect(DB_URL, (err, client) => {
    if (err) throw err
    if (req.query.adminToken !== process.env.ADMIN_TOKEN) res.json({ auth: "Unathorized" })
    var db = client.db(DB_NAME)
    db.collection("routes")
      .findOneAndDelete({ "id": req.params.routeId }
        , function (err, result) {
          client.close();
          res.json(result)
        }
      );
  })
})

app.use(Sentry.Handlers.errorHandler());

app.listen(3200, () => {
  console.log('Server listening on http://localhost:3200 ...');
});