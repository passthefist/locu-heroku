function locationList(selector){
  var target = $(selector);
  var locations = saveable("locations", []);
  var selectEvt = new Callbacks();
  var newEvt = new Callbacks();

  this.add = function(tag, lat, lng){
    locations.push({
      tag: tag,
      coords : {
        latitude: lat,
        longitude: lng
      }
    });  
    locations.save();
    render();
  };

  this.remove = function(tag) {
    var index = _.find(locations, function(value) {
      return value.tag === tag;
    });
    locations.splice(index,1);
  };

  this.coordsFor = function(tag) {
    var index = _.find(locations, function(val) {
      return value.tag === tag;
    });
    return locations[index].coords;
  } 

  this.onSelected = function(func){
    selectEvt.add(func);      
  }

  this.onNew = function(func){
    newEvt.add(func);      
  }

  function invokeSelected(loc){
    selectEvt.invoke(loc);
  }

  function invokeNew(){
    newEvt.invoke();
  }

  function render() {
    target.empty();
    _.each(locations, function (loc){
      $(ich.locButton(loc)).appendTo(target)
      .click(function() {
        invokeSelected(loc);
      });
    });
    ich.locButton({tag: "+ Add Location +"}).appendTo(target)
    .click(invokeNew);
  }

  render();
}
