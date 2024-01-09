import { geoLocation } from "./geoLocation.js";

export default async function distanceCalculation(lat, lng) {

    const geoJson = await geoLocation();
    let currentLocation = new google.maps.LatLng(+lat, +lng);
    let shortestDistance = { lat: null, lng: null, distance: 99999 }
    for (let i = 0; i < geoJson.length; i++) {
        const geometry = geoJson[i].geometry;

        if (geometry && geometry.type === 'Polygon') {
            const coordinates = geometry.coordinates[0];
            let filterCoordinates = coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));

            for (let i = 0; i < filterCoordinates.length; i++) {
                const distance = google.maps.geometry.spherical.computeDistanceBetween(
                    currentLocation, filterCoordinates[i]);

                if (distance < shortestDistance.distance) {
                    shortestDistance.lat = filterCoordinates[i].lat;
                    shortestDistance.lng = filterCoordinates[i].lng;
                    shortestDistance.distance = distance;
                }
            }
        }
    }

    return shortestDistance;
}