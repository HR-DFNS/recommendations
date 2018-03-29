var fs = require('fs');
var faker = require('faker');
var file = fs.createWriteStream('./fake_seed_data.json');
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
var end = 100000;

for (var i = start; i <= end; i++) {
  var restaurant = JSON.stringify({
    name: faker.company.companyName(), // string
    place_id: i, // number, primary key
    google_rating: faker.finance.amount(0,5,1), // number
    zagat_food_rating: faker.finance.amount(0,5,1), // number
    review_count: faker.random.number(50),// number
    photos: getFakePhotoUrlsArray(10),
    short_description: faker.lorem.sentence(), // string
    neighborhood: faker.address.county(), // string
    location: { lat: faker.address.latitude(), long: faker.address.longitude() }, // split into two numbers
    address: getFakeAddressString(), // string
    website: faker.internet.url(), // string
    price_level: faker.random.number({min:1, max:4}), // number
    types: getFakeTypesArray(5), // table with primary ids
    nearby: getFakeNearbyArray(20) 
  });

  if (i === start) {
    file.write('[\n' + restaurant + ',\n');
  } else if (i === end) {
    file.write(restaurant + '\n]');
  } else {
    file.write(restaurant + ',\n');
  }

  if (i % (end/10) === 0) {
    console.log(i/end*100 + '% Complete.');
  }
}

file.end();

var elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
console.log('Creating seed data took ' + elapsedSeconds + ' seconds');

function parseHrtimeToSeconds(hrtime) {
  var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
  return seconds;
}