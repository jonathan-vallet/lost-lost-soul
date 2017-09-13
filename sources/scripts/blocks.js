var DRAWN_BLOCKS = 3; // Number of blocks in memory loop
var BLOCK_SPACER = 0.5; // Adds a little jump between blocks

var firstBlock = {
  //  p: [[0, 0, 10]],
    p: [[0, 0, 10]],
    d: [[4.9, 0.5], [5.3, 0.8], [5.7, 0.5], [6.9, 0.7], [7.3, 1.2], [7.9, 1.2], [8.3, 0.7]],
    s: []//[[0, 0, 10]]
};

// List of available blocks. Each blocks is an array of platforms wdth [x, y, width, height]
var availableBlockList = [
/*
{
    p: [[0, 0, 1], [1, 1, 2],[2,2,3],[2,0,3],[3, 1, 4],[4, 2, 5],[4, 0, 5],[5, 1, 6],[6, 2, 7],[6, 0, 7],[7, 1, 8],[8, 2, 9],[8, 0, 9],[9, 1, 11]],
    d: [],
    s: []
},
*/

{
    p: [[0, 0, 1], [1.5, 1, 2.5], [3 ,2 ,4], [3 ,0 ,4], [4.5, 1, 5.5], [6, 2, 7], [6, 0, 7],[7.5, 1, 8.5],[9, 2, 10],[9, 0, 10],[10.5, 1, 11.5],[12, 2, 13],[12, 0, 13],[13.5, 1, 15.5]],
    d: [[6.2, 0.3],[6.5, 0.3],[6.8, 0.3],[7.7, 1.3],[8, 1.3],[8.3, 1.3],[12.2, 0.3],[12.5, 0.3],[12.8, 0.3]],
    s: [[3 ,0 ,4], [6, 2, 7],[9, 0, 10],[10.5, 1, 11.5], [12, 2, 13]]
},
{
    p: [[0, 0, 1], [1.5, 1, 2.5], [3 ,2 ,4], [3 ,0 ,4], [4.5, 1, 5.5], [6, 2, 7], [6, 0, 7],[7.5, 1, 8.5],[9, 2, 10],[9, 0, 10],[10.5, 1, 11.5],[12, 2, 13],[12, 0, 13],[13.5, 1, 15.5]],
    d: [[1.7, 1.3],[2, 1.3],[2.3, 1.3], [6.2, 2.3],[6.5, 2.3],[6.8, 2.3],[7.7, 1.3],[8, 1.3],[8.3, 1.3]],
    s: [[3, 2, 4],[6,0,7],[9, 2, 10],[12,0,13]]
},
{
    p: [[0, 0, 1], [1, 1, 2], [3, 2.2, 8], [3, 1, 3.5], [4.5, 1, 5], [6, 1, 6.5], [7.5, 1, 8], [8.5, 0, 10]],
    d: [[3.2, 1.5], [3.5, 1.5], [3.8, 1.5], [4.1, 1.5], [4.4, 1.5], [4.7, 1.5], [5, 1.5], [5.3, 1.5], [5.6, 1.5], [5.9, 1.5], [6.2, 1.5], [6.5, 1.5], [6.8, 1.5], [7.1, 1.5], [7.4, 1.5], [7.7, 1.5], [9, 0.2], [9.3, 0.2], [9.6, 0.2], [9.9, 0.2]],
    s: [[8.5, 0, 9]]
},
{
    p: [[0, 0, 11], [1.5, 1, 3], [4, 1, 4.5], [5, 1, 6.5], [6.5, 2, 7.5], [8.5, 2, 10], [8, 1, 11]],
    d: [[6.7, 2.2], [7, 2.2], [7.3, 2.2]],
    s: [[1, 0, 11], [8.5, 2, 10]]
},
{
    p: [[0, 0, 2], [2.5, 1, 3.5], [4, 2, 5], [4, 0, 7]],
    d: [[4.2, 2.2], [4.5, 2.2], [4.8, 2.2]],
    s: [[4, 0, 5.5]]
},
  { // 3 little jumps
      p: [[0, 0, 1], [1.5, 0, 2.5], [3, 0, 4], [4.5, 0, 5.5]],
      d: [],
      s: []
  },
  { // small/large jumps
    p: [[0, 0, 1], [1.5, 0, 2.5], [4, 0, 5], [5.5, 0, 6.5], [7.5, 0, 8.5]],
    d: [],
    s: []
}
];

var availableBlockNumber = availableBlockList.length;

function initBlocks() {
    drawBlockList = [];
    for(var blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        var block = generateBlock(blockNumber === 0);
        block.x = blockNumber === 0 ? 0 : (drawBlockList[blockNumber - 1].x + drawBlockList[blockNumber - 1].w);
        drawBlockList.push(block);
    }
}

function generateBlock(isFirst) {
    var block;
    if(isFirst) {
        block = firstBlock;
    } else {
        block = availableBlockList[Math.floor(Math.random() * availableBlockNumber)];
    }

    // First gets position of the last platform to know block width
    var maxDuration = 0;
    for(var p of block.p) {
        var [xStart, yLevel, xEnd] = p;
        maxDuration = Math.max(maxDuration, xEnd);
    }
    
    var canvas = document.createElement('canvas');
    canvas.width = (maxDuration + BLOCK_SPACER) * gameSpeed * GAME_MULTIPLIER;
    canvas.height = gameCanvas.height;
    var context = canvas.getContext('2d');
    
    // Adds platforms
    var platformList = [];
    for(var p of block.p) {
        var [xStart, yLevel, xEnd] = p;
        var x = (BLOCK_SPACER + xStart) * gameSpeed * GAME_MULTIPLIER;
        var y = gameCanvas.height - 40 - yLevel * 100;
        var width = Math.ceil((BLOCK_SPACER + xEnd) * gameSpeed * GAME_MULTIPLIER);
        var platform = [x, y, width];
        generatePlatform(context, platform);
        platformList.push(platform);
    }

    // Adds spikes
    var spikeList = [];
    for(var s of block.s) {
        var [xStart, yLevel, xEnd] = s;
        var x = (BLOCK_SPACER + xStart) * gameSpeed * GAME_MULTIPLIER;
        var y = gameCanvas.height - 40 - yLevel * 100;
        var width = Math.ceil((BLOCK_SPACER + xEnd) * gameSpeed * GAME_MULTIPLIER);
        var spike = [x, y, width];
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
    for(var blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        var block = drawBlockList[blockNumber];
        var x = Math.floor(block.x - gameDuration * gameSpeed / 1000);
        gameContext.drawImage(block.c, x, 0);

        // Draws diamonds
        for(var diamond of block.d) {
            var diamondX = x + Math.floor((BLOCK_SPACER + diamond[0]) * block.speed);
            var diamondY = gameCanvas.height - 30 - diamond[1] * 100;
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
            for(var index in block.d) {
                var diamond = block.d[index];
                var diamondX = x + Math.floor((BLOCK_SPACER + diamond[0]) * block.speed);
                var diamondY = gameCanvas.height - 30 - diamond[1] * 100;
                var distance = Math.sqrt(Math.pow(diamondX - player.x, 2) + Math.pow(diamondY - player.y, 2));
                if(distance < 30) {
                    // Collect diamond: removes it from draw list
                    drawBlockList[blockNumber].d.splice(index, 1);
                    diamondsCounter.innerText = ++collectedDiamonds;
                }
            }
            
            // Checks block platfoms to know if player is on one or not
            var isPlayerOnPlatform = false;
            for(var platform of block.p) {
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
            
            for(var spike of block.s) {
                var [spikeX, spikeY, spikeXEnd] = spike;
                if(player.x + 3 >= (spikeX + x) && player.x  - 3 <= (spikeXEnd + x)) {
                    var playerBottomY = player.y + player.height / 2;
                    if(playerBottomY >= spikeY && playerBottomY < spikeY + 11) {
                        hurtPlayer(SPIKE_DAMAGE_VALUE * (1 - bonusList.spikes.currentLevel * 0.05));
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