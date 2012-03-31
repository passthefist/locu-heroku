Namespace("SelectorSearch",function() {
  var loc;
  var center;
  var selector;
  var selectEvt = new Callbacks();

  var searchHtml = 
      '<form id="locSearch">' +
        '<input name="location" class="location" type="text" style="width: 320px;">' +
      '</form>' +
      '<div class="map" style="position: relative; background-color: rgb(229, 227, 223); overflow-x: hidden; overflow-y: hidden; ">' +
      '</div>'

  function init() {
    $("#locSearch").submit(function(evt) {
      evt.preventDefault();
      setTimeout(newSearch,100);
    });
    navigator.geolocation.getCurrentPosition(function(geo){
      loc = geo.coords;
      asyncShow.call();
    }, function(err){
      loc = {
        latitude: 37.787605,
        longitude: -122.4242011 
        };
      asyncShow.call();
    });
  }

  function show(div) {
    $(div).append(searchHtml);
    asyncShow.push($(div).find(".map"));
   
    $(div).show(); 
    $(div).animate({
      opacity: 1.0,
      top: "0px"
    }, 500, function(){
      $("#locSearch .location").focus();
    });
  }

  var asyncShow = new AsyncCall(this, function(div) {
    selector = $(div);
    center = new google.maps.LatLng(loc.latitude, loc.longitude);

    map = new google.maps.Map(selector[0], {
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
  });

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  var markers = [];

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
        maxWidth: 100,
        content: toh(ich.locationBox(place))
      });

      infowindow.open(map, this);
    });
  }

  google.maps.event.addDomListener(window, 'load', init);

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

  function selectedCallback(func){
    selectEvt.add(func);      
  }

  function invokeSelected(){
    selectEvt.invoke();
  };

  return {
    show: show,
    onSelected: selectedCallback
  }
});
