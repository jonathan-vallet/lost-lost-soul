// Get elements
var gameWrapper = document.getElementById('game');
var gameCanvas = document.getElementById('canvas');
var diamondsCounter = document.getElementById('diamonds');
var healthCounter = document.getElementById('health');
var background =  document.getElementById('bg1');
var middleground =  document.getElementById('bg2');
var startScreen = document.getElementById('start');
var shopScreen = document.getElementById('shop');
var ui = document.getElementById('ui');
var collectedDiamondsTotalElement = document.getElementById('totalDiamondsCollected');

const GAME_WIDTH = 900;
const GAME_HEIGHT = 400;

gameCanvas.width = GAME_WIDTH;
gameCanvas.height = GAME_HEIGHT;
var gameContext = gameCanvas.getContext('2d');

var savedData = {};
var gameSpeed = 200;
var backgroundSpeed = 20;
var middlegroundSpeed = 15;
var gameDuration = 0;
var startTime = +new Date();
var collectedDiamonds = 142;
var collectedDiamondsTotal = 0;
var DEFAULT_HEALTH = 1;
var health = DEFAULT_HEALTH;
var isGameEnded = false;

const FALL_DAMAGE_VALUE = 20;
const SPIKE_DAMAGE_VALUE = 1;
const BONUS_BASE_COST = 50;

var drawBlockList = [];
var isGameInPause = false;
var pauseTime = 0;

var bonusList = {
    light: {
        currentLevel: 0,
        maxLevel: 10,
        bonusMultiplier: 10
    },
    fall: {
        currentLevel: 0,
        maxLevel: 10,
        bonusMultiplier: 5
    },
    spikes: {
        currentLevel: 0,
        maxLevel: 10,
        bonusMultiplier: 5
    }
};

function showStartingScreen() {
    checkSize();
    initPlayer();
    initDiamond();
    getSavedData();

    startTime = +new Date() - 20000;
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
    
    // Sets shop item clickages
    [].forEach.call(document.querySelectorAll('#shop-item-list li'), function(el) {
        el.addEventListener('click', purchaseItem);
    });
}

function getSavedData() {
    var savedDataText = getCookie('lostsoul');
    if(savedDataText) {
        savedData = JSON.parse(savedDataText);
    } else {
        savedData = {
            d: 0,
            b: {
                light: 0,
                fall: 0,
                spikes: 0
            }
        }
    }
    
    collectedDiamondsTotal = savedData.d || 0;
    for(var bonus in bonusList) {
        bonusList[bonus].currentLevel = savedData.b[bonus];
    }
}

function saveData() {
    setCookie('lostsoul', JSON.stringify(savedData));
}

function startGame() {
    resetPlayerState();

    isGameEnded = false;
    startTime = +new Date();
    gameDuration = 0;
    health = DEFAULT_HEALTH;
    
    // Draws ui diamond

    initBlocks();

    //initReaper();
    startScreen.style.display = 'none';
    shopScreen.style.display = 'none';
    ui.style.display = 'block';
    loop();
}

function loseGame() {
    isGameEnded = true;
    background.style['animation-play-state'] = 'paused';
    middleground.style['animation-play-state'] = 'paused';
    
    // Displays shop / end screen after a short time
    setTimeout(function() {
        // Collects diamonds
        collectedDiamondsTotal += collectedDiamonds;
        collectedDiamonds = 0;
        
        displayShop();
    }, 500);
}

function restartGame() {
    startGame();
}


function loadingLoop() {
    let now = new Date();
    gameDuration = now - startTime;

    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawPlayer();
    generateLightFilter();

    requestAnimationFrame(loadingLoop);
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

    //updateBackgroundSpeed();
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Moves player (jump, fall...)
    updatePlayerPosition();

    // Displays blocks with plaforms
    drawBlocks();
    // Displays player's character
    drawPlayer();
    // Displays light filter over character
    generateLightFilter();

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