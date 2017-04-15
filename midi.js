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
        }).then(midiContext);
    }
    //I don't really know how this part works
    function midiContext(MIDIAccess) {
        midi = MIDIAccess;
        inputs = []
        for (h=0;h<9;h++){
            if (midi.inputs.get(h) != undefined) {
                var tex = document.createTextNode(midi.inputs.get(h).name)
                var opt = document.createElement("OPTION")
                opt.setAttribute("value",h)
                opt.appendChild(tex)
                devices.appendChild(opt)
            }
        }
        var input = midi.inputs.get(devices.value)
        input.onmidimessage = onMIDIMessage;
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
                        switch (pre.modWheel) {
                            case "pitch":
                                bend = data[2]/127
                                for (notes=0;notes<notesOn.length;notes++) {
                                    notesOn[notes].osc1.frequency.setTargetAtTime(notesOn[notes].freq * (bend + 1), au.currentTime, 0)
                                }
                                break;
                            case "speed":
                                speedMult = data[2]/64
                                for (notes=0;notes<notesOn.length;notes++) {
                                    notesOn[notes].lfo1.frequency.setTargetAtTime(pre.lfo1Speed * speedMult, au.currentTime, 0)
                                }
                                break;
                            break;
                            case "depth":
                                depthMult = data[2]/64
                                for (notes=0;notes<notesOn.length;notes++) {
                                    notesOn[notes].lfo1Gain.gain.setTargetAtTime(pre.lfo1Depth * depthMult, au.currentTime, 0)
                                }
                                break;
                            case "vol":
                                pre.volControl = data[2]/127
                                for (notes=0;notes<notesOn.length;notes++) {
                                    notesOn[notes].volControl.gain.setTargetAtTime(pre.volControl, au.currentTime, 0)
                                }
                                break;
                            case "fil":break;
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
    }
openMIDI();

