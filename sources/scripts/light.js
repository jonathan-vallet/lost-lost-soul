var lightRadiusDecreaseSpeed = 4;

var INITIAL_LIGHT_RADIUS = 200; // Radius of light circle, in pixels
var INITIAL_LIGHT_BRIGHTNESS = 70; // Brightness of the scene (opacity of none lightned part)

/**
 * Adds a filter over 
 */
function generateLightFilter() {
    var canvas = document.createElement('canvas');
    canvas.width = gameCanvas.width;
    canvas.height = gameCanvas.height;
    var context = canvas.getContext('2d');
    
    // Gets light radius. Decrease over time, and has a small variation too to simulate firelight effect
    var lightRadius = Math.max(60, INITIAL_LIGHT_RADIUS - (gameDuration / 1000 * lightRadiusDecreaseSpeed * (2 - bonusList.light.currentLevel * 0.1) / 2)) - Math.abs((gameDuration / 200) % 10 - 5);
    var ligthBritghness = Math.max(bonusList.light.currentLevel * 0.05, INITIAL_LIGHT_BRIGHTNESS - (gameDuration / 1000 * (lightRadiusDecreaseSpeed * INITIAL_LIGHT_BRIGHTNESS / INITIAL_LIGHT_RADIUS * (2 - bonusList.light.currentLevel * 0.1) / 2)));

    // Fills a rect with opacity reduced of current brightness
    context.fillStyle = 'rgba(0, 0, 0, ' + (1 - ligthBritghness / 100) + ')';
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Creates a gradient circle
    var x = player.x + player.width / 2;
    var blurGradient = context.createRadialGradient(x, player.y, 0, x, player.y, Math.floor(lightRadius * 1000) / 1000);
    blurGradient.addColorStop(0, 'rgba(0,0,0,1)');
    blurGradient.addColorStop(0.8, 'rgba(0,0,0,.9)');
    blurGradient.addColorStop(1, 'rgba(0,0,0,0)');
    // Draw circle in destination-out to free circle of light
    context.fillStyle = blurGradient;
    context.globalCompositeOperation = 'destination-out';
    context.fillRect(x - lightRadius, player.y - lightRadius, lightRadius * 2, lightRadius * 2);

    gameContext.drawImage(canvas, 0, 0);
}
