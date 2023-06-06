const maplibregl = require('maplibre-gl');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
});

console.log(map);
