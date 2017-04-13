//midistuff

//Note Frequency Functions
//Takes the number of half steps above or below A4 (positive or negative) and converts the new note to frequency
//Optional second argument redefines the frequency of A4 to change overall tuning (e.g. 443)
function noteFrequency(hs, fixedNote) {
    if (fixedNote == null) {
        fixedNote = 440;
    }
    var x = Math.pow(2,(1/12))
    freq = fixedNote * Math.pow(x, hs)
    return freq.toFixed(4);
}

//Takes a MIDI note value (between 0 and 127) and converts it to frequency
//Optional second argument defines the frequency of A4 (default:440)
function midiToFreq(midiNote, temp) {
    halfSteps = midiNote - 57
    return noteFrequency(halfSteps, temp)
}

function midiToNoteName(midiNote) {
    var name = ""
    var oct = 0;
    oct = Math.floor(midiNote / 12) - 1
    midiNote = midiNote % 12
    switch (midiNote) {
        case 0:name = "C";break;
        case 1:name = "C#/Db";break
        case 2:name = "D";break;
        case 3:name = "D#/Eb";break;
        case 4:name = "E";break;
        case 5:name = "F";break;
        case 6:name = "F#/Gb";break;
        case 7:name = "G";break;
        case 8:name = "G#/Ab";break;
        case 9:name = "A";break;
        case 10:name = "A#/Bb";break;
        case 11:name = "B";break;
    }
    return name+oct;
}
var notesOn = [];
function openMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false
        }).then(midiContext, midiFail);
    }
    //I don't really know how this part works
    function midiContext(MIDIAccess) {
        midi = MIDIAccess;
        //Initialize the input and output variable in this scope
        var input, output;
        //If there is an input present, default to Port 0; If there are multiple devices, it's still Port 0.
        if (midi.inputs.size > 0) {
            input = midi.inputs.get(0)
            input.onmidimessage = onMIDIMessage;
            console.log("MIDI Device: " + input.manufacturer + " " + input.name)
        }
        else {
            console.log("No MIDI devices present. Try refreshing (F5)")
        }
        //MIDI output defaults to Port 0 also
        if (midi.outputs.size > 0) {
            output = midi.outputs.get(0)
        }
        //Called when a MIDI message is received
        function onMIDIMessage(event) {
            //Message is an array : [channel, note, velocity]
            data = event.data;
            switch (data[0]) {
                //Note Message
                case 144:
                    //Note On
                    if (data[2] > 0){
                        //Create a new voice with the Voice(note, velocity) constructor
                        var newVoice = new Voice(data[1], data[2]);
                        //Add it to the array of notes that are currently on
                        notesOn.push(newVoice);
                        newVoice.go()
                    }
                    //Note Off
                    else {
                        //Cycles through notes that are on
                        for(notes=0;notes<notesOn.length;notes++){
                            //If the note value from the array item matches the Note On message, call the bye() method to end the voice
                            if(notesOn[notes].note==data[1]){
                                notesOn[notes].bye()
                                //Remove finished voices from the array
                            }
                        }break;
                    }
                case 176:
                    //Mod Wheel
                    if (data[1] == 1) {
                        bend = data[2]/127
                        for (notes=0;notes<notesOn.length;notes++) {
                            notesOn[notes].osc1.frequency.setTargetAtTime(notesOn[notes].freq * (bend + 1), au.currentTime, 0)
                        }
                    }
                    if (data[1] == 7) {
                        pre.volControl = data[2]/127
                        for (notes=0;notes<notesOn.length;notes++) {
                            notesOn[notes].volControl.gain.setTargetAtTime(pre.volControl, au.currentTime, 0)
                        }
                    }
                    
                    
                    break;
            }
        }
        function sendANote(note) {
            var noteOnMessage = [144, note, 99];
            output.send( noteOnMessage );
            output.send( [128, note, 0], window.performance.now() + 50.0 );  
        }
    }
    function midiFail() {
        console.log("This browser does not support MIDI devices")
    }
}
openMIDI();

