(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        dGeoAuto: function(dOptions) {
 
            //Settings list and the default values
            var defaults = {
                mapid: "d_map_canvas",
                addressid: "daddress",
				dCountry:"it",
				zoom: 16,
				dLat: 12,
				dLon: 14,
				dLatfield:'dlatitude',
				dLongfield:'dlongitude',
				mapTypeId: google.maps.MapTypeId.HYBRID
            };
             
            var dOptions = $.extend(defaults, dOptions);
			
			
			
            return this.each(function() {
			
			var geocoder;
			var map;
			var marker;
			
			function initialize(){
				//MAP
				  var latlng = new google.maps.LatLng(o.dLat,o.dLon);
				  var options = {
					zoom: o.zoom,
					center: latlng,
					mapTypeId: o.mapTypeId
				  };
						
				  map = new google.maps.Map(document.getElementById(o.mapid), dOptions);
						
				  //GEOCODER
				  geocoder = new google.maps.Geocoder();
						
				  marker = new google.maps.Marker({
					map: map,
					draggable: true
				  });
								
				}
			
                var o =dOptions;						 
				  $(document).ready(function() {
				  initialize();
					var location = new google.maps.LatLng(o.dLat, o.dLon);
						marker.setPosition(location);
						map.setCenter(location);
					$(function() {
					$("#"+o.addressid).autocomplete({
					  //This bit uses the geocoder to fetch address values
					  source: function(request, response) {
						geocoder.geocode( {'address': request.term+','+o.dCountry}, function(results, status) {
						  response($.map(results, function(item) {
							return {
							  label:  item.formatted_address,
							  value: item.formatted_address,
							  latitude: item.geometry.location.lat(),
							  longitude: item.geometry.location.lng()
							}
						  }));
						})
					  },
					  //This bit is executed upon selection of an address
					  select: function(event, ui) {
						$("#"+o.dLatfield).val(ui.item.latitude);
						$("#"+o.dLongfield).val(ui.item.longitude);
						var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
						marker.setPosition(location);
						map.setCenter(location);
					  }
					});
					
				  });
				  //Add listener to marker for reverse geocoding
					google.maps.event.addListener(marker, 'drag', function() {
						geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								if (results[0]) {
									$("#"+o.addressid).val(results[0].formatted_address);
									$("#"+o.dLatfield).val(marker.getPosition().lat());
									$("#"+o.dLongfield).val(marker.getPosition().lng());
								}
							}
						});
					});
				  
                });
            });
        }
    });
})(jQuery);