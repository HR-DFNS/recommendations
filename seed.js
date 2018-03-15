// var restData = require('./seed_data.js');
var data = require('./allData.js');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Restaurants = require('./db/models/restaurant.js');
var api_key = require('./config.js');
const request = require ('request-promise');
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

  for(var i = 0; i < 10; i++){
    var photoRes;
    var rest = restData[i];
    var result = restData[i].result;
    // console.log("Number of photos: ", result.photos.length);
    var photosURLArray = [];
    var photos = result.photos;

    //loop through photoRef array
    for(var j = 0; j < photos.length; j++){
      var photoRefId = photos[j].photo_reference;
      // console.log(photoRefId);
      var photoOptions = {
          url: googlePhotoURL,
          qs: {
            'key': api_key.KEY,
            'photoreference': photoRefId
          },
          json: true,
          headers: {
            'content-type': 'application/json',
          },
      }
      var photoURL;
      try {
        photoRes = await request(photoOptions, (err, res, body) => (
            photoUrl = res.request.href
          )
        )
      } catch(err){
        console.log(err);
      }
      // console.log(photoUrl);
      photosURLArray.push(photoUrl);

    }

    // console.log("number of photos:" + photosURLArray.length);

    //convert types
    var typesArray = [];
    var originalTypes = result.types;
    // console.log(originalTypes.length);
    originalTypes.forEach((type) => {
      typesArray.push(convertString(type));
    });

    //get nearby restaurants
    var resObj = restData.slice();
    resObj.sort((r1, r2) => {
      var d1 = distance(rest, r1);
      var d2 = distance(rest, r2);
      // console.log("d1 "+ d1)
      // console.log("d2 " +d2)
      if(d1 <= d2){
        return -1;
      } else if(d1 > d2){
        return 1;
      }
    });
    var distArr = resObj.slice(1, 7).map((res) => {
      return res.result.place_id;
    })
    // console.log(distArr);

    //generate restaurant models for each restaurant
    var restaurant = {
      name: faker.random.words(),
      place_id: i,
      google_rating: faker.finance.amount(0,5,1),
      zagat_food_rating: faker.finance.amount(0,5,1),
      review_count: faker.random.number(50),
      photos: getFakePhotoUrlsArray(10),
      short_description: faker.lorem.sentence(),
      neighborhood: faker.address.county(),
      location: { lat: faker.address.latitude(), long: faker.address.longitude() },
      address: faker.fake("{{address.streetAddress}}, {{address.city}}, {{address.stateAbbr}} {{address.zipCode}}, {{address.countryCode}}"),
      website: faker.internet.url(),
      price_level: faker.random.number(3) + 1,
      types: getFakeTypesArray(5),
      nearby: getFakeNearbyArray(6)
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

var convertString = (str) => {
  var words = str.split('_');
  for (var i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(' ');
};

var distance = (r1, r2) => {
  var lat1 = r1.result.geometry.location.lat;
  var lon1 = r1.result.geometry.location.lng;
  var lat2 = r2.result.geometry.location.lat;
  var lon2 = r2.result.geometry.location.lng;
  var radlat1 = Math.PI * lat1/180;
  var radlat2 = Math.PI * lat2/180;
  var radlon1 = Math.PI * lon1/180;
  var radlon2 = Math.PI * lon2/180;
  var theta = lon1-lon2;
  var radtheta = Math.PI * theta/180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180/Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};

var getFakePhotoUrlsArray = function(num) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    var height = faker.random.number({min:210, max:190});
    var url = `https://dummyimage.com/300x${height}`
    arr.push(url);
  }
  
  return arr;
}

var getFakeNearbyArray = function (num) {
  var arr = [];
  
  for (var i = 0; i < num; i++) {
    var nearby = faker.random.number(num);
    if (!arr.includes(nearby)) {
      arr.push(nearby);
    }
  }

  return arr;
}

var getFakeTypesArray = function (num) {
  var arr = [];

  var types = [
    "bar",
    "clothing_store",
    "establishment",
    "food",
    "liquor_store",
    "lodging",
    "night_club",
    "point_of_interest",
    "restaurant",
    "store"
  ];

  for (var i = 0; i < num; i++) {
    var type = faker.random.arrayElement(types);
    if (!arr.includes(type)) {
      arr.push(type);
    }
  }

  return arr;
}

