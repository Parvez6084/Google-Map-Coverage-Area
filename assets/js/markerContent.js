
const infowindow = new google.maps.InfoWindow();

export default function markerContent(map, distance, marker) {
    let convartDistance = null;

    if (distance > 1000) {
        convartDistance = (distance / 1000).toFixed(1) + " km";
    } else {
        convartDistance = Math.round(distance) + " m";
    }

    const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' + "</div>" +
        `<p id="firstHeading" class="firstHeading">${convartDistance}</p>` +
        '<div id="bodyContent">' +
        "<p>away from coverage area</p>" +
        "</div>" +
        "</div>";

    infowindow.setContent(contentString);
    infowindow.open({ anchor: marker, map });
}
