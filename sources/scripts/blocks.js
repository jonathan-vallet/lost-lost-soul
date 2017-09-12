const DRAWN_BLOCKS = 3; // Number of blocks in memory loop

var firstBlock = {
    p: [[0, 0, 10]],
    d: [[4.9, 0.5], [5.3, 0.8], [5.7, 0.5], [6.9, 0.7], [7.3, 1.2], [7.9, 1.2], [8.3, 0.7]],
    s: []
};

// List of available blocks. Each blocks is an array of platforms wdth [x, y, width, height]
var availableBlockList = [
{
    p: [[0, 0, 2], [2.5, 1, 3.5], [4, 2, 5], [4, 0, 7]],
    d: [[4.2, 2.2], [4.5, 2.2], [4.8, 2.2]],
    s: [[4, 0, 5.5]]
},

  /*
  { // 3 little jumps
      p: [[0, 0, 1], [1.5, 0, 2.5], [3, 0, 4], [4.5, 0, 5.5]],
      d: []//[[100, 250]],
      s: []
  },
  { // small/large jumps
    p: [[0, 0, 1], [1.5, 0, 2.5], [4, 0, 5], [5.5, 0, 6.5], [7.5, 0, 8.5]],
    d: []//[[100, 250]],
    s: []
},
  */
];

var availableBlockNumber = availableBlockList.length;

function initBlocks() {
    for(let blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        let block = generateBlock(blockNumber === 0);
        block.x = blockNumber === 0 ? 0 : (drawBlockList[blockNumber - 1].x + drawBlockList[blockNumber - 1].w);
        console.log(block);
        drawBlockList.push(block);
    }
}

function generateBlock(isFirst) {
    let block;
    if(isFirst) {
        block = firstBlock;
    } else {
        block = availableBlockList[Math.floor(Math.random() * availableBlockNumber)];
    }

    // First gets position of the last platform to know block width
    var maxDuration = 0;
    for(let p of block.p) {
        var [xStart, yLevel, xEnd] = p;
        maxDuration = Math.max(maxDuration, xEnd);
    }
    var spacer = 0.5; // Adds a little jump between blocks
    
    let canvas = document.createElement('canvas');
    canvas.width = (maxDuration + spacer) * gameSpeed * GAME_MULTIPLIER;
    canvas.height = gameCanvas.height;
    let context = canvas.getContext('2d');
    
    // Adds platforms
    var platformList = [];
    for(let p of block.p) {
        var [xStart, yLevel, xEnd] = p;
        var x = (spacer + xStart) * gameSpeed * GAME_MULTIPLIER;
        var y = gameCanvas.height - 30 - yLevel * 100;
        var width = Math.ceil((spacer + xEnd) * gameSpeed * GAME_MULTIPLIER);
        let platform = [x, y, width];
        generatePlatform(context, platform);
        console.log('platform:', platform)
        platformList.push(platform);
    }

    // Adds spikes
    var spikeList = [];
    for(let s of block.s) {
        var [xStart, yLevel, xEnd] = s;
        var x = (spacer + xStart) * gameSpeed * GAME_MULTIPLIER;
        var y = gameCanvas.height - 30 - yLevel * 100;
        var width = Math.ceil((spacer + xEnd) * gameSpeed * GAME_MULTIPLIER);
        let spike = [x, y, width];
        console.log('spike:', spike)
        generateSpike(context, spike);
        spikeList.push(spike);
    }

    return {
        w: canvas.width, // width
        c: canvas, // canvas
        p: platformList, // platforms
        d: block.d.slice(0), // diamonds
        s: spikeList, // spikes
        speed: gameSpeed * GAME_MULTIPLIER
    };
}

function drawBlocks() {
    for(let blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        let block = drawBlockList[blockNumber];
        let x = Math.floor(block.x - gameDuration * gameSpeed / 1000);
        gameContext.drawImage(block.c, x, 0);

        // Draws diamonds
        for(let diamond of block.d) {
            let diamondX = x + Math.floor(diamond[0] * block.speed);
            let diamondY = gameCanvas.height - 30 - diamond[1] * 100;
            if(diamondX > 0 && diamondX < gameCanvas.width) {
                drawDiamond(diamondX, diamondY);
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
                let diamondX = x + Math.floor(diamond[0] * block.speed);
                let diamondY = gameCanvas.height - 30 - diamond[1] * 100;
                var distance = Math.sqrt(Math.pow(diamondX - player.x, 2) + Math.pow(diamondY - player.y, 2));
                if(distance < 30) {
                    // Collect diamond: removes it from draw list
                    drawBlockList[blockNumber].d.splice(index, 1);
                    diamondsCounter.innerText = ++collectedDiamonds;
                }
            }
            
            // Checks block platfoms to know if player is on one or not
            var isPlayerOnPlatform = false;
            for(let platform of block.p) {
                var [platformX, platformY, platformXEnd] = platform;
                if(player.x + 3 >= (platformX + x) && player.x  - 3 <= (platformXEnd + x)) {
                    var playerBottomY = player.y + player.height / 2;
                    if(playerBottomY >= platformY && playerBottomY < platformY + 11) {
                        isPlayerOnPlatform = true;
                        player.y = platformY - player.height / 2;
                        break;
                    }
                }
            }
            
            for(let spike of block.s) {
                var [spikeX, spikeY, spikeXEnd] = spike;
                if(player.x + 3 >= (spikeX + x) && player.x  - 3 <= (spikeXEnd + x)) {
                    var playerBottomY = player.y + player.height / 2;
                    if(playerBottomY >= spikeY && playerBottomY < spikeY + 11) {
                        hurtPlayer(SPIKE_DAMAGE_VALUE);
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