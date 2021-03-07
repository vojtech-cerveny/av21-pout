const { v4: uuidv4 } = require('uuid');
const express = require('express');
const formidable = require('formidable');
const sharp = require('sharp')
const cors = require('cors')
const fs = require('fs')

const DB_URL = 'mongodb://localhost:27017/av21-pout'
const DB_NAME = 'av-routes'
const client = require('mongodb').MongoClient


const app = express();
app.use(cors())
app.use(express.static('public'));

if (!fs.existsSync(`${__dirname}/public/images/`)) {
  fs.mkdirSync(`${__dirname}/public/`, (err) => {
    if (err) throw err
  })
  fs.mkdirSync(`${__dirname}/public/images/`, (err) => {
    if (err) throw err
  })
}

app.get('/', (req, res) => {
  res.send(`
    <h2>Hello from backend</h2>
  `);
});

app.get('/routes', (req, res) => {
  client.connect(DB_URL, function (err, client) {
    if (err) throw err

    var db = client.db(DB_NAME)
    db.collection("routes").find({}).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      client.close();
      res.json(result)
    });
  })
})

app.get('/latest', (req, res) => {
  client.connect(DB_URL, (err, client) => {
    if (err) throw err
    var db = client.db(DB_NAME)
    db.collection("routes")
    .aggregate([
      {
        total: {$sum: "$distance"}
      }
    ]
      , function (err, result) {
        console.log(result);
        console.log(result[0])
        client.close();
        res.json(result[0])
      }
    );
  })
})

app.post('/register', (req, res, next) => {
  const UUID = uuidv4().split('-')[0]
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const newRoute = JSON.parse(fields.routeInfo)
    newRoute.distance = Number.parseInt(newRoute.distance)
    sharp(files.image.path)
      .resize({ width: 500 })
      .toFile(`${__dirname}/public/images/${UUID}.${files.image.type.split('/')[1]}`)
      .then(() => {
        newRoute.imagePath = `${UUID}.${files.image.type.split('/')[1]}`
        newRoute.id = uuidv4().split('-')[0]

        client.connect(DB_URL, function (err, client) {
          if (err) throw err

          var db = client.db(DB_NAME)
          db.collection("routes").insertOne(newRoute, function (err, result) {
            if (err) {
              res.send(err)
            }
            console.log(`Inserted route ${newRoute.id} - ${newRoute.user} ${newRoute.startPoint} ${newRoute.endPoint} ${newRoute.distance}`);
            client.close();
            res.json(result)
          });
          
        })
      })
    // add another information

  });
});

app.listen(3200, () => {
  console.log('Server listening on http://localhost:3200 ...');
});