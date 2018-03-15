var mongoose = require('mongoose');

var restaurantSchema = mongoose.Schema({
  name: String,
  place_id: { type: Number, unique: true },
  google_rating: Number,
  zagat_food_rating: Number,
  review_count: Number,
  photos: [String],
  short_description: String,
  neighborhood: String,
  location: { lat: Number, long: Number },
  address: String, 
  website: String,
  price_level: Number,
  types: [String],
  nearby: [String]
});

var RestaurantModel = mongoose.model('Restaurant', restaurantSchema);

// findAll retrieves all stories
function findAll(callback) {
  console.log('finding all!');
  RestaurantModel.find({}, callback);
}

// findOne will retrieve the restaurant associated with the given id
function findOne(id, callback) {
  console.log("find " + id);
  RestaurantModel.find({place_id: id}, callback);
  // RestaurantModel.find({place_id: 'ChIJFUBxSY6AhYARwOaLV7TsLjw'}, callback);
}

// insertOne inserts a restaurant into the db
function insertOne(restaurant, callback) {
  console.log('inserting one restaurant');
  RestaurantModel.create(restaurant, callback);
}

// retrieve many restaurants
function findMany(ids, callback) {
  console.log('find 6 nearby restaurants');
  RestaurantModel.find({place_id: {$in: ids}}, callback);
}

function count(){
  return RestaurantModel.count();
}

exports.RestaurantModel = RestaurantModel;
exports.findOne = findOne;
exports.findAll = findAll;
exports.insertOne = insertOne;
exports.findMany = findMany;
exports.count = count;
