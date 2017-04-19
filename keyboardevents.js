var noteFlags = []
for (k=0;k<127;k++){
    noteFlags.push(true);
}
function voiceOn(note, velocity) {
    if (noteFlags[note] == true) {
        var newVoice = new Voice(note, velocity);
        notesOn.push(newVoice);
        newVoice.go();
        noteFlags[note] = false;
    }
}
function voiceOff(note) {
    noteFlags[note] = true;
    for(notes=0;notes<notesOn.length;notes++){
        if(notesOn[notes].note==note){
            notesOn[notes].bye();
            notesOn.splice(notes,1);        
        }
    }
}

window.onkeydown = function() {
    switch (event.key) {
        case "a":
            voiceOn(48,127);break;
        case "w":
            voiceOn(49,127);break;
        case "s":
            voiceOn(50,127);break;
        case "e":
            voiceOn(51,127);break;
        case "d":
            voiceOn(52,127);break;
        case "f":
            voiceOn(53,127);break;
        case "t":
            voiceOn(54,127);break;
        case "g":
            voiceOn(55,127);break;
        case "y":
            voiceOn(56,127);break;
        case "h":
            voiceOn(57,127);break;
        case "u":
            voiceOn(58,127);break;
        case "j":
            voiceOn(59,127);break;
        case "k":
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
    }
}

window.onkeyup = function() {
    switch (event.key) {
        case "a":
            voiceOff(48);break;
        case "w":
            voiceOff(49);break;
        case "s":
            voiceOff(50);break;
        case "e":
            voiceOff(51);break;
        case "d":
            voiceOff(52);break;
        case "f":
            voiceOff(53);break;
        case "t":
            voiceOff(54);break;
        case "g":
            voiceOff(55);break;
        case "y":
            voiceOff(56);break;
        case "h":
            voiceOff(57);break;
        case "u":
            voiceOff(58);break;
        case "j":
            voiceOff(59);break;
        case "k":
            voiceOff(60);break;
    }
}