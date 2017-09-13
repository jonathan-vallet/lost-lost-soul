/**
 * Generates a random number with a gaussian distribution (most values in the middle part, few in extreme values
 * @returns int a random number with a gaussian distribution
 */
function gaussianRandom() {
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function checkSize () {
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  
  var GAME_WIDTH = 900;
  var GAME_HEIGHT = 400;
  
  var scaleX = GAME_WIDTH / ww;
  var scaleY = (GAME_HEIGHT+20) / wh;
  var gameScale = Math.min(1.2, 1/Math.max(scaleX, scaleY));

  gameWrapper.style.webkitTransform = gameWrapper.style.transform = 'scale(' + gameScale + ')';
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*10000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}