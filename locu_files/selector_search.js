$.namespace("LocationSearch",function() {
    function toh(arr){
      return _.chain(arr)
        .map(function(elem){
          console.log(this)
          return $(elem)[0].outerHTML;
        })
        .compact()
        .reduce(function(memo, elem){
          return memo + elem;
        })
        .value();
    };

    function init() {
      navigator.geolocation.getCurrentPosition(function(loc){
        start(loc.coords);
        }, function(err){
          start({
            latitude: 37.787605,
            longitude: -122.4242011 
            });
        });
    }

    var center;
    function start(loc) {
      center = new google.maps.LatLng(loc.latitude, loc.longitude);

      map = new google.maps.Map(document.getElementById('map'), {
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

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    var markers = [];

    function createMarker(place) {
      console.log(place);
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

    function doSearch(){
      $("#inputID").blur();
      setTimeout(newSearch,100);
      return false;
    };

    function newSearch(){
      $("#map").focus();

      for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
      }

      var request = {
        location: center,
        radius: 2500,
        name: $("#search .location").val()
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
            keyword: $("#search .location").val()
          };
          service.search(request,callback);
        }
      });
    };
  }

