const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

var isSQL = true;

var Sequelize = require('sequelize');

var sequelize = new Sequelize('wegot', 'root', '', {
  dialect: 'mysql'
})

var RestaurantModel = sequelize.define('Restaurant', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  deadline: Sequelize.STRING,
  place_id: Sequelize.STRING,
  google_rating: Sequelize.STRING,
  zagat_food_rating: Sequelize.STRING,
  review_count: Sequelize.STRING,
  photos: Sequelize.STRING,
  short_description: Sequelize.STRING,
  neighborhood: Sequelize.STRING,
  location: Sequelize.STRING,
  address: Sequelize.STRING,
  website: Sequelize.STRING,
  price_level: Sequelize.STRING,
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
            res.send(results);
          })
      })
  } else {
    restaurants.findOne(placeId, (err, data)=> {
      if(err){
        res.status(500);
        console.log(err);
      } else{
        //console.log("restaurant info:",data);
        var nearbyArr = data[0].nearby;
        // console.log(nearbyArr);
        results.push(data[0]);
        console.log(JSON.stringify(data[0].photos));
  
        restaurants.findMany(nearbyArr, (err, data)=> {
          if(err){
            res.status(500);
            console.log(err);
          } else{
            //console.log("recommended restaurants:", data);
            results.push(data)
            // console.log("number of recommended: " + data.length);
            res.status(200);
            // res.send(data);
            // console.log(results.length);
            console.log("sql");
            res.send(results);
          }
        });
      }
    });
  }
});


app.listen(3004, function () { console.log('WeGot app listening on port 3004!') });
