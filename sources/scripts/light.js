var lightRadiusDecreaseSpeed = 1;

const INITIAL_LIGHT_RADIUS = 200; // Radius of light circle, in pixels
const INITIAL_LIGHT_BRIGHTNESS = 70; // Brightness of the scene (opacity of none lightned part)

/**
 * Adds a filter over 
 */
function generateLightFilter() {
    let canvas = document.createElement('canvas');
    canvas.width = gameCanvas.width;
    canvas.height = gameCanvas.height;
    let context = canvas.getContext('2d');
    
    // Gets light radius. Decrease over time, and has a small variation too to simulate firelight effect
    let lightRadius = Math.max(60, INITIAL_LIGHT_RADIUS - (gameDuration / 1000 * lightRadiusDecreaseSpeed)) - Math.abs((gameDuration / 200) % 10 - 5);
    let ligthBritghness = Math.max(5, INITIAL_LIGHT_BRIGHTNESS - (gameDuration / 1000 * (lightRadiusDecreaseSpeed * INITIAL_LIGHT_BRIGHTNESS / INITIAL_LIGHT_RADIUS)));

    // Fills a rect with opacity reduced of current brightness
    context.fillStyle = 'rgba(0, 0, 0, ' + (1 - ligthBritghness / 100) + ')';
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Creates a gradient circle
    let x = player.x + player.width / 2;
    let blurGradient = context.createRadialGradient(x, player.y, 0, x, player.y, Math.floor(lightRadius * 1000) / 1000);
    blurGradient.addColorStop(0, 'rgba(0,0,0,1)');
    blurGradient.addColorStop(0.8, 'rgba(0,0,0,.9)');
    blurGradient.addColorStop(1, 'rgba(0,0,0,0)');
    // Draw circle in destination-out to free circle of light
    context.fillStyle = blurGradient;
    context.globalCompositeOperation = 'destination-out';
    context.fillRect(x - lightRadius, player.y - lightRadius, lightRadius * 2, lightRadius * 2);

    gameContext.drawImage(canvas, 0, 0);
}
