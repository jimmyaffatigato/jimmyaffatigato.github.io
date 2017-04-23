var noteFlags = []
for (k=0;k<127;k++){
    noteFlags.push(true);
}
function voiceOn(note, velocity) {
    note += (12 * octave);
    if (noteFlags[note] == true) {
        var newVoice = new Voice(note, velocity);
        notesOn.push(newVoice);
        newVoice.go();
        noteFlags[note] = false;
    }
}
function voiceOff(note) {
    note += (12 * octave)
    noteFlags[note] = true;
    for(notes=0;notes<notesOn.length;notes++){
        if(notesOn[notes].note==note){
            notesOn[notes].bye();
            notesOn.splice(notes,1);        
        }
    }
}
var octave = 1;
window.onkeydown = function() {
    switch (event.key) {
        case "a":
            voiceOn(48,32);break;
        case "w":
            voiceOn(49,32);break;
        case "s":
            voiceOn(50,32);break;
        case "e":
            voiceOn(51,32);break;
        case "d":
            voiceOn(52,32);break;
        case "f":
            voiceOn(53,32);break;
        case "t":
            voiceOn(54,32);break;
        case "g":
            voiceOn(55,32);break;
        case "y":
            voiceOn(56,32);break;
        case "h":
            voiceOn(57,32);break;
        case "u":
            voiceOn(58,32);break;
        case "j":
            voiceOn(59,32);break;
        case "k":
            voiceOn(60,32);break;
        case "o":
            voiceOn(60,127);break;
        case "l":
            voiceOn(60,127);break;
        case "p":
            voiceOn(60,127);break;
        case ";":
            voiceOn(60,127);break;
        case "\'":
            voiceOn(60,127);break;
        case "A":
            voiceOn(48,127);break;
        case "W":
            voiceOn(49,127);break;
        case "S":
            voiceOn(50,127);break;
        case "E":
            voiceOn(51,127);break;
        case "D":
            voiceOn(52,127);break;
        case "F":
            voiceOn(53,127);break;
        case "T":
            voiceOn(54,127);break;
        case "G":
            voiceOn(55,127);break;
        case "Y":
            voiceOn(56,127);break;
        case "H":
            voiceOn(57,127);break;
        case "U":
            voiceOn(58,127);break;
        case "J":
            voiceOn(59,127);break;
        case "K":
            voiceOn(60,127);break;
        case "O":
            voiceOn(60,127);break;
        case "L":
            voiceOn(60,127);break;
        case "P":
            voiceOn(60,127);break;
        case ":":
            voiceOn(60,127);break;
        case "\"":
            voiceOn(60,127);break;
        case "q": 
            if (settings.style.visibility == "visible") {
                settings.style.visibility = "hidden";
            }
            else {
                settings.style.visibility = "visible";
            }break;
        case " ":
            location.reload();break;
        case "=":
        case "+":
            octave++;
            for(notes=0;notes<notesOn.length;notes++){
                notesOn[notes].bye();
                notesOn.splice(notes,1);        
                }
            break;
        case "_":
        case "-":
            octave--;
            for(notes=0;notes<notesOn.length;notes++){
                notesOn[notes].bye();
                notesOn.splice(notes,1);        
                }
            break;
        case "x":
        case "X":
            for(notes=0;notes<notesOn.length;notes++){
                notesOn[notes].bye();
                notesOn.splice(notes,1);        
            }
    }
}

window.onkeyup = function() {
    switch (event.key) {
        case "a":
        case "A":
            voiceOff(48);break;
        case "w":
        case "W":
            voiceOff(49);break;
        case "s":
        case "S":
            voiceOff(50);break;
        case "e":
        case "E":
            voiceOff(51);break;
        case "d":
        case "D":
            voiceOff(52);break;
        case "f":
        case "F":
            voiceOff(53);break;
        case "t":
        case "T":
            voiceOff(54);break;
        case "g":
        case "G":
            voiceOff(55);break;
        case "y":
        case "Y":
            voiceOff(56);break;
        case "h":
        case "H":
            voiceOff(57);break;
        case "u":
        case "U":
            voiceOff(58);break;
        case "j":
        case "J":
            voiceOff(59);break;
        case "k":
        case "K":
            voiceOff(60);break;
        case "o":
        case "O":
            voiceOff(61);break;
        case "l":
        case "L":
            voiceOff(62);break;
        case "p":
        case "P":
            voiceOff(63);break;
        case ";":
        case ":":
            voiceOff(64);break;
        case "'":
        case "\"":
            voiceOff(65);break;
    }
}