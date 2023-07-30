// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function getRandomFromArray(array) {
  return array[getRandomInt(0, array.length)];
}

module.exports.getRandomInt = getRandomInt;
module.exports.getRandomFromArray = getRandomFromArray;