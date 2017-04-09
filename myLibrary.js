//Translates beats per minute to milliseconds. Accepts float.
function bpm(bpm) {
    return (60.0 / bpm) * 1000
}
//Rolls dice.
//First argument is the number of sides on the dice.
//Second argument (optional) is the number of dice. Default is one.
function d(num,times) {
    return randomInt(1,num);
}
//Translates midi note value (integer 0-127) to frequency in equal temperament.
function midiToFreq(midiNote) {
    var a = 440
    return (a / 32) * (2 ^ ((midiNote - 9) / 12));
}
//Generates a random color in hex format.
function randomColor() {
    return "#"+Math.random().toString(16).slice(-6)
}
//Generates a random integer between (inclusive) two numbers.
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDie() {
    switch(randomInt(0,3)){
        case 0:return "d4";break;
        case 1:return "d6";break;
        case 2:return "d8";break;
        case 3:return "d12";break;
    }
}

//Capitalize the first letter of a string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//Method for obtaining a random array index
Array.prototype.random = function() {
    return this[Math.floor(Math.random()*this.length)]
}
