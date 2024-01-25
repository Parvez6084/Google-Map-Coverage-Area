
const { Map } = await google.maps.importLibrary("maps");
const { LatLng } = await google.maps.importLibrary("core");
import isInCoverageArea from "./isInCoverageArea.js";
import { polyAreaCalculation, splitterCalculation } from "./distanceCalculation.js";
import { drawPolygon } from "./geoLocation.js";
import message from "./setToast.js";
import drawPolyline from "./drawPolyline.js";
import splitterOnMap from "./setSplitter.js";
import markerContent from "./markerContent.js";


let map;
let markers = [];
let checkSplitterOnMap = false;
const form = document.querySelector("#locationInfo");
const locationButton = document.getElementById("check-location-btn");




form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    var marker = setMarker({ lat: +data.lat, lng: +data.lon });

    if (checkSplitterOnMap) {

        let calculation = await splitterCalculation(+data.lat, +data.lon);
        let isInCoverageSpliter = calculation.distance < calculation.splitter.range;

        markerContent(map, calculation, isInCoverageSpliter, marker);
        drawPolyline(map, [+data.lat, +data.lon], [calculation.splitter.latlng[0], calculation.splitter.latlng[1]]);
        message(isInCoverageSpliter);

    } else {

        // const isInCoverage = await isInCoverageArea(data.lat, data.lon);
        // message(isInCoverage);
        // if (!isInCoverage) {
        //     let calculation = await polyAreaCalculation(+data.lat, +data.lon);
        //     markerContent(map, calculation.distance, marker);
        //     drawPolyline(map, [+data.lat, +data.lon], [calculation.lat, calculation.lng]);
        // }
    }

});

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById("lat").value = position.coords.latitude;
            document.getElementById("lon").value = position.coords.longitude;
            setMarker({ lat: position.coords.latitude, lng: position.coords.longitude });
        });

    }
});

document.getElementById('clear-button').addEventListener('click', function () {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    setMarker(null);
});

document.getElementById("set-pin-on-map").addEventListener('click', function (event) {
    if (this.checked) {
        map.addListener("click", (event) => {
            document.getElementById("lat").value = event.latLng.lat();
            document.getElementById("lon").value = event.latLng.lng();
            setMarker(event.latLng);
        });
    }
    else {
        google.maps.event.clearListeners(map, 'click');
    }
});

document.getElementById("check-splitter-on-map").addEventListener('click', function (event) {
    checkSplitterOnMap = this.checked;
});

async function initMap() {
    const bdLatLngBounds = {
        north: 26.5, south: 20.5,
        east: 93, west: 87
    };

    const zoom = 7.2;
    const maxZoom = 19.5;
    const mapId = "15600c0b0ae785bb";
    const cameraPosition = new LatLng(23.6850, 90.3563);

    const input = document.getElementById("address");
    const searchBox = new google.maps.places.SearchBox(input);

    map = new Map(document.getElementById("map"), {
        mapId: mapId,
        center: cameraPosition,
        gestureHandling: "greedy",
        zoomControl: false,
        fullscreenControl: false,
        zoom: zoom, minZoom: zoom, maxZoom: maxZoom,
        restriction: { latLngBounds: bdLatLngBounds },
    });

    // await drawPolygon(map);
    await splitterOnMap(map);

    map.addListener("bounds_changed", () => { searchBox.setBounds(map.getBounds()); });
    searchBox.addListener("places_changed", () => {

        const places = searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();
        if (places.length == 0) { return; }

        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) { return; }

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

}

function setMarker(position) {
    // Clear all existing markers
    if (markers.length > 0) {
        markers.forEach((marker) => { marker.setMap(null); });
        markers = [];
    }

    // Create a new marker and add it to the map
    const marker = new google.maps.Marker({ position, map });
    markers.push(marker);
    map.setZoom(18);
    map.setCenter(position);
    return marker;

}



window.initMap = initMap();