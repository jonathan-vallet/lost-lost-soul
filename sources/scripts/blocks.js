const DRAWN_BLOCKS = 3;
// List of available blocks. Each blocks is an array of platforms wdth [x, y, width, height]
/*var availableBlockList = [
  {
      w: 980,
      p: [[30, 30, 100, 30], [200, 45, 400, 30], [100, 200, 800, 50], [10, 300, 50, 30], [100, 300, 200, 50], [500, 300, 400, 120], [150, 400, 300, 50]]
  }
];*/

var availableBlockList = [
  {
      w: 300,
      p: [[0, 200, 120, 30], [140, 200, 160, 30]]
  },
  {
      w: 300,
      p: [[0, 100, 140, 30], [160, 250, 140, 30]]
  },
  {
      w: 300,
      p: [[0, 300, 300, 30]]
  },
];

var availableBlockNumber = availableBlockList.length;

function initBlocks() {
    for(var blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        let block = generateBlock();
        block.x = blockNumber === 0 ? 0 : drawBlockList[blockNumber - 1].x + drawBlockList[blockNumber - 1].w;
        drawBlockList.push(block);
    }
}

function generateBlock() {
    let block = availableBlockList[Math.floor(Math.random() * availableBlockNumber)];
    let canvas = document.createElement('canvas');
    canvas.width = block.w;
    canvas.height = gameCanvas.height;
    let context = canvas.getContext('2d');
    for(let platform of block.p) {
        generatePlatform(context, platform);
    }

    return {
        w: block.w,
        c: canvas,
        p: block.p
    };
}

function drawBlocks() {
    for(let blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        var block = drawBlockList[blockNumber];
        var x = Math.floor(block.x - gameDuration * gameSpeed / 1000);
        gameContext.drawImage(block.c, x, 0);
        if(x + block.w < 0) {
            var previousBlock = drawBlockList[(blockNumber - 1 + DRAWN_BLOCKS) % DRAWN_BLOCKS];
            var newBlock = generateBlock();
            newBlock.x = previousBlock.x + previousBlock.w;
            drawBlockList[blockNumber] = newBlock;
        }

        // Checks if current block to make player fall if not on a platform
        // Collision checks is done here to avoid another loop on blocks
        if(player.x >= x && player.x < (x + block.w)) {
            // Checks block platfoms to know if player is on one or not
            var isPlayerOnPlatform = false;
            for(let platform of block.p) {
                var [platformX, platformY, platformWidth, platformHeight] = platform;
                if(player.x >= (platformX + x) && player.x <= (platformX + platformWidth + x)) {
                    var playerBottomY = player.y + player.height / 2;
                    if(playerBottomY >= platformY && playerBottomY < platformY + 11) {
                        isPlayerOnPlatform = true;
                        player.y = platformY - player.height / 2;
                        break;
                    }   
                }
            }
            if(!isPlayerOnPlatform) {
                startFall();
            } else {
                if(player.currentVelocityY > 0) {
                    stopFall();
                }
            }
        }
    }
}