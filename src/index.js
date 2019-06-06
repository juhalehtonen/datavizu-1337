const dscc = require('@google/dscc');
// const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');

// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = false;

// write viz code here
// const drawViz = (data) => {
//   viz.firstViz(data);
// };

const drawViz = (data) => {
    let rowData = data.tables.DEFAULT;

    // set margins + canvas size
    const margin = { top: 10, bottom: 50, right: 10, left: 10 };
    const padding = { top: 15, bottom: 15 };
    const height = dscc.getHeight() - margin.top - margin.bottom;
    const width = dscc.getWidth() - margin.left - margin.right;

    // remove the svg if it already exists
    if (document.querySelector("svg")) {
        let oldSvg = document.querySelector("svg");
        oldSvg.parentNode.removeChild(oldSvg);
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", `${height}px`);
    svg.setAttribute("width", `${width}px`);

    const fillColor =  data.style.barColor.value
          ? data.style.barColor.value.color
          : data.style.barColor.defaultValue;

    const maxBarHeight = height - padding.top - padding.bottom;
    const barWidth = width / (rowData.length * 2);

    // obtain the maximum bar metric value for scaling purposes
    let largestMetric = 0;

    rowData.forEach(function(row) {
        largestMetric = Math.max(largestMetric, row["barMetric"][0]);
    });

    rowData.forEach(function(row, i) {
        // 'barDimension' and 'barMetric' come from the id defined in myViz.json
        // 'dimId' is Data Studio's unique field ID, used for the filter interaction
        const barData = {
            dim: row["barDimension"][0],
            met: row["barMetric"][0],
            dimId: data.fields["barDimension"][0].id
        };

        // calculates the height of the bar using the row value, maximum bar
        // height, and the maximum metric value calculated earlier
        let barHeight = Math.round((barData["met"] * maxBarHeight) / largestMetric);

        // normalizes the x coordinate of the bar based on the width of the convas
        // and the width of the bar
        let barX = (width / rowData.length) * i + barWidth / 2;

        // create the "bar"
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", barX);
        rect.setAttribute("y", maxBarHeight - barHeight);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("data", JSON.stringify(barData));
        rect.style.fill = fillColor;
        svg.appendChild(rect);

        // add text labels
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        let textX = barX + barWidth / 2;
        text.setAttribute("x", textX);
        text.setAttribute("text-anchor", "middle");
        let textY = maxBarHeight + padding.top;
        text.setAttribute("y", textY);
        text.setAttribute("fill", fillColor);
        text.innerHTML = barData["dim"];

        svg.appendChild(text);
    });

    document.body.appendChild(svg);
};


if (LOCAL) {
    // renders locally
    drawViz(local.message);
} else {
    // subscribe to data and style changes
    dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
