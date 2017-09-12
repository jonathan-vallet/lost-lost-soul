/*
 * Gets data stored in a cookie when player comes back
 */
function getSavedData() {
    var savedDataText = getCookie('lostsoul');
    if(savedDataText) {
        savedData = JSON.parse(savedDataText);
    } else {
        savedData = {
            d: 0,
            b: {
                light: 0,
                fall: 0,
                spikes: 0
            }
        }
    }
    
    collectedDiamondsTotal = savedData.d || 0;
    for(var bonus in bonusList) {
        bonusList[bonus].currentLevel = savedData.b[bonus];
    }
}

/**
 * Stores player data in a cookie to get money/bonuses back when he will reload game
 */
function saveData() {
    setCookie('lostsoul', JSON.stringify(savedData));
}