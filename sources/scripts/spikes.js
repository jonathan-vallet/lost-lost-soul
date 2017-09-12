/**
 * Generates a single spike platform
 * @param context ctx - the canvas context where draw the spikes
 * @param spike array - spike data (x, y, end x...)
 */
function generateSpike(context, spike) {
    var [xStart, y, xEnd] = spike;
    var height = 20;
    // Number of spikes to draw

    // Draws spikes line 2px under under (decoration)
    context.beginPath();
    context.moveTo(xStart, y + 1);
    var currentX = xStart;
    var isSpike = true;
    var spikeWidth = 0;
    do {
        if(isSpike) {
            isSpike = false;
            currentX += spikeWidth;
        } else {
            isSpike = Math.random() < 0.4;
            var spikeWidth = Math.floor(Math.random() * 4 + 2);
            currentX += spikeWidth;
        }

        context.lineTo(currentX, isSpike ? (gaussianRandom() - 1) * height + y : y);
    } while (currentX < xEnd - 6);
    context.lineTo(xEnd, y + 1);
    context.lineTo(xStart, y + 1);
    context.fillStyle = '#b2240d';
    context.fill();
}