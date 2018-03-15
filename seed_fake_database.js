var data = require('./fake_seed_data.json');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Restaurants = require('./db/models/restaurant.js');
const dbAddress = process.env.DB_ADDRESS || 'localhost';
const faker = require ('faker');


var uri = `mongodb://${dbAddress}/wegot`;
mongoose.connect(uri, { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Connected to DB!');

  //seed database if collection count = 0
  Restaurants.RestaurantModel.count().then( (result) => {
  // Restaurants.count().then( (result) => {
    console.log("Count: " + result);
    if(result === 0){
      console.log('Collection currently empty.')
      getRestaurants(data).then(()=> {
        console.log('goodbye');
        mongoose.connection.close();
      });
    } else {
      console.log('Collection exists.');
      db.close();
    }
  });

});


async function getRestaurants(restData) {
  console.log('Seeding database...');

  var response;
  var photosURLArray = [];
  var googlePhotoURL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400';

  for(var i = 0; i < restData.length; i++){
    var photoRes;
    var rest = restData[i];
    var result = restData[i].result;

    //generate restaurant models for each restaurant
    var restaurant = {
      name: restData[i].name,
      place_id: restData[i].place_id,
      google_rating: restData[i].google_rating,
      zagat_food_rating: restData[i].zagat_food_rating,
      review_count: restData[i].review_count,
      photos: restData[i].photos,
      short_description: restData[i].short_description,
      neighborhood: restData[i].neighborhood,
      location: restData[i].location,
      address: restData[i].address,
      website: restData[i].website,
      price_level: restData[i].price_level,
      types: restData[i].types,
      nearby: restData[i].nearby
    }
    // console.log(restaurant);

    // add restaurant to db
    var obj = new Restaurants.RestaurantModel(restaurant);
    try{
      await obj.save();
    } catch(err){
      console.log(err);
    }
    console.log(restaurant.place_id + " saved");
  }
}

// getRestaurants(restData).then(()=> {
//   console.log('goodbye');
//   mongoose.connection.close();
// });

// mongoimport --db wegot --collection restaurants --drop --file ~/fake_seed_data.json