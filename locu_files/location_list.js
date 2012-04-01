function locationList(){
  var locations = saveable("locations", []);

  this.add = function(tag, lat, lng){
    locations.push({
      tag: tag,
      coords : {
        latitude: lat,
        longitude: lng
      }
    });  
    locations.save();
  };

  this.remove = function(tag) {
    var index = _.find(locations, function(value) {
      return value.tag === tag;
    });
    locations.splice(index,1);
  };
}
