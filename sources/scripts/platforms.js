/**
 * Generates a single platform
 * @param context ctx - the canvas context where draw the platform
 * @param x int - left position of the platform
 * @param y int - top position of the platform
 * @param width int - width of the platform
 * @param height int - height of the platform
 */
function generatePlatform(context, platform) {
    var [x, y, width, height] = platform;
    // Number of spikes on platform
    let splitNumber = Math.min(width / 10, 25 + 5 * gaussianRandom());

    // Sets the dot list under the platform
    let dotList = [];
    let i = x;
    while(i < x + width - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= x + width) {
            break;
        }
        dotList.push([i, y + height / 3 + (gaussianRandom() + 1) * height * 2 / 3]);
    }
    
    // Draws platform line 2px under under (decoration)
    context.beginPath();
    context.moveTo(x, y + 2);
    for(let dot in dotList) {
        context.lineTo(dotList[dot][0], dotList[dot][1] + 2);
    }
    context.lineTo(x + width, y + 2);
    context.fillStyle = '#376d91';
    context.fill();

    //Draws platform
    context.beginPath();
    context.moveTo(x, y);
    for(let dot in dotList) {
        context.lineTo(dotList[dot][0], dotList[dot][1]);
    }
    context.lineTo(x + width, y);
    context.fillStyle = '#122937';
    context.fill();

    // Draws grass on platform
    context.beginPath();
    context.moveTo(x, y);
    splitNumber = Math.min(width / 50, 5 + 5 * gaussianRandom());
    i = x;
    while(i < x + width - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= x + width) {
            break;
        }
        context.lineTo(i, y + 2 + (gaussianRandom() + 1) * 3);
    }
    context.lineTo(x + width, y);
    context.fillStyle = '#376d91';
    context.fill();
}