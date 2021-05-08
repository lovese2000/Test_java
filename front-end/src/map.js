/* eslint-disable no-unused-vars,no-case-declarations */
import mapboxgl from 'mapbox-gl';
import {my_accesstoken} from "@/testdata";
import ClickPopup from "@/ClickPopup";
import socket from "@/socket";
let gui, util, map;

mapboxgl.accessToken = 'your_token';
mapboxgl.accessToken = my_accesstoken;


function highlightBuilding(feature, id = '') {
  if (typeof map.getLayer('building-highlighted' + id) !== "undefined" &&
    map.getSource('building-highlighted' + id)._data.id !== feature.id) {
    map.removeLayer('building-highlighted' + id)
    map.removeSource('building-highlighted' + id);
    
  }
  
  if (typeof map.getLayer('building-highlighted' + id) === "undefined") {
    map.addSource('building-highlighted' + id, {
      "type": "geojson",
      "data": feature.toJSON()
    });
  }
  
  if (typeof map.getLayer('building-highlighted' + id) === "undefined") {
    map.addLayer({
        'id': 'building-highlighted' + id,
        'type': 'fill',
        'source': 'building-highlighted' + id,
        'paint': {
          'fill-outline-color': '#795547',
          'fill-color': '#795547',
          'fill-opacity': 1,
        },
      }
    )
  }
}

function mapFlyTo(lat, lng) {
  map.flyTo({
    center: [lng, lat],
    essential: true
  });
}

let clickPopup;
/* ---------- main entry ---------- */
function main() {
  
  socket.on('resultBlockID', async function (message) {
    if(message.properties.status === 'success') {
      clickPopup.block = 'Retrieve Block #' + message.properties.id;
      clickPopup.blockID = message.properties.id;
    } else {
      clickPopup.block = 'No valid block';
      clickPopup.blockID = -1;
  
    }
  })
  
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/amomorning/ckn77mtlw04ed17o3a7s1q2yn', // style URL
    center: [16.373, 48.208], // starting position [lng, lat]
    minZoom: 12,
    maxZoom: 17.5,
    zoom: 15.75,
    antialias: true
  });
  
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  map.on('load', () => {
    
    map.on('mousemove', function (e) {
        let feature = map.queryRenderedFeatures(e.point, {layers: ['building']})[0];
        if (feature === undefined) {
          if (typeof map.getLayer('building-highlighted') !== "undefined") {
            map.removeLayer('building-highlighted')
          }
          if (typeof map.getSource('building-highlighted') !== "undefined") {
            map.removeSource('building-highlighted')
          }
        } else {
          
          if (feature.id !== undefined) {
            let range = []
            let canvas = map.getCanvasContainer();
            range.push(new mapboxgl.Point(0, 0));
            range.push(new mapboxgl.Point(canvas.clientWidth, canvas.clientWidth))
            let sameid = map.queryRenderedFeatures(range, {layers: ['building']});
            let coords = feature.geometry.coordinates;
            feature.geometry.coordinates = [coords];
            
            for (let i = 0; i < sameid.length; ++i) {
              if (sameid[i].id === feature.id) {
                
                if (sameid[i].geometry.type === 'MultiPolygon') {
                  for (let j = 0; j < sameid[i].geometry.coordinates.length; ++j) {
                    feature.geometry.coordinates.push(sameid[i].geometry.coordinates[j]);
                  }
                  
                } else {
                  feature.geometry.coordinates.push(sameid[i].geometry.coordinates);
                }
              }
            }
            feature.geometry.type = 'MultiPolygon';
            
          }
          
          highlightBuilding(feature);
          
        }
      }
    );
  
    map.on('click', function(e) {
      let coordinates = e.lngLat;
      socket.emit('mapQueryBlockID', {properties:{lat:coordinates.lat, lng:coordinates.lng}})
  
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML('<div id="popup-content"></div>')
        .addTo(map);
      clickPopup = new ClickPopup({
        propsData: {lat: coordinates.lat, lon:coordinates.lng, block:"loading..."},
      }).$mount('#popup-content');
    });
  })
  
}

export {
  main,
  mapFlyTo
}
