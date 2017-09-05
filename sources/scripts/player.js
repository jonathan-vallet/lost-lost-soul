var player = {};
const GRAVITY = 0.5; // Gravity, to make jump go back to the ground
const JUMP_IMPULSE = 12; // Jump impulsion when starting to jump. Decreases over tim due to GRAVITY

/**
 * Inits player data at game start
 */
function initPlayer() {
    player = {
        x: 350,
        y: 182,
        width: 42,
        height: 36,
        isJumping: false,
        isOnGround: true,
        currentVelocityY: 0
    };

    let playerImage = new Image();
    playerImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAkAgMAAACCp0C4AAAADFBMVEUAAAD///////8AAAA4fh26AAAAAnRSTlMA32D/An0AAACJSURBVBjTrdC9DYQwDIbhyHRMckp1y+SKq648MUWWQELQICH+vASMxAYQ7BAHQclbPZL1NVZ7iGgVB85/79Q580bXWIuRDeSBrMmdFePFJB6Dd/GEpztzpRXj7+xU/IqMOvLRVAe38xzcRe7XJbhS7+BGPO6GL08TZ38YyDoy5MaYj2Lzl5N12QDN7Ll+6NbFBQAAAABJRU5ErkJggg==';
    player.image = playerImage;
}

/**
 * Draws the player at its position on gameCanvas at every frame
 */
function drawPlayer() {
    gameContext.drawImage(player.image, player.x - player.width / 2, player.y - player.height / 2);

    // Adds eyes blinking
    let eyeHeight = Math.floor(gameDuration / 100) % 50 !== 4 ? 5 : 1;
    gameContext.fillStyle= '#000';
    gameContext.fillRect(player.x - 2, player.y - 3, 3, - eyeHeight);
    gameContext.fillRect(player.x + 9, player.y - 3, 3, - eyeHeight);

    // Adds lantern light
    let ligthBritghness = Math.max(25, 100 - (gameDuration / 1000 * (lightRadiusDecreaseSpeed * 100 / INITIAL_LIGHT_RADIUS)));
    gameContext.fillStyle= 'rgba(255, 255, 168, ' + (ligthBritghness / 100) + ')';
    gameContext.fillRect(player.x + 15, player.y +10, 5, 7);
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
    if(this.isOnGround) {
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

/**
 * Updates player position on screen at every frame
 */
function updatePlayerPosition() {
    if(!player.isOnGround) {
        player.currentVelocityY = Math.min(player.currentVelocityY + GRAVITY, 11);
        player.y += player.currentVelocityY;
    }
    
    if(player.y > 182) {
        player.y = 182;
        stopFall();
    }
}