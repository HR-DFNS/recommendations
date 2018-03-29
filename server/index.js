const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

var isSQL = false;

var Sequelize = require('sequelize');

var sequelize = new Sequelize('wegot', 'root', '', {
  dialect: 'mysql'
})

var RestaurantModel = sequelize.define('Restaurant', {
  name: Sequelize.STRING,
  place_id: Sequelize.INTEGER,
  google_rating: Sequelize.DECIMAL(2, 1),
  zagat_food_rating: Sequelize.DECIMAL(2, 1),
  review_count: Sequelize.INTEGER,
  photos: Sequelize.STRING,
  short_description: Sequelize.STRING,
  neighborhood: Sequelize.STRING,
  location: Sequelize.STRING,
  address: Sequelize.STRING,
  website: Sequelize.STRING,
  price_level: Sequelize.TINYINT,
  types: Sequelize.STRING,
  nearby: Sequelize.STRING
})

var restaurants = require('../db/models/restaurant.js');
var mongoose = require('mongoose');
const dbAddress = process.env.DB_ADDRESS || 'localhost';

var uri = `mongodb://${dbAddress}/wegot`;
mongoose.connect(uri, { useMongoClient: true });

app.use(cors());
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

app.get('/api/restaurants/:id/recommendations', function (req, res) {
  var placeId = req.params.id || 0;
  console.log("GET " + req.url);
  // find recommended restaurants based on id
  var results = [];
  if (isSQL) {
    sequelize
      .query('SELECT * FROM recommendations WHERE place_id = ' + placeId, { model: RestaurantModel })
      .then(data => {
        // Each record will now be mapped to the project's model.
        // console.log(data[0])
        var nearbyArr = data[0].nearby;        
        data[0].photos = (data[0].photos).split(',');
        console.log(JSON.stringify(data[0].photos));
        results.push(data[0]);
  
        sequelize
          .query('SELECT * FROM recommendations WHERE place_id IN (' + nearbyArr + ')', { model: RestaurantModel })
          .then(data => {
            // Each record will now be mapped to the project's model.

            for (var i = 0; i < data.length; i++) {
              data[i].photos = (data[i].photos).split(',');
            }
            results.push(data);
            console.log("sql");
            res.send(results);
          })
      })
  } else {
    restaurants
    .findOne(placeId)
    .then((currentRestaurant) => {
      var nearbyRestaurants = currentRestaurant[0].nearby;
      results.push(currentRestaurant);
      return restaurants
      .findMany(nearbyRestaurants)
    })
    .then((nearby) => {
      results.push(nearby);
      res.status(200);
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.end();
    });
  }
});

app.listen(3004, function () { console.log('WeGot app listening on port 3004!') });
