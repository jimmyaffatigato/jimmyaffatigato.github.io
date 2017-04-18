var noteC = true;
var noteCs = true;
var noteD = true;
var noteDs = true;
var noteE = true;
var noteF = true;
var noteFs = true;
var noteG = true;
var noteGs = true;
var noteA = true;
var noteAs = true;
var noteB = true;
var noteCUp = true;

//MAKE A FUNCTION INSTEAD
window.onkeydown = function() {
    switch (event.key) {
        case "q": 
            if (settings.style.visibility == "visible") {
                settings.style.visibility = "hidden";
            }
            else {
                settings.style.visibility = "visible"
            }break;
        case "z":
            if (document.body.style.backgroundColor != "white") {
                document.body.style.backgroundColor = "white"
                leftBox.style.backgroundColor = "white"
                rightBox.style.backgroundColor = "white"
            }
            else {
                document.body.style.backgroundColor = randomColor();
                leftBox.style.backgroundColor = randomColor();
                rightBox.style.backgroundColor = randomColor();
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
        case "w":
            if (noteCs == true) {
                var newVoice = new Voice(49, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteCs = false;
            }break;
        case "s":
            if (noteD == true) {
                var newVoice = new Voice(50, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteD = false;
            }break;
        case "e":
            if (noteDs == true) {
                var newVoice = new Voice(51, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteDs = false;
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
        case "t":
            if (noteFs == true) {
                var newVoice = new Voice(54, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteFs = false;
            }break;
        case "g":
            if (noteG == true) {
                var newVoice = new Voice(55, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteG = false;
            }break;
        case "y":
            if (noteGs == true) {
                var newVoice = new Voice(56, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteGs = false;
            }break;
        case "h":
            if (noteA == true) {
                var newVoice = new Voice(57, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteA = false;
            }break;
        case "u":
            if (noteAs == true) {
                var newVoice = new Voice(58, 127);
                notesOn.push(newVoice);
                newVoice.go()
                noteAs = false;
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
        case "v":
            draw();
            break;

    }
}
//REMOVE COMMENTS
//MAKE EACH CASE A FUNCTION WITH NOTE NUMBER AS ARGUMENT

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
            }break;
        case "w":
            noteCs = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==49){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }break;
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
            }break;
        case "e":
            noteDs = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==51){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }break;
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
            }break;
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
            }break;
        case "t":
            noteFs = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==54){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }break;
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
            }break;
        case "y":
            noteGs = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==56){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }break;
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
            }break;
        case "u":
            noteAs = true
            //Cycles through notes that are on
            for(notes=0;notes<notesOn.length;notes++){
                //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                if(notesOn[notes].note==58){
                    notesOn[notes].bye()
                    //Remove finished voices from the array
                    notesOn.splice(notes,1)        
                }
            }break;
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
            }break;
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
            }break;
    }
}