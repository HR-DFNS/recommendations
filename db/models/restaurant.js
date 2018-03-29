var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

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

function findOne (id) {
  return RestaurantModel.find({ place_id: id }).limit(1);
}

function findMany (ids) {
  return RestaurantModel.find({place_id: {$in: ids}});
}

exports.RestaurantModel = RestaurantModel;
exports.findOne = findOne;
exports.findMany = findMany;
