
const polyPath = new google.maps.Polyline({ geodesic: true, strokeOpacity: 1.0, strokeWeight: 2 });
export default function drawPolyline(map, position, distence, isInside) {
    const coordinates = [
        { lat: position[0], lng: position[1] },
        { lat: distence[0], lng: distence[1] }
    ];

    if (isInside) {
        polyPath.setOptions({ strokeColor: '#39FF14' })
    } else {
        polyPath.setOptions({ strokeColor: 'red' })
    }

    polyPath.setPath(coordinates);
    polyPath.setMap(map);
}