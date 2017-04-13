
var noteC = true;
var noteD = true
var noteE = true
var noteF = true
var noteG = true
var noteA = true
var noteB = true
var noteCUp = true


window.onkeydown = function() {
    switch (event.key) {
        case "i": console.log(notesOn[0].filEnv.frequency.value)
        case "q": 
            if (settings.style.visibility == "visible") {
                settings.style.visibility = "hidden";
            }
            else {
                settings.style.visibility = "visible"
            }break;
        case "w":
            if (document.body.style.backgroundColor != "white") {
                document.body.style.backgroundColor = "white"
            }
            else {
                document.body.style.backgroundColor = randomColor();    
            }break;
        case " ":
            location.reload();break;
        case "a":
            if (noteC == true) {
                var newVoice = new Voice(48, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteC = false;
            }break;
        case "s":
            if (noteD == true) {
                var newVoice = new Voice(50, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteD = false;
            }break;
        case "d":
            if (noteE == true) {
                var newVoice = new Voice(52, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteE = false;
            }break;
        case "f":
            if (noteF == true) {
                var newVoice = new Voice(53, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteF = false;
            }break;
        case "g":
            if (noteG == true) {
                var newVoice = new Voice(55, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteG = false;
            }break;
        case "h":
            if (noteA == true) {
                var newVoice = new Voice(57, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteA = false;
            }break;
        case "j":
            if (noteB == true) {
                var newVoice = new Voice(59, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteB = false;
            }break;
        case "k":
            if (noteCUp == true) {
                var newVoice = new Voice(60, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteCUp = false;
            }break;

    }
}
window.onkeyup = function() {
    switch (event.key) {
        case "a":
            noteC = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==48){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
        case "s":
            noteD = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==50){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
        case "d":
            noteE = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==52){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
        case "f":
            noteF = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==53){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
        case "g":
            noteG = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==55){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
        case "h":
            noteA = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==57){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
        case "j":
            noteB = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==59){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
        case "k":
            noteCUp = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==60){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }
    }
}