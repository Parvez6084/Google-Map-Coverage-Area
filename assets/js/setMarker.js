let markers = [];
export default function setMarker(map, position) {
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