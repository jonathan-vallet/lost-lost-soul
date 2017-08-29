var gameCanvas = document.getElementById('canvas');
gameCanvas.width = (window.innerWidth - 2) / 2;
gameCanvas.height = (window.innerHeight - 2) / 2;
var gameContext = gameCanvas.getContext('2d');
var background =  document.getElementById('bg1');
var middleground =  document.getElementById('bg2');

var backgroundSpeed = 20;
var middlegroundSpeed = 15;
var time = new Date();

// Just to try light update real time, while platform moving is not done yet
var test = document.createElement('canvas');
test.width = gameCanvas.width;
test.height = gameCanvas.height;
var contextTest = test.getContext('2d');


var player = {
    x: 350,
    y: (gameCanvas.height - 36) / 2,
    width: 42,
    height: 36
}

var { generateBackground, updateBackgroundSpeed } = require('./background.js');
var { gaussianRandom } = require('./utils.js');

function init() {
    // Generates background 1
    generateBackground(background, 300, gameCanvas.height, 0.2, 20, 4, '#1e3d5a', false);
    generateBackground(middleground, 400, gameCanvas.height, 0.3, 50, 3, '#101f32', true);
    
    generatePlatform(30, 30, 100, 30);
    generatePlatform(200, 45, 400, 30);
    generatePlatform(100, 200, 800, 50);
    generatePlatform(10, 300, 50, 30);
    generatePlatform(100, 300, 200, 50);
    generatePlatform(500, 300, 400, 120);
    generatePlatform(150, 400, 300, 50);

    
    initPlayer();
    initReaper();
    
    // Ugly set timeout to wait images loading
    setTimeout(function() {
        contextTest.drawImage(gameCanvas, 0, 0);
        loop();
    }, 500);
}

function generateLightFilter(gameDuration) {
    var canvas = document.createElement('canvas');
    canvas.width = gameCanvas.width;
    canvas.height = gameCanvas.height;
    var context = canvas.getContext('2d');
    var lightRadius = Math.max(60, 200 - (gameDuration / 1000 * 5)) - Math.abs((gameDuration / 200) % 10 - 5);
    var ligthBritghness = Math.max(5, 70 - (gameDuration / 1000 * 2));

    context.fillStyle = 'rgba(0, 0, 0, ' + (1 - ligthBritghness / 100) + ')';
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    var x = player.x + player.width / 2;
    
    var blurGradient = context.createRadialGradient(x, player.y, 0, x, player.y, lightRadius);
    blurGradient.addColorStop(0, 'rgba(0,0,0,1)');
    blurGradient.addColorStop(0.8, 'rgba(0,0,0,.9)');
    blurGradient.addColorStop(1, 'rgba(0,0,0,0)');

    // draw shape
    context.fillStyle = blurGradient;
    context.globalCompositeOperation = 'destination-out';
    context.fillRect(x - lightRadius, player.y - lightRadius, x + lightRadius, player.y + lightRadius);
    gameContext.drawImage(canvas, 0, 0);
}

function loop() {
    var now = new Date();
    var gameDuration = now - time;
    
    //updateBackgroundSpeed(gameDuration);
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameContext.drawImage(test, 0, 0);
    generateLightFilter(gameDuration);
    requestAnimationFrame(loop);
}

function initPlayer() {
    var playerImage = new Image();
    playerImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAkAgMAAACCp0C4AAAADFBMVEUAAAD///////8AAAA4fh26AAAAAnRSTlMA32D/An0AAACCSURBVBjTndCxDYMwEIXhk0smidjHKVKljDKFl4iEUrkJCo+CEdiHEagwfujOCCr+6pN915ysAQjCXPJrc5X83oxUF82gXfY/u85ugxkHg0Wu9jOGqblkph7PzL7BjOfelflWGHVhLap/QdStnLspHGm9oXvoOD/shGb38d7fhdbnBddVtJA2inbyAAAAAElFTkSuQmCC';
    playerImage.addEventListener('load', function() {
        gameContext.drawImage(playerImage, player.x - player.width / 2, player.y - player.height / 2);
    });
}

function initReaper() {
    var reaperImage = new Image();
    reaperImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACrAQMAAAAKIQHdAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAStJREFUWMPN1VFqxDAMRVHBW4j2vyvBbEPw2pGTCKbQOJIovR9j8PmwJ3aIrGDyURnoDwHkFChhXcgl/BHoN+gcwEaAdBHGvn0LQFqcLkh6C3QdkwvfNcFjwDZwATgBluBWhry4ymgLPEZGrw7oAnDVA1vDSu6BCzgCMgTI/1cD70A+qi5oASSBtH8FPPJ7yLtub9ARiHVgVgc7wIXrZxvWzkT74IJ4UmjA6QVQknEBmxBTsTX3KuSgjEwfA2wMxOdAfwf7BBFYDeQniM4B7BYiXiA+AjGnPQATYLvwOkC8BUrST9AW8N31Bv4tIOA1ARrglE3Ig+0DuBoAHtku4ATvAjgGzPYAzKwHOgIEXcjM70Bp1xRisCrkx9Gv+1uHLBfZBaGBlB5kkCJ8AVSVaGnTcqoDAAAAAElFTkSuQmCC';
    reaperImage.addEventListener('load', function() {
        gameContext.drawImage(reaperImage, 50, (gameCanvas.height - reaperImage.height) / 2);
    });
}

function generatePlatform(x, y, width, height) {
    // Number of spikes on platform
    var splitNumber = Math.min(width / 10, 25 + 5 * gaussianRandom());

    // Sets the dot list under the platform
    var dotList = [];
    var i = x;
    while(i < x + width - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= x + width) {
            break;
        }
        dotList.push([i, y + height / 3 + (gaussianRandom() + 1) * height * 2 / 3]);
    }
    
    // Draws platform line 2px under under (decoration)
    gameContext.beginPath();
    gameContext.moveTo(x, y + 2);
    for(var dot in dotList) {
        gameContext.lineTo(dotList[dot][0], dotList[dot][1] + 2);
    }
    gameContext.lineTo(x + width, y + 2);
    gameContext.fillStyle = '#bfa16d';
    gameContext.fill();
 
    //Draws platform
    gameContext.beginPath();
    gameContext.moveTo(x, y);
    for(var dot in dotList) {
        gameContext.lineTo(dotList[dot][0], dotList[dot][1]);
    }
    gameContext.lineTo(x + width, y);
    gameContext.fillStyle = '#122937';
    gameContext.fill();

    // Draws grass on platform
    gameContext.beginPath();
    gameContext.moveTo(x, y);
    splitNumber = Math.min(width / 50, 5 + 5 * gaussianRandom());
    i = x;
    while(i < x + width - splitNumber) {
        i = i + (gaussianRandom() + 1) * splitNumber;
        if(i >= x + width) {
            break;
        }
        gameContext.lineTo(i, y + 2 + (gaussianRandom() + 1) * 3);
    }
    gameContext.lineTo(x + width, y);
    gameContext.fillStyle = '#376d91';
    gameContext.fill();
}

init();