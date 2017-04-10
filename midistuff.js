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
                                notesOn.splice(notes,1)
                            }
                        }
                    }
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

//Array of preset objects
var presets = [
    {
        num:0,
        name:"pre One",
        osc1Type: "square",
        //Pitch Envelope
        p: {
            a:[0,0.05],
            d:[0,0],
            s:[0,0],
            r:[0,.5]},
        f: {
            a:[8000,0.5],
            d:[4000,0.5],
            s:[2500,1],
            r:[0,0.5]},
        v: {
            a:[1,0.25],
            d:[0.75,0.5],
            s:[0.7,1],
            r:[0,0.5]},
        // Envelope values : filter: {attack:[value,time],decay[value,time], ...}
        fQ: 20,
        lfo1OnOff: 1,
        lfo1Speed: 0.5,
        lfo1Depth: 1,
        lfo1Type : "square",
    },
    {
        num:1,
        //Random preset randomizes each parameter within certain ranges
        name:"Random",
        osc1Type: randomWave(),
        p: {a:[0,Math.random()*0.05],d:[0,0],s:[0,0],r:[0,.5]},
        f: {
            a:[randomInt(0,10000),Math.random()*0.25],
            d:[randomInt(0,10000),Math.random()*0.25],
            s:[randomInt(0,10000),Math.random()],
            r:[randomInt(0,10000),Math.random()*0.25]},
        v: {
            a:[Math.random(),Math.random()*0.25],
            d:[Math.random(),Math.random()*0.25],
            s:[Math.random(),Math.random()],
            r:[0,Math.random()*0.25]},
        fQ: randomInt(1,25),
        lfo1OnOff: randomInt(0,1),
        lfo1Speed: Math.random() * randomInt(1,10),
        lfo1Depth: Math.random(),
        lfo1Type: randomWave(),
    },
    {
        num:2,
        name:"Form",
        osc1Type: "sine",
        p: {a:[0,0],d:[0,0],s:[0,0],r:[0,0]},
        f: {
            a:[0,0],
            d:[0,0],
            s:[0,0],
            r:[0,0]},
        v: {
            a:[0,0],
            d:[0,0],
            s:[0,0],
            r:[0,0]},
        fQ: 0,
        lfo1OnOff: 1,
        lfo1Speed: 1,
        lfo1Depth: 1,
        lfo1Type: "sine",
    }
]

//Create Audio Context
var au = new AudioContext();

//Select preset from array
var pre = presets[1]

//Voice Constructor
function Voice(note, vel) {
    var voice = this
    this.note = note;
    this.vel = vel/127;
    this.freq = parseFloat(midiToFreq(note))

    this.osc1 = new OscillatorNode(au)
    this.osc1Gain = new GainNode(au)
    this.osc1.type = pre.osc1Type;
    this.osc1Gain.gain.value = this.vel
    this.filEnv = new BiquadFilterNode(au)
    this.filEnv.type = "lowpass";
    this.filEnv.Q.value = pre.fQ;
    this.volEnv = new GainNode(au)
    //Start Envelope
    this.go = function() {
        //Pitch Envelope Initial Value
        this.osc1.frequency.setTargetAtTime(0, au.currentTime, 0)
        //Pitch Envelope Attack
        this.osc1.frequency.setTargetAtTime(this.freq,au.currentTime, pre.p.a[1])
        //Filter Envelope Initial Value
        this.filEnv.frequency.setTargetAtTime(0, au.currentTime, 0)
        //Filter Envelope Attack
        this.filEnv.frequency.setTargetAtTime(pre.f.a[0],au.currentTime, pre.f.a[1])
        //Filter Envelope Decay
        this.filEnv.frequency.setTargetAtTime(pre.f.d[0],(au.currentTime+pre.f.a[1]), pre.f.d[1])
        //Volume Envelope Initial Value
        this.volEnv.gain.setTargetAtTime(0, au.currentTime, 0)
        //Volume Envelope Attack
        this.volEnv.gain.setTargetAtTime(pre.v.a[0],au.currentTime, pre.v.a[1])
        //Volume Envelope Decay
        this.volEnv.gain.setTargetAtTime(pre.v.d[0],(au.currentTime+pre.v.a[1]), pre.v.d[1])
    }
    //Finish Envelope and Stop Oscillator (It is automatically removed)
    this.bye = function() {
        //Filter Envelope Sustain
        this.filEnv.frequency.setTargetAtTime(pre.f.s[0],au.currentTime, pre.f.s[1])
        //Filter Envelope Release
        this.filEnv.frequency.setTargetAtTime(pre.f.r[0],(au.currentTime+pre.f.s[1]), pre.f.r[1])
        //Volume Envelope Sustain
        this.volEnv.gain.setTargetAtTime(pre.v.s[0],au.currentTime, pre.v.s[1])
        //Volume Envelope Release
        this.volEnv.gain.setTargetAtTime(pre.v.r[0],au.currentTime+pre.v.s[1], pre.v.r[1])
        //Stop Oscillator after 4 seconds
        this.osc1.stop(au.currentTime + 4)
    }

    //LFO 1
    this.lfo1 = new OscillatorNode(au);
    this.lfo1Gain = new GainNode(au);
    this.lfo1OnOff = pre.lfo1OnOff;
    this.lfo1.type = pre.lfo1Type;
    this.lfo1.frequency.value = pre.lfo1Speed;
    this.lfo1Gain.gain.value = pre.lfo1Depth;

    //Connections
    this.osc1.connect(this.osc1Gain);
    this.osc1Gain.connect(this.filEnv)
    this.filEnv.connect(this.volEnv)
    this.volEnv.connect(au.destination)

    this.lfo1.connect(this.lfo1Gain)
    this.lfo1Gain.connect(this.osc1Gain.gain)

    this.osc1.start()
    if (pre.lfo1OnOff == 1) {
        this.lfo1.start()
    }
}

var fAT = document.getElementById("fAT")
var fDT = document.getElementById("fDT")
var fST = document.getElementById("fST")
var fRT = document.getElementById("fRT")
var fAV = document.getElementById("fAV")
var fDV = document.getElementById("fDV")
var fSV = document.getElementById("fSV")
var fRV = document.getElementById("fRV")
var vAT = document.getElementById("vAT")
var vDT = document.getElementById("vDT")
var vST = document.getElementById("vST")
var vRT = document.getElementById("vRT")
var vAV = document.getElementById("vAV")
var vDV = document.getElementById("vDV")
var vSV = document.getElementById("vSV")
var vRV = document.getElementById("vRV")
var lfoOnOff = document.getElementById("lfoOnOff")
var lfoType = document.getElementById("lfoType")
var lfoSpeed = document.getElementById("lfoSpeed")
var lfoDepth = document.getElementById("lfoDepth")
var settings = document.getElementById("settings")

//Update HTML
function show() {
    oscType.value = pre.osc1Type;
    fAT.value = pre.f.a[1].toFixed(1)+"s";fAV.value = pre.f.a[0].toFixed(0) + " Hz"
    fDT.value = pre.f.d[1].toFixed(1)+"s";fDV.value = pre.f.d[0].toFixed(0) + " Hz"
    fST.value = pre.f.s[1].toFixed(1)+"s";fSV.value = pre.f.s[0].toFixed(0) + " Hz"
    fRT.value = pre.f.r[1].toFixed(1)+"s";fRV.value = pre.f.r[0].toFixed(0) + " Hz"
    fQ.value = pre.fQ;
    vAT.value = pre.v.a[1].toFixed(1)+"s";vAV.value = pre.v.a[0].toFixed(1) + "x"
    vDT.value = pre.v.d[1].toFixed(1)+"s";vDV.value = pre.v.d[0].toFixed(1) + "x"
    vST.value = pre.v.s[1].toFixed(1)+"s";vSV.value = pre.v.s[0].toFixed(1) + "x"
    vRT.value = pre.v.r[1].toFixed(1)+"s";vRV.value = pre.v.r[0].toFixed(1) + "x"
    lfoOnOff.checked = pre.lfo1OnOff;
    lfoType.value = pre.lfo1Type;
    lfoSpeed.value = pre.lfo1Speed.toFixed(1) + " Hz"
    lfoDepth.value = pre.lfo1Depth.toFixed(1) + "x"
    settings.value = JSON.stringify(pre);
}
function changeValues() {
    pre.osc1Type = oscType.value;
    pre.f.a[1] = parseFloat(fAT.value);pre.f.a[0] = parseFloat(fAV.value)
    pre.f.d[1] = parseFloat(fDT.value);pre.f.d[0] = parseFloat(fDV.value)
    pre.f.s[1] = parseFloat(fST.value);pre.f.s[0] = parseFloat(fSV.value)
    pre.f.r[1] = parseFloat(fRT.value);pre.f.r[0] = parseFloat(fRV.value)
    pre.fQ = parseFloat(fQ.value);
    pre.v.a[1] = parseFloat(vAT.value);pre.v.a[0] = parseFloat(vAV.value)
    pre.v.d[1] = parseFloat(vDT.value);pre.v.d[0] = parseFloat(vDV.value)
    pre.v.s[1] = parseFloat(vST.value);pre.v.s[0] = parseFloat(vSV.value)
    pre.v.r[1] = parseFloat(vRT.value);pre.v.r[0] = parseFloat(vRV.value)
    if (lfoOnOff.checked == true) {
        pre.lfo1OnOff = 1
    }
    else {
        pre.lfo1OnOff = 0
    }
    pre.lfo1Type = lfoType.value;
    pre.lfo1Speed = parseFloat(lfoSpeed.value);
    pre.lfo1Depth = parseFloat(lfoDepth.value);
    show()
}
function loadSettings() {
    pre = JSON.parse(settings.value)
    show()
}

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
        case "q": 
            if (settings.style.visibility == "visible") {
                settings.style.visibility = "hidden";
            }
            else {
                settings.style.visibility = "visible"
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
show()




/*
}
//Note Off
else {
    //Cycles through notes that are on
    for(notes=0;notes<notesOn.length;notes++){
        //If the note value from the array item matches the Note On message, call the bye() method to end the voice
        if(notesOn[notes].note==data[1]){
            notesOn[notes].bye()
            //Remove finished voices from the array
            notesOn.splice(notes,1)
        }
    }
}
*/