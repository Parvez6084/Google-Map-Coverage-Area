import dummySplitterData from "./dummySplitter.js";
const infowindow = new google.maps.InfoWindow();

export default async function splitterOnMap(map) {

    dummySplitterData.forEach((splitter) => {
        const splitterMarker = new google.maps.Marker({
            position: { lat: splitter.latlng[0], lng: splitter.latlng[1] },
            title: splitter.name, map: map,
        });

        const contentString =
            '<div id="content">' +
            '<div id="siteNotice">' + "</div>" +
            `<p id="firstHeading" class="firstHeading">Name: ${splitter.name}</p>` +
            '<div id="bodyContent">' +
            `<p>Address: ${splitter.address}</p>` +
            `<p>Range: ${splitter.range}</p>` +
            "</div>" +
            "</div>";


        splitterMarker.addListener("click", () => {
            infowindow.setContent(contentString);
            infowindow.open(map, splitterMarker);
        });
    });

}