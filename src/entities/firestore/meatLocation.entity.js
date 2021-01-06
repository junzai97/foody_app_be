function MeatLocation(meatId, latitude, longitude, geohash) {
  this.meatId = meatId;
  this.latitude = latitude;
  this.longitude = longitude;
  this.geohash = geohash;
}

module.exports = MeatLocation;
