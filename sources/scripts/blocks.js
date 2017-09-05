const DRAWN_BLOCKS = 3;
// List of available blocks. Each blocks is an array of platforms wdth [x, y, width, height]
var availableBlockList = [
  {
      w: 980,
      p: [[30, 30, 100, 30], [200, 45, 400, 30], [100, 200, 800, 50], [10, 300, 50, 30], [100, 300, 200, 50], [500, 300, 400, 120], [150, 400, 300, 50]]
  }
];
var availableBlockNumber = availableBlockList.length;

function initBlocks() {
    for(var blockNumber = 0; blockNumber < DRAWN_BLOCKS; ++blockNumber) {
        let block = generateBlock();
        block.x = blockNumber === 0 ? 0 : drawBlockList[blockNumber - 1].x + drawBlockList[blockNumber - 1].w;
        drawBlockList.push(block);
    }

    console.log(drawBlockList);
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
        var x = block.x - gameDuration * gameSpeed / 1000;
        gameContext.drawImage(block.c, x, 0);
        if(x + block.w < 0) {
            console.log('generate new block');
            var previousBlock = drawBlockList[(blockNumber - 1 + DRAWN_BLOCKS) % DRAWN_BLOCKS];
            //block = generateBlock();
            block.x = previousBlock.x + previousBlock.w;
        }
    }
}