var gameCanvas = document.getElementById('canvas');
gameCanvas.width = 900;
gameCanvas.height = 400;
var gameContext = gameCanvas.getContext('2d');
var background =  document.getElementById('bg1');
var middleground =  document.getElementById('bg2');
var ui =  document.getElementById('ui');
var diamondsCounter = document.getElementById('diamonds');
var healthCounter = document.getElementById('health');

var gameSpeed = 100;
var backgroundSpeed = 20;
var middlegroundSpeed = 15;
var gameDuration = 0;
var startTime = +new Date();
var collectedDiamonds = 0;
var health = 100;
var isGameEnded = false;

const FALL_DAMAGE_VALUE = 20;

var startScreen = document.getElementById('start');

var drawBlockList = [];
var isGameInPause = false;
var pauseTime = 0;

function showStartingScreen() {
    initPlayer();
    initDiamond();

    startTime = +new Date() - 100000;
    var loadingInterval = setInterval(function() {
        if(isPlayerImageLoaded) {
            clearInterval(loadingInterval);

            generateBackground(background, 300, gameCanvas.height, 0.2, 20, 4, '#1e3d5a', false);
            generateBackground(middleground, 400, gameCanvas.height, 0.3, 50, 3, '#101f32', true);

            drawPlayer();
            generateLightFilter();
            loadingLoop();
        }
    }, 10);
}



function startGame() {
    startTime = +new Date();
    gameDuration = 0;
    
    // Draws ui diamond
    
    initBlocks();

    //initReaper();
    startScreen.style.display = 'none';
    ui.style.display = 'block';
    loop();
}

function loseGame() {
    isGameEnded = true;
}

function loadingLoop() {
    let now = new Date();
    gameDuration = now - startTime;

    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawPlayer();
    generateLightFilter();
 //   requestAnimationFrame(loadingLoop);
}

function loop() {
    if(isGameInPause) {
        return;
    }

    let now = new Date();
    gameDuration = now - startTime;
    if(pauseTime > 0) {
        let pauseDuration = now - pauseTime;
        startTime += pauseDuration; // Hack: increases start time with pause time to avoid removing pausetime at every frame
        gameDuration -= pauseDuration;
        pauseTime = 0;
    }

    updateBackgroundSpeed();
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Moves player (jump, fall...)
    updatePlayerPosition();

    // Displays blocks with plaforms
    drawBlocks();
    // Displays player's character
    drawPlayer();
    // Displays light filter over character
    generateLightFilter();


    // TODO: draw ui a single time, not at every frame    
    drawDiamond(850, 15);
    
    if(!isGameEnded) {
        requestAnimationFrame(loop);
    }
}

function pauseGame() {
    isGameInPause = true;
    background.style['animation-play-state'] = 'paused';
    middleground.style['animation-play-state'] = 'paused';
    pauseTime = +new Date();
}

function resumeGame() {
    isGameInPause = false;
    background.style['animation-play-state'] = 'running';
    middleground.style['animation-play-state'] = 'running';
    loop();
}

/*function initReaper() {
    let reaperImage = new Image();
    reaperImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACrAQMAAAAKIQHdAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAStJREFUWMPN1VFqxDAMRVHBW4j2vyvBbEPw2pGTCKbQOJIovR9j8PmwJ3aIrGDyURnoDwHkFChhXcgl/BHoN+gcwEaAdBHGvn0LQFqcLkh6C3QdkwvfNcFjwDZwATgBluBWhry4ymgLPEZGrw7oAnDVA1vDSu6BCzgCMgTI/1cD70A+qi5oASSBtH8FPPJ7yLtub9ARiHVgVgc7wIXrZxvWzkT74IJ4UmjA6QVQknEBmxBTsTX3KuSgjEwfA2wMxOdAfwf7BBFYDeQniM4B7BYiXiA+AjGnPQATYLvwOkC8BUrST9AW8N31Bv4tIOA1ARrglE3Ig+0DuBoAHtku4ATvAjgGzPYAzKwHOgIEXcjM70Bp1xRisCrkx9Gv+1uHLBfZBaGBlB5kkCJ8AVSVaGnTcqoDAAAAAElFTkSuQmCC';
    reaperImage.addEventListener('load', function() {
        gameContext.drawImage(reaperImage, 50, (gameCanvas.height - reaperImage.height) / 2);
    });
}*/

showStartingScreen();