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

    // set margins + canvas size
    const margin = { top: 10, bottom: 50, right: 10, left: 10 };
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

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('width', `${width/2}px`);
    rect.setAttribute('height', `${height/2}px`);
    rect.style.fill =  'blue';

    svg.append(rect);

    document.body.appendChild(svg);
}


if (LOCAL) {
    // renders locally
    drawViz(local.message);
} else {
    // subscribe to data and style changes
    dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
