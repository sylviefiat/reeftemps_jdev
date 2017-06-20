var map, vectorSource, selectClick,selected_collection;
var reeftemps_sos_url='http://sosoceano.ird.nc/';
var reeftemps_wfs_url='http://sitecpso.ird.nc/geoserver';
var criobe_wfs_url='http://observatoire.criobe.pf/geoserver/criobe';

var defaultZoom = 3;
var centreLat = -16.07;
var centreLon = 174.56;
var mapProjection = 'EPSG:3857';
var geographicProjection = 'EPSG:4326';

function reeftempsStyle(feature) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          stroke: new ol.style.Stroke({
            color: '#a4c537',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: [255,255,255,0.7]
          })
        })
      });
      return [style];
}
function selectStyle(feature) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          stroke: new ol.style.Stroke({
            color: '#FFF',
            width: 2
          }),
          fill: new ol.style.Fill({
            color: '#ee7f01'
          })
        })
      });
      return [style];
}
function criobeStyle(feature) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          stroke: new ol.style.Stroke({
            color: '#BB0B0B',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: [255,255,255,0.4]
          })
        })
      });
      return [style];
}


function changeView(centreLon, centreLat, zoom){
	centre = ol.proj.transform([centreLon, centreLat], geographicProjection, mapProjection);
	map.setView(new ol.View({
        center: centre,
        zoom: zoom})
	);
}

function init(){
  var defaultZoom = 4;
  var centreLat = -10;
  var centreLon = 174.56;
  initMap(centreLon,centreLat,defaultZoom);
}

function initMap(centreLon, centreLat, zoom) {
	 // Declare a Tile layer with an OSM source
    var osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
    var bingLayer = new ol.layer.Tile({
      source: new ol.source.BingMaps({
            key: 'AiY3BBonUo3ah7DOGnW3raeuGcP84sw1ekzjCIYHYXRYOEWI73K5tcsGho2EdxEa',
            imagerySet:'AerialWithLabels'
          })
      });

    var centre = ol.proj.transform([centreLon, centreLat], geographicProjection, mapProjection);
        
    // Instanciate a Map, set the object target to the map DOM id
    var map = new ol.Map({
      target: 'map',
      layers: [bingLayer],
      view: new ol.View({
          center: centre,
          zoom: zoom
        })
    });
    
    map.addControl(new ol.control.MousePosition({
  		projection: geographicProjection,
  		coordinateFormat: ol.coordinate.createStringXY(4),
  		className: 'custom-mouse-position',
  		target: document.getElementById('mouse-position'),
  	    undefinedHTML: '&nbsp;'
	  }));
    
    reeftempsSource = new ol.source.Vector({
        loader: function (extent, resolution, projection) {
          var urlReeftemps = reeftemps_wfs_url+'/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=topp:reeftemps_network&outputFormat=json';
         
          var geojsonFormat = new ol.format.GeoJSON();
          $.ajax(urlReeftemps).then(function (response) {
            var features = geojsonFormat.readFeatures(response, {
                featureProjection: projection
            });
            reeftempsSource.addFeatures(features);
            var s2 = document.getElementById('selStas');
          });     
        }
    });
    
    // reeftemps layer
    var reeftemps =  new  ol.layer.Vector({
      title: "Stations Reeftemps",
      source: reeftempsSource,
      style: reeftempsStyle
    });
    map.addLayer(reeftemps);

   /* criobeSource = new ol.source.Vector({
      loader: function (extent, resolution, projection) {
        var filter;
        var f = ol.format.ogc.filter;
        
        filter = f.not(f.and(f.isNull('houlographe'),f.isNull('thermographe')));
        
        
        var featureRequest = new ol.format.WFS().writeGetFeature({
          srsName: 'EPSG:900913',
          featureNS: 'http://criobe',
          featureTypes: ['polynesia_mana'],
          outputFormat: 'application/json',
          filter: filter
        });
          // then post the request and add the received features to a layer
        fetch(criobe_wfs_url+'/wfs', {
          method: 'POST',
          body: new XMLSerializer().serializeToString(featureRequest)
        }).then(function(response) {
          return response.json();
        }).then(function(json) {      
          var features = new ol.format.GeoJSON().readFeatures(json);
          criobeSource.addFeatures(features);
        });
      }
    });
    var criobe = new ol.layer.Vector({
      title: "Stations Polymana",
      source: criobeSource,
      style: criobeStyle
    });
	  map.addLayer(criobe);*/
   
    
}
