
function generateMainCircle(circleSize) {
    const mainCircleAngle = Array.from({ length: 200 }, (_, i) => (20 + i * ((340 - 20) / 199)) * Math.PI / 180 + Math.PI / 2);
    const circleRadius = circleSize / 3

    let pathMainCircleString = "";

    const arraysLength = mainCircleAngle.length

    for (let i = 0; i < arraysLength; i++) {        
        const cartesianX = circleSize / 2 + Math.round(circleRadius * Math.cos(mainCircleAngle[i]));
        const cartesianY = circleSize / 2 + Math.round(circleRadius * Math.sin(mainCircleAngle[i]));

        if (i === 0) {
            pathMainCircleString += `M ${cartesianX},${cartesianY} `;
        } else {
            pathMainCircleString += `L ${cartesianX},${cartesianY} `;
        }
    }

    return pathMainCircleString
}

const circleCoordsCalculation = (xArray, yArray, circleSize) => {
    const maxY = Math.max(...yArray);
    const minY = Math.min(...yArray);

    const circleRadius = circleSize / 2.5;
    const radiusDifference = circleRadius * 0.4;
    // svgTextGap.value = circleRadius;

    let pathString = "";
    pathString += `M ${circleSize / 2 + Math.round(circleRadius * Math.cos(20 * Math.PI / 180 + Math.PI / 2))},${circleSize / 2 + Math.round(circleRadius * Math.sin(20 * Math.PI / 180 + Math.PI / 2))} `;

    const arraysLength = xArray.length;

    for (let i = 0; i < arraysLength - 1; i++) {
        const angleStart = (20 + xArray[i] * ((340 - 20) / arraysLength)) * Math.PI / 180 + Math.PI / 2;
        const angleEnd = (20 + xArray[i + 1] * ((340 - 20) / arraysLength)) * Math.PI / 180 + Math.PI / 2;
        console.log(yArray[i] - minY)
        const radiusStart = circleRadius + ((yArray[i] - minY)/ maxY * radiusDifference);
        const radiusEnd = circleRadius + ((yArray[i + 1] - minY) / maxY * radiusDifference);

        const xStart = (circleSize / 2 + radiusStart * Math.cos(angleStart)).toFixed(0);
        const yStart = (circleSize / 2 + radiusStart * Math.sin(angleStart)).toFixed(0);
        const xEnd = (circleSize / 2 + radiusEnd * Math.cos(angleEnd)).toFixed(0);
        const yEnd = (circleSize / 2 + radiusEnd * Math.sin(angleEnd)).toFixed(0);

        let amplitudeOne = 0.5;  // Increased amplitude for more wavy effect
        let amplitudeTwo = 0.5;

        const offsetFactor = 0.0; // Adjust this value to control the intensity of the curve (0.3 to 0.5 is a good range)

        const controlX1 = (xStart * amplitudeOne + xEnd * amplitudeTwo + (yEnd - yStart) * offsetFactor).toFixed(0);
        const controlY1 = (yStart * amplitudeOne + yEnd * amplitudeTwo - (xEnd - xStart) * offsetFactor).toFixed(0);
        const controlX2 = (xStart * amplitudeTwo + xEnd * amplitudeOne - (yEnd - yStart) * offsetFactor).toFixed(0);
        const controlY2 = (yStart * amplitudeTwo + yEnd * amplitudeOne + (xEnd - xStart) * offsetFactor).toFixed(0);

        pathString += `C ${controlX1},${controlY1} ${controlX2},${controlY2} ${xEnd},${yEnd} `;
    }

    return pathString
}

function getSliceOfDictionary(dict, startIndex, endIndex) {
    const entries = Object.entries(dict);
    const slicedEntries = entries.slice(startIndex, endIndex);
    return Object.fromEntries(slicedEntries);
}


function distributeRows(data, colorsArray) {
  const size = Object.keys(data).length;

  const upperRowCount = Math.ceil(size / 2);
  
  const upperRow =  getSliceOfDictionary(data, 0, upperRowCount);
  const upperColor = colorsArray.slice(0, upperRowCount);

  const lowerRow =  getSliceOfDictionary(data, upperRowCount, size);
  const lowerColor = colorsArray.slice(upperRowCount);

  return {
    'upperRow': upperRow,
    'upperColor': upperColor,
    'lowerRow': lowerRow,
    'lowerColor': lowerColor,
  }
}


export {circleCoordsCalculation, generateMainCircle, distributeRows};
