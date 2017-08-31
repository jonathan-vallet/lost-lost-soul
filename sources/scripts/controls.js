window.addEventListener('keydown', function(k) {
    switch(k.keyCode) {
        case 32: //space
        case 38: //up
            // Player has to release and press again to make a new jump
            if(!player.isJumping) {
                startJump();
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
