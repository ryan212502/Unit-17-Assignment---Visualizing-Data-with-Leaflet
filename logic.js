// set map object variable
var myMap = L.map("map", {
    center: [37,-95],
    zoom: 3,
  });

    L.tileLayer("https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?" +
    "access_token=pk.eyJ1IjoicndtMTExIiwiYSI6ImNqajR3bnJ5bTFqem0zcnVvZ2Z5ZW02MjAifQ.F5wJuxzaFrZTAjQ7_gw5MA").addTo(myMap);

  var queryUrl = new XMLHttpRequest(); 
  queryUrl.open("GET",'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',false);
  queryUrl.send(null);
  queryUrl.responseText
  
  var json_obj = JSON.parse(queryUrl.responseText);
  
  function markerSize(num) {
    return num;
  }

   var colors = ['blue','green','yellow','orange','red','black']
  
  for (var i = 0; i < json_obj.features.length; i++) {
    var feature = json_obj.features[i];
    var loc = feature.geometry.coordinates;
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];
    if (magnitude < 1){
      col = colors[0]
    } else if (magnitude >= 1 && magnitude < 2){
      col = colors[1]
    } else if (magnitude >= 2 && magnitude < 3){
      col = colors[2]
    } else if (magnitude >= 3 && magnitude < 4){
      col = colors[3]
    } else if (magnitude >= 4 && magnitude < 5){
      col = colors[4]
    } else {
      col = colors[5]
    }
    L.circleMarker([loc[1], loc[0]], {
      fillOpacity: .5,
      color: "black",
      fillColor: col,
      weight: 1,
      radius: markerSize(magnitude * 3)
    }).bindPopup("<h3>Magnitude : " + magnitude + "</h3>"+"<strong>Depth: </strong>" + depth + ' kilometers'+
        '<br>'+new Date(feature.properties.time) )
      .addTo(myMap);
  }
  
  var legend = L.control({position: 'bottomleft'});
  
  legend.onAdd = function (mymap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
        
          grades = [0,1,2,3,4,5];
          div.innerHTML = '<h3>Earthquake Magnitude</h3>'

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
    }
    return div;
  };
  
  legend.addTo(myMap);