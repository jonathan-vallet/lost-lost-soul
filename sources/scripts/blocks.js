const DRAWN_BLOCKS = 3;
// List of available blocks. Each blocks is an array of platforms wdth [x, y, width, height]
var availableBlockList = [
 /* {
      w: 300,
      p: [[0, 200, 120, 30], [140, 200, 160, 30]]
  },*/
  {
      w: 300,
      p: [[0, 100, 140, 30], [160, 250, 140, 30]],
      d: [[100, 250]]
  },
  {
      w: 300,
      p: [[0, 300, 300, 30]],
      d: [[100, 250], [150, 225], [200, 250]]
  },
];

var availableBlockNumber = availableBlockList.length;

function initBlocks() {
    for(let blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
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
        p: block.p,
        d: block.d.slice(0)
    };
}

function drawBlocks() {
    for(let blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        let block = drawBlockList[blockNumber];
        let x = Math.floor(block.x - gameDuration * gameSpeed / 1000);
        gameContext.drawImage(block.c, x, 0);

        // Draws diamonds
        for(let diamond of block.d) {
            if(x + diamond[0] > 0 && x + diamond[0] < gameCanvas.width) {
                drawDiamond(x + diamond[0], diamond[1]);
            }
        }

        // If block is out of screen, generate a new one and place it at the end of flow
        if(x + block.w < 0) {
            var previousBlock = drawBlockList[(blockNumber - 1 + DRAWN_BLOCKS) % DRAWN_BLOCKS];
            var newBlock = generateBlock();
            newBlock.x = previousBlock.x + previousBlock.w;
            drawBlockList[blockNumber] = newBlock;
        }

        // Checks if current block to make player fall if not on a platform
        // Collision checks is done here to avoid another loop on blocks
        if(player.x >= x && player.x < (x + block.w)) {
            // Checks if player is collecting a diamond
            for(let index in block.d) {
                var diamond = block.d[index];
                var distance = Math.sqrt(Math.pow(x + diamond[0] - player.x, 2) + Math.pow(diamond[1] - player.y, 2));
                if(distance < 30) {
                    // Collect diamond: removes it from draw list
                    drawBlockList[blockNumber].d.splice(index, 1);
                }
            }
            
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