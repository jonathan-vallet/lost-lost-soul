var player = {};
var playerHurtTimeout;
//const GRAVITY = 0.3; // Gravity, to make jump go back to the ground
//const JUMP_IMPULSE = 9; // Jump impulsion when starting to jump. Decreases over tim due to GRAVITY

const GRAVITY = 0.2; // Gravity, to make jump go back to the ground
const JUMP_IMPULSE = 7.4; // Jump impulsion when starting to jump. Decreases over tim due to GRAVITY
const GAME_MULTIPLIER = 0.7; // To change space between blocks for jumps, depending of gravity/impulse values

var isPlayerImageLoaded = false;
/**
 * Inits player data at game start
 */
function initPlayer() {
    player = {
        x: 200,
        y: 182,
        width: 42,
        height: 36,
        isJumping: false,
        isOnGround: true,
        currentVelocityY: 0,
        isHurt: false
    };
    var playerCanvas = document.createElement('canvas');
    playerCanvas.width = player.width;
    playerCanvas.height = player.height;

    let playerImage = new Image();
    playerImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAkAgMAAACCp0C4AAAADFBMVEUAAAD///////8AAAA4fh26AAAAAnRSTlMA32D/An0AAACJSURBVBjTrdC9DYQwDIbhyHRMckp1y+SKq648MUWWQELQICH+vASMxAYQ7BAHQclbPZL1NVZ7iGgVB85/79Q580bXWIuRDeSBrMmdFePFJB6Dd/GEpztzpRXj7+xU/IqMOvLRVAe38xzcRe7XJbhS7+BGPO6GL08TZ38YyDoy5MaYj2Lzl5N12QDN7Ll+6NbFBQAAAABJRU5ErkJggg==';
    playerImage.addEventListener('load', function() {
        isPlayerImageLoaded = true;
    });
    player.canvas = playerCanvas;
    player.context = playerCanvas.getContext('2d');
    player.image = playerImage;
}

/**
 * Draws the player at its position on gameCanvas at every frame
 */
function drawPlayer() {
    var playerContext = player.context;
    // Draws character image
    playerContext.clearRect(0, 0, 100, 100);
    playerContext.drawImage(player.image, 0, 0);
    
    if(player.isHurt) {
        // Adds a damage feedback if player is hurt
        playerContext.globalCompositeOperation = 'source-in';
        playerContext.fillStyle= 'rgba(255, 0, 0, 0.5)';
        playerContext.fillRect(0, 0, player.width, player.height);
        playerContext.globalCompositeOperation = 'source-over';
        playerContext.globalAlpha = 0.2;
        playerContext.drawImage(player.image, 0, 0);
        playerContext.globalAlpha = 1;
    }
    
    // Adds eyes blinking
    let eyeHeight = !player.isHurt && Math.floor(gameDuration / 100) % 50 !== 4 ? 5 : 1;
    playerContext.fillStyle= '#000';
    playerContext.fillRect(player.width / 2 - 2, player.height / 2 - 3, 3, - eyeHeight);
    playerContext.fillRect(player.width / 2 + 9, player.height / 2 - 3, 3, - eyeHeight);

    // Adds lantern light
    let ligthBritghness = Math.max(25, 100 - (gameDuration / 1000 * (lightRadiusDecreaseSpeed * 100 / INITIAL_LIGHT_RADIUS)));
    playerContext.fillStyle= 'rgba(255, 255, 168, ' + (ligthBritghness / 100) + ')';
    playerContext.fillRect(player.width / 2 + 15, player.height / 2 +10, 5, 7);
 
    gameContext.drawImage(player.canvas, player.x - player.width / 2, player.y - player.height / 2);
}

/**
 * Starts to jump when player press "space" or touch the screen
 */
function startJump() {
    if(player.isOnGround) {
        player.currentVelocityY = -JUMP_IMPULSE;
        player.isOnGround = false;
        player.isJumping = true;
    }
}

/**
 * Stops jumping when player release "space" or end touching screen
 */
function stopJump() {
    if(player.currentVelocityY < -4) {
        player.currentVelocityY = -4;
    }
}

/**
 * Players starts falling when on empty space after a platform, or hitting top of platform
 */
function startFall() {
    if(player.isOnGround) {
        player.currentVelocityY = .5;
        player.isOnGround = false;
    }
}

/**
 * Players stop falling when he hits a platform while going down
 */
function stopFall() {
    player.currentVelocityY = 0;
    player.isOnGround = true;
    // Round to be on an exact platform
    //this.y = Math.floor(this.y / CELL_SIZE) * CELL_SIZE;
}

function hurtPlayer(value) {
    health = Math.max(0, health - value);
    healthCounter.innerText = health
    if(health <= 0) {
        loseGame();
    }
    player.isHurt = true;
    clearTimeout(playerHurtTimeout);
    playerHurtTimeout = setTimeout(function() {
        player.isHurt = false;
    }, 400);
}

/**
 * Updates player position on screen at every frame
 */
function updatePlayerPosition() {
    if(!player.isOnGround) {
        player.currentVelocityY = Math.min(player.currentVelocityY + GRAVITY, 11);
        player.y += player.currentVelocityY;
    }
    
    if(player.y - player.height / 2 > gameCanvas.height) {
        hurtPlayer(FALL_DAMAGE_VALUE);
        player.y = - player.height / 2;
    }
}