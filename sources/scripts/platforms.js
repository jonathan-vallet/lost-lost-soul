/**
 * Generates a single platform
 * @param context ctx - the canvas context where draw the platform
 * @param x int - left position of the platform
 * @param y int - top position of the platform
 * @param width int - width of the platform
 * @param height int - height of the platform
 */
function generatePlatform(context, platform) {
    var [xStart, y, xEnd] = platform;
    var height = 30;
    // Number of spikes on platform
    var splitNumber = Math.min((xEnd - xStart) / 10, 25 + 5 * gaussianRandom());

    // Sets the dot list under the platform
    var dotList = [];
    var i = xStart;
    while(i < xEnd - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= xEnd) {
            break;
        }
        dotList.push([i, y + height / 3 + (gaussianRandom() + 1) * height * 2 / 3]);
    }
    
    // Draws platform line 2px under under (decoration)
    context.beginPath();
    context.moveTo(xStart, y + 2);
    for(var dot in dotList) {
        context.lineTo(dotList[dot][0], dotList[dot][1] + 2);
    }
    context.lineTo(xEnd, y + 2);
    context.fillStyle = '#376d91';
    context.fill();

    //Draws platform
    context.beginPath();
    context.moveTo(xStart, y);
    for(var dot in dotList) {
        context.lineTo(dotList[dot][0], dotList[dot][1]);
    }
    context.lineTo(xEnd, y);
    context.fillStyle = '#122937';
    context.fill();

    // Draws grass on platform
    context.beginPath();
    context.moveTo(xStart, y);
    splitNumber = Math.min((xEnd - xStart) / 50, 5 + 5 * gaussianRandom());
    i = xStart;
    while(i < xEnd - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= xEnd) {
            break;
        }
        context.lineTo(i, y + 2 + (gaussianRandom() + 1) * 3);
    }
    context.lineTo(xEnd, y);
    context.fillStyle = '#376d91';
    context.fill();
}