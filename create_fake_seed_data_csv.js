var fs = require('fs');
var faker = require('faker');
var file = fs.createWriteStream('./recommendations.csv');

var startTime = process.hrtime();

var getFakeAddressString = function() {
  return faker.fake("{{address.streetAddress}}, {{address.city}}, {{address.stateAbbr}} {{address.zipCode}}, {{address.countryCode}}");
}

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

var start = 0;
var end = 10;
for(var i=start; i<= end; i++) {
  var restaurant = {
    name: faker.company.companyName(),
    place_id: i,
    google_rating: faker.finance.amount(0,5,1),
    zagat_food_rating: faker.finance.amount(0,5,1),
    review_count: faker.random.number(50),
    photos: getFakePhotoUrlsArray(10),
    short_description: faker.lorem.sentence(),
    neighborhood: faker.address.county(),
    location: [ faker.address.latitude(), faker.address.longitude() ],
    address: getFakeAddressString(),
    website: faker.internet.url(),
    price_level: faker.random.number({min:1, max:4}),
    types: getFakeTypesArray(5),
    nearby: getFakeNearbyArray(20)
  };
  
  file.write(restaurant.name + '^' + restaurant.place_id + '^' + restaurant.google_rating + '^' + restaurant.zagat_food_rating + '^' + restaurant.review_count + '^' + restaurant.photos + '^' + restaurant.short_description + '^' + restaurant.neighborhood + '^' + restaurant.location + '^' + restaurant.address + '^' + restaurant.website + '^' + restaurant.price_level + '^' + restaurant.types + '^' + restaurant.nearby + '^\n');
  // var keys = Object.keys(restaurant);
  // for (var j = 0; j < keys.length; j++) {
  //   file.write(restaurant[keys[j]] + '^');
  // }
  // file.write('\n');
}

file.end();

var elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
console.log('Creating seed data took ' + elapsedSeconds + ' seconds');
function parseHrtimeToSeconds(hrtime) {
  var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
  return seconds;
}