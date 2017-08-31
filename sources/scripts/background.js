/**
 * Generates a background image
 * @method generateBackground
 * @param Element background - the background element in DOM 
 * @param int width - the width of a background item
 * @param int height - total height of the background image
 * @param int heightPercent - height of the background in percent of the height of gameCanvas (between 0 and 1)
 * @param int offset - space between every item
 * @param int loop - number of item drawn on the background image
 * @param string color - color of the background (color name or hexadecimal)
 * @param boolean withStalactite - adds stalactites like on background items
 */
function generateBackground(background, width, height, heightPercent, offset, loop, color, withStalactite) {
    // Sets background image finale size
    background.width = (width + offset * 2) * loop;
    let canvas = document.createElement('canvas');
    canvas.width = background.width;
    canvas.height = height;

    let context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Generates every background cave
    for(let index = 0; index < loop; ++index) {
        drawBackgroundItem(context, offset + index * (width + offset * 2), canvas.height / 2, width, canvas.height * heightPercent, withStalactite);
    }
    background.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
}

/**
 * Generates a background image item (cave hole)
 * @method drawBackgroundItem (private)
 * @param context ctx - the canvas context where draw the background
 * @param int x - the left position of the item in pixels
 * @param int y - the top position of the item in pixels
 * @param int height - height of the item in pixels
 * @param boolean withStalactite - adds stalactites like on background items
 */
function drawBackgroundItem(ctx, x, y, width, height, withStalactic) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    let startX = x;
    let currentX = 0;
    let currentY = y;
    let splitNumber = withStalactic ? 40 : 25;
    let centerOffset = (gaussianRandom() + 1) * 0.2 * height - 0.1 * height;
    let spikeHeightCoef = 0.25;

    for(let index = -1; index <= 1; index += 2) {
        let iteration = 0;
        currentX = 0;
        currentY = y;
        let step = 1;
        ctx.moveTo(startX, y + centerOffset);
        while(currentX < width - width / splitNumber) {
            currentX = currentX + (gaussianRandom() + 1) * width / splitNumber;
            if(currentX >= width) {
                break;
            }

            let pointX = currentX;
            if(withStalactic) {
                spikeHeightCoef = 0.15;
                let progress = iteration/splitNumber;
                if(progress < 0.33) {
                    pointX = 0.8 * currentX + 0.05 * width;
                    spikeHeightCoef = 0.7;
                } else if (progress > 0.67) {
                    pointX = 0.8 * currentX + 0.2 * width;
                    spikeHeightCoef = 0.7;
                } else {
                    pointX = currentX;
                }
            }

            if(step === 1 && currentY < y + height) {
                currentY += height / (0.5 + (gaussianRandom() + 1) * 1.5) * index;
                if(currentY >= y + height * index) {
                    currentY = y + height * index;
                    step = 2;
                }
            } else {
                currentY = y + (gaussianRandom() + 1) * height * spikeHeightCoef * index + (1 - spikeHeightCoef) * height * index;
            }
            ctx.lineTo(Math.floor(startX + pointX), Math.floor(currentY));
            ++iteration;
        }
        ctx.lineTo(startX + width, y + centerOffset);
        ctx.lineTo(startX, y + centerOffset);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

/**
 * Increases background speed while game time goes on
 * @method updateBackgroundSpeed
 */
function updateBackgroundSpeed() {
    background.style['animation-duration'] = Math.floor((backgroundSpeed - (gameDuration / 10000)) * 1000) / 1000 + 's';
    middleground.style['animation-duration'] = Math.floor((middlegroundSpeed - (gameDuration / 10000)) * 1000) / 1000 + 's';
}