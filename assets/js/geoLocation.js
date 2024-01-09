
export async function geoLocation() {
    try {
        const geo = await fetch('link3area.geojson');
        const geoJsonData = await geo.json();
        return geoJsonData.features;
    } catch (error) {
        console.error('Error loading GeoJSON file:', error);
        return error;
    }
}

export async function drawPolygon(map) {
    const styleOptions = {
        strokeColor: "red",
        strokeWeight: 2,
        strokeOpacity: 1,
        fillColor: "red",
        fillOpacity: 0.3,
    };

    const geoJson = await geoLocation();

    geoJson.forEach(feature => {
        const geometry = feature.geometry;
        if (geometry && geometry.type === 'Polygon') {

            const coordinates = geometry.coordinates[0]; // Get polygon coordinates
            let filterCoordinates = coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
            const polyArea = new google.maps.Polygon({ paths: filterCoordinates, map: map, clickable: false });
            polyArea.setOptions(styleOptions);
        }
    });
}

// Function to calculate centroid of a polygon
function getCentroid(coords) {
    let center = { lat: 0, lng: 0 };
    coords.forEach(coord => {
        center.lat += coord[1];
        center.lng += coord[0];
    });
    center.lat /= coords.length;
    center.lng /= coords.length;
    return new google.maps.LatLng(center.lat, center.lng);
}
