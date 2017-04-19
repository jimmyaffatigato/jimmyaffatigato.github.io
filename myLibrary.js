function noteFrequency(hs, fixedNote) {
    if (fixedNote == null) {
        fixedNote = 440;
    }
    var x = Math.pow(2,(1/12))
    freq = fixedNote * Math.pow(x, hs)
    return freq.toFixed(4);
}
function midiToFreq(midiNote, temp) {
    halfSteps = midiNote - 57
    return noteFrequency(halfSteps, temp)
}
function randomColor() {
    return "#"+Math.random().toString(16).slice(-6)
}
function randomInt(min, max, size) {
    switch (size) {
        case "little":
            var out = 0
            out = Math.pow(randomInt(min, max)/10,2)
            return parseInt(out)
        break;
        case "big":
            var out = 0
            out = Math.sqrt(randomInt(min, max)) * 10;
            return parseInt(out);
        break;
        case null || undefined:
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        break;
    }
}
function randomWave() {
    switch (randomInt(0,3)) {
        case 0: return "sine";break;
        case 1: return "sawtooth";break;
        case 2: return "square";break;
        case 3: return "triangle";break;
    }
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
Array.prototype.random = function() {
    return this[Math.floor(Math.random()*this.length)]
}