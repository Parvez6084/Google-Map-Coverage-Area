import { geoLocation } from "./geoLocation.js";

export default async function isInCoverageArea(map, lat, lng) {

    let isInCoverage = false;
    const geoJson = await geoLocation();
    let currentLocation = new google.maps.LatLng(+lat, +lng);

    for (let i = 0; i < geoJson.length; i++) {
        const geometry = geoJson[i].geometry;

        if (geometry && geometry.type === 'Polygon') {
            const coordinates = geometry.coordinates[0];
            let filterCoordinates = coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
            const polyArea = new google.maps.Polygon({ paths: filterCoordinates });
            var isInside = google.maps.geometry.poly.containsLocation(currentLocation, polyArea);

            if (isInside) {
                isInCoverage = true;
                polyArea.setOptions({
                    map: map,
                    strokeColor: "green",
                    strokeWeight: 2,
                    strokeOpacity: 1,
                    fillColor: "green",
                    fillOpacity: 0.3,
                });
                console.log('yes>>>>>>>>>>');
                break;
            } else {
                isInCoverage = false;
                console.log('no>>>>>>>>>>');
            }
        }
    }

    return isInCoverage;
}