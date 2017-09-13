function displayShop() {
    // Displays shop screen
    stopMusic();
    collectedDiamondsTotalElement.innerText = collectedDiamondsTotal;
    savedData.d = collectedDiamondsTotal;
    saveData();

    [].forEach.call(document.querySelectorAll('#shop-item-list li'), function(el) {
        // Checks if item can be purchased
        var itemName = el.getAttribute('data-item');
        var item = bonusList[itemName];
        var itemPrice = getItemPrice(item);
        var priceText = item.currentLevel < item.maxLevel ? itemPrice : 'MAX';
        el.querySelector('.shop-item-price').innerText = priceText;
        el.querySelector('.shop-current-bonus span').innerText = item.bonusMultiplier * item.currentLevel;
        if(itemPrice < collectedDiamondsTotal && item.currentLevel < item.maxLevel) {
            el.classList.remove('disabled');
        } else {
            el.classList.add('disabled');
        }
    });

    ui.style.display = 'none';
    shopScreen.style.display = 'block';
}

function getItemPrice(item) {
    return Math.ceil(Math.floor(Math.pow(BONUS_BASE_COST, (10 + (item.currentLevel * 1.1112)) / 10)) / 10) * 10;
}

function purchaseItem(item) {
    var itemName = this.getAttribute('data-item');
    var item = bonusList[itemName];
    var itemPrice = getItemPrice(item);
    if(itemPrice < collectedDiamondsTotal && item.currentLevel <= item.maxLevel) {
        collectedDiamondsTotal -= itemPrice
        savedData.b[itemName] = ++item.currentLevel;
    }
    // Refreshs shop display
    displayShop();
}

function getFreeDiamonds() {
    collectedDiamondsTotal += parseInt(this.getAttribute('data-value'));
    savedData.d = collectedDiamondsTotal;
    saveData();
    document.getElementById('get-more-amount').innerText = collectedDiamondsTotal;
    displayShop();
}
