/**
 * Generates a random number with a gaussian distribution (most values in the middle part, few in extreme values
 * @returns int a random number with a gaussian distribution
 */
function gaussianRandom() {
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

module.exports = {
    gaussianRandom,
};