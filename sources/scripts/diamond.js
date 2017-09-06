var diamondCanvas = document.createElement('canvas');
var diamondWidth = 10;
var diamondHeight = 20;

function initDiamond() {
    diamondCanvas.width = diamondWidth;
    diamondCanvas.height = diamondHeight;
    
    var context = diamondCanvas.getContext('2d');
    
    context.fillStyle = '#ebf855';
    context.beginPath();
    context.moveTo(0, diamondHeight / 2);
    context.lineTo(diamondWidth / 2, 0);
    context.lineTo(diamondWidth, diamondHeight / 2);
    context.lineTo(diamondWidth / 2, diamondHeight);
    context.fill();

    context.fillStyle = '#eee21c';
    context.beginPath();
    context.moveTo(2, 10);
    context.lineTo(5, 0);
    context.lineTo(8, 10);
    context.lineTo(5, 20);
    context.fill();
} 

function drawDiamond(x, y) {
    gameContext.drawImage(diamondCanvas, x - diamondWidth / 2, y - diamondHeight / 2);
}