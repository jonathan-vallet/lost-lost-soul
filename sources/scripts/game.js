var gameCanvas = document.getElementById('canvas');
gameCanvas.width = 900;
gameCanvas.height = 400;
var gameContext = gameCanvas.getContext('2d');
var background =  document.getElementById('bg1');
var middleground =  document.getElementById('bg2');

var gameSpeed = 140;
var backgroundSpeed = 20;
var middlegroundSpeed = 15;
var gameDuration = 0;
var startTime = new Date();
var lastTime = startTime;
// Just to try light update real time, while platform moving is not done yet
var test = document.createElement('canvas');
test.width = gameCanvas.width;
test.height = gameCanvas.height;
var contextTest = test.getContext('2d');

var drawBlockList = [];

function init() {
    initPlayer();
    initBlocks();
    
    // Generates background 1
    generateBackground(background, 300, gameCanvas.height, 0.2, 20, 4, '#1e3d5a', false);
    generateBackground(middleground, 400, gameCanvas.height, 0.3, 50, 3, '#101f32', true);

    //initReaper();

    // Ugly set timeout to wait images loading
    setTimeout(function() {
        loop();
    }, 500);
}

function loop() {
    let now = new Date();
    gameDuration = now - startTime;
    
    //updateBackgroundSpeed();
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameContext.drawImage(test, 0, 0);

    drawBlocks();
    
    updatePlayerPosition();
    drawPlayer();
    generateLightFilter();
    requestAnimationFrame(loop);
}

/*function initReaper() {
    let reaperImage = new Image();
    reaperImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACrAQMAAAAKIQHdAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAStJREFUWMPN1VFqxDAMRVHBW4j2vyvBbEPw2pGTCKbQOJIovR9j8PmwJ3aIrGDyURnoDwHkFChhXcgl/BHoN+gcwEaAdBHGvn0LQFqcLkh6C3QdkwvfNcFjwDZwATgBluBWhry4ymgLPEZGrw7oAnDVA1vDSu6BCzgCMgTI/1cD70A+qi5oASSBtH8FPPJ7yLtub9ARiHVgVgc7wIXrZxvWzkT74IJ4UmjA6QVQknEBmxBTsTX3KuSgjEwfA2wMxOdAfwf7BBFYDeQniM4B7BYiXiA+AjGnPQATYLvwOkC8BUrST9AW8N31Bv4tIOA1ARrglE3Ig+0DuBoAHtku4ATvAjgGzPYAzKwHOgIEXcjM70Bp1xRisCrkx9Gv+1uHLBfZBaGBlB5kkCJ8AVSVaGnTcqoDAAAAAElFTkSuQmCC';
    reaperImage.addEventListener('load', function() {
        gameContext.drawImage(reaperImage, 50, (gameCanvas.height - reaperImage.height) / 2);
    });
}*/

init();