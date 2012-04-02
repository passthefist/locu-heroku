function SelectorSearch(targ) {
  var loc;
  var map;
  var center;
  var target = $(targ);
  var selectEvt = new Callbacks();
  var selected;
  var markers = [];

  var searchHtml = 
      '<form id="locSearch">' +
        '<input name="location" class="location" type="text">'+
        '<span class="close">Back</span>'+
      '</form>' +
      '<div class="map" style="position: relative; background-color: rgb(229, 227, 223); overflow-x: hidden; overflow-y: hidden; ">' +
      '</div>'

  function init() {
    target.append(searchHtml);

    navigator.geolocation.getCurrentPosition(function(geo){
      loc = geo.coords;
      _.defer(ready);
    }, function(err){
      loc = {
        latitude: 37.787605,
        longitude: -122.4242011 
        };
      _.defer(ready);
    });
  }
  
  function ready(){
    $("#locSearch").submit(function(evt) {
      evt.preventDefault();
      setTimeout(newSearch,100);
    });

    $("#locSearch .close").click(hide);

    $(document).on("click",".addLocation", invokeSelected);
  
    center = new google.maps.LatLng(loc.latitude, loc.longitude);

    map = new google.maps.Map(target.find(".map")[0], {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: center,
      zoom: 16,
      disableDefaultUI: true
    });
    var request = {
      location: center,
      radius: 0
    };
    var service = new google.maps.places.PlacesService(map);
    service.search(request, callback);
  }

  this.show = function() {
    target.show(); 
    google.maps.event.trigger(map, 'resize');
    target.animate({
      top: "0px"
    }, 400, function(){
      setTimeout(function(){
        $("#locSearch .location").val("");
        $("#locSearch .location").focus();
      }, 250);
    });
  };

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
    else
    {
      alert("No places found, or the Google didn't respond.");
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: placeLoc 
    });

    markers.push(marker);
    map.panTo(placeLoc);

    google.maps.event.addListener(marker, 'click', function() {
      var infowindow = new google.maps.InfoWindow({
        maxWidth: 50,
        content: toh(ich.locationBox(place))
      });

      infowindow.open(map, this);
      selected = marker;
    });
  }

  function newSearch(){
    $("#locSearch .location").blur();

    for (var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }

    var request = {
      location: center,
      radius: 2500,
      name: $("#locSearch .location").val()
    };

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.search(request, function(result, status){
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        callback(result, status);
      }else{
        request = {
          location: center,
          radius: 2500,
          keyword: $("#locSearch .location").val()
        };
        service.search(request,callback);
      }
    });
  };

  this.onSelected = function(func){
    selectEvt.add(func);      
  }

  function hide(){
    $("#locSearchContainer").animate({
      top: ($(window).height()+50)
    }, 350);
  }

  function invokeSelected(){
    selectEvt.invoke({
      latitude: selected.position.lat(),
      longitude: selected.position.lng(),
      name: $("#locSearch .location").val()
    });
    hide();
  };
  
  init();
};
