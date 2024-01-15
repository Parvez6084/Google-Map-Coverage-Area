
const polyPath = new google.maps.Polyline({
    geodesic: true, strokeColor: "#FF0000",
    strokeOpacity: 1.0, strokeWeight: 2
});

export default function drawPolyline(map, position, distence) {
    const coordinates = [
        { lat: position[0], lng: position[1] },
        { lat: distence[0], lng: distence[1] }
    ];
    polyPath.setPath(coordinates);
    polyPath.setMap(map);
}