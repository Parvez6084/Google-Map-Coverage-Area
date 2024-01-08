
const { Map } = await google.maps.importLibrary("maps");
const { LatLng } = await google.maps.importLibrary("core");
const { poly } = await google.maps.importLibrary("geometry");
import isInCoverageArea from "./isInCoverageArea.js";
import { drawPolygon } from "./geoLocation.js";

let map;
let markers = [];
const form = document.querySelector("#locationInfo");
const locationButton = document.getElementById("check-location-btn");
const toast = document.querySelector(".toast");
const progressBar = document.querySelector(".progress");



form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    setMarker({ lat: +data.lat, lng: +data.lon });

    const isInCoverage = await isInCoverageArea(map, data.lat, data.lon);
    if (isInCoverage) {
        showMessage("Yahoo!!", "Link3 provides coverage in this area", "5px solid green");
    } else {
        showMessage("Oops!!", "Sorry, we do not have coverage in this area", "5px solid red");
    }
});

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById("lat").value = position.coords.latitude;
            document.getElementById("lon").value = position.coords.longitude;
            setMarker({ lat: position.coords.latitude, lng: position.coords.longitude });
        });

    } else {
        handleLocationError(false, map.getCenter());
    }
});

document.querySelector(".close").addEventListener("click", function () {
    toast.classList.remove("active");
    progressBar.classList.remove("active");
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

    await drawPolygon(map);

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

function showMessage(header, body, color) {
    document.getElementById("toast-head").innerHTML = header;
    document.getElementById("toast-body").innerHTML = body;
    toast.style.borderBottom = color;
    toast.classList.add("active");
    progressBar.classList.add("active");
    setTimeout(() => {
        progressBar.classList.remove("active");
        toast.classList.remove("active");
    }, 5000);
}

function setMarker(position) {
    // Clear all existing markers
    if (markers.length > 0) {
        markers.forEach((marker) => { marker.setMap(null); });
        markers = [];
        console.log('Checking>>>>>>', markers);
    }

    // Create a new marker and add it to the map
    const marker = new google.maps.Marker({ position, map });
    markers.push(marker);
    map.setZoom(18);
    map.setCenter(position);


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
}

window.initMap = initMap();