import dummySplitterData from "./dummySplitter.js";

const infowindow = new google.maps.InfoWindow();
const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

export default async function splitterOnMap(map) {

    dummySplitterData.forEach((splitter) => {
        const icon = document.createElement("div");
        icon.innerHTML = '<i class="fa-solid fa-wifi"></i>';
        const faPin = new PinElement({ glyph: icon, glyphColor: "#00000", background: "#FFD514", borderColor: "#ff8300" });

        const splitterMarker = new AdvancedMarkerElement({
            map,
            content: faPin.element,
            position: {
                lat: splitter.latlng[0],
                lng: splitter.latlng[1]
            },
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