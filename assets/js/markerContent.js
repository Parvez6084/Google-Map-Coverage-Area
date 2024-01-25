
const infowindow = new google.maps.InfoWindow();

function getContent(info, distance, isInCoverage) {
    const convartDistance = distance > 1000 ? (distance / 1000).toFixed(1) + " km" : Math.round(distance) + " m";
    const coverageText = isInCoverage ? "Within Coverage Area" : "Not in Coverage Area";
    const coverageColor = isInCoverage ? "green" : "red";

    return `<div id="content">
                <div id="siteNotice"></div>
                <p id="firstHeading" class="firstHeading"><b>${convartDistance}</b></p>
                <div id="bodyContent">
                    <p>Away from <b>${info}</b>
                </br>
                    <b style="color:${coverageColor};">${coverageText}</b>
                </div>
            </div>`;
}

export default function markerContent(map, splitter, isInCoverageSpliter, marker) {
    const content = getContent(splitter.name, splitter.distance, isInCoverageSpliter);
    infowindow.setContent(content);
    infowindow.open({ anchor: marker, map });
}
