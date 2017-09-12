window.addEventListener('keydown', function(k) {
    switch(k.keyCode) {
        case 32: //space
        case 38: //up
            // Player has to release and press again to make a new jump
            if(!player.isJumping) {
                startJump();
            }
            break;
        case 27: // escape
            // Pause/restore game
            if(!isGameInPause) {
                pauseGame();
            } else {
                resumeGame();
            }
            break;
    }
});

window.addEventListener('keyup', function(k) {
    switch(k.keyCode) {
    case 32: //up
    case 38: //up
        player.isJumping = false;
        stopJump();
        break;
    }
});

window.addEventListener('touchstart', function(k) {
    // TODO: If player clicks on pause button, pause game instead of jumping
    if(!player.isJumping) {
        startJump();
    }
});

window.addEventListener('touchend', function(k) {
    player.isJumping = false;
    stopJump();
});

window.addEventListener('resize', function(k) {
    checkSize();
});

document.getElementById('start-button').addEventListener('click', function() {
    startGame();
});

document.getElementById('restart-button').addEventListener('click', function() {
    startGame();
});

document.getElementById('get-more-button').addEventListener('click', function() {
    document.getElementById('get-more-amount').innerText = collectedDiamondsTotal;
    getMorePopin.style.display = 'block';
});


document.getElementById('close-popin-button').addEventListener('click', function() {
    getMorePopin.style.display = 'none';
});

// Sets shop item clickable
[].forEach.call(document.querySelectorAll('#shop-item-list li'), function(el) {
    el.addEventListener('click', purchaseItem);
});

//Sets shop item clickable
[].forEach.call(document.querySelectorAll('#get-more-popin .shop-item-list li'), function(el) {
    el.addEventListener('click', getFreeDiamonds);
});
