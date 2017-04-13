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



//Converts Beats Per Minute (BPM) to Hertz (Hz)
function bpmToHz(bpm) {
    return parseFloat(bpm/60).toFixed(3)
}

//Converts Hz to BPM
function hzToBpm(hz) {
    return parseInt(hz*60)
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
        port: randomInt(0,1),
        pitchAttackType: "port",
        p: {
            a:[0,Math.random()*0.1],
            d:[0,0],
            s:[0,0],
            r:[0,.5]},
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
        lfo1Speed: {hz:Math.random(),bpm:0},
        lfo1Depth: Math.random(),
        lfo1Type: randomWave(),
        lfoMode:"fil",
        modWheel: "pitch",
        bendWheel: "pitch",
        volControl: null
    }
]

//Create Audio Context
var au = new AudioContext();

//Select preset from array
var pre = presets[1]
//Global Variables
//Portamento
var port = 0;
//Pitch Bend
var bend = 0;
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
    this.panner = new StereoPannerNode(au)
    this.volControl = new GainNode(au)
    this.volControl.gain.value = 1.2;

    //Start Envelope
    this.go = function() {
        //Pitch Envelope Initial Value
        if (pre.port == 0) {
            port = 0
        }

        var bent = this.freq * (bend + 1)
        this.osc1.frequency.setTargetAtTime(port, au.currentTime, 0)
        port = this.freq;
        //Pitch Envelope Attack
        this.osc1.frequency.setTargetAtTime(bent,au.currentTime, pre.p.a[1])
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
        this.osc1.onended = function() {delete voice}
    }

    //LFO 1
    this.lfo1 = new OscillatorNode(au);
    this.lfo1Gain = new GainNode(au);
    this.lfo1OnOff = pre.lfo1OnOff;
    this.lfo1.type = pre.lfo1Type;
    this.lfo1.frequency.value = pre.lfo1Speed.hz;
    this.lfo1Gain.gain.value = pre.lfo1Depth;

    //Connections
    this.osc1.connect(this.osc1Gain);
    this.osc1Gain.connect(this.filEnv)
    this.filEnv.connect(this.volEnv)
    this.volEnv.connect(this.panner)
    this.panner.connect(this.volControl)
    this.volControl.connect(au.destination)

    this.lfo1.connect(this.lfo1Gain)
    switch (pre.lfoMode) {
        case "vol":
            this.lfo1Gain.gain.value = pre.lfo1Depth
            this.lfo1Gain.connect(this.osc1Gain.gain);break;
        case "fil":
            this.lfo1Gain.gain.maxValue = 20000;
            this.lfo1Gain.gain.minValue = 0;
            this.lfo1Gain.gain.value = (pre.f.d[0] * pre.lfo1Depth) + 100;
            this.lfo1Gain.connect(this.filEnv.frequency);
        break;
        case "pan":
            this.lfo1Gain.gain.value = pre.lfo1Depth
            this.lfo1Gain.connect(this.panner.pan);break
        case "pitch":
            this.lfo1Gain.gain.value = this.freq * pre.lfo1Depth
            this.lfo1Gain.connect(this.osc1.frequency)
            break;
    }

    this.osc1.start()
    if (pre.lfo1OnOff == 1) {
        this.lfo1.start()
    }
}


//HTML Element Definitions
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
var hzCheck = document.getElementById("hzCheck")

//Update HTML
function show() {
    //Osc Type
    oscType.value = pre.osc1Type;
    //Pitch Attack
    pAT.value = pre.p.a[1].toFixed(1)+"s";
    //Filter Attack
    fAT.value = pre.f.a[1].toFixed(1)+"s";fAV.value = pre.f.a[0].toFixed(0) + " Hz"
    //Filter Decay
    fDT.value = pre.f.d[1].toFixed(1)+"s";fDV.value = pre.f.d[0].toFixed(0) + " Hz"
    //Filter Sustain
    fST.value = pre.f.s[1].toFixed(1)+"s";fSV.value = pre.f.s[0].toFixed(0) + " Hz"
    //Filter Release
    fRT.value = pre.f.r[1].toFixed(1)+"s";fRV.value = pre.f.r[0].toFixed(0) + " Hz"
    //Filter Q
    fQ.value = pre.fQ;
    //Volume Attack
    vAT.value = pre.v.a[1].toFixed(1)+"s";vAV.value = pre.v.a[0].toFixed(1) + "x"
    //Volume Decay
    vDT.value = pre.v.d[1].toFixed(1)+"s";vDV.value = pre.v.d[0].toFixed(1) + "x"
    //Volume Sustain
    vST.value = pre.v.s[1].toFixed(1)+"s";vSV.value = pre.v.s[0].toFixed(1) + "x"
    //Volume Release
    vRT.value = pre.v.r[1].toFixed(1)+"s";vRV.value = pre.v.r[0].toFixed(1) + "x"
    //LFO Switch
    lfoOnOff.checked = pre.lfo1OnOff;
    //LFO Wave Type
    lfoType.value = pre.lfo1Type;
    //LFO Depth
    lfoDepth.value = pre.lfo1Depth.toFixed(1) + "x"
    //Turn preset object into string and print to text box
    settings.value = JSON.stringify(pre);
}
function changeSpeed() {
    if (hzCheck.checked == true) {
        pre.lfo1Speed.hz = bpmToHz(lfoSpeed.value)
        pre.lfo1Speed.bpm = lfoSpeed.value
        lfoSpeed.value = pre.lfo1Speed.hz
    }
    else {
        pre.lfo1Speed.bpm = hzToBpm(lfoSpeed.value)
        pre.lfo1Speed.hz = lfoSpeed.value
        lfoSpeed.value = pre.lfo1Speed.bpm
    }
}
lfoSpeed.value = pre.lfo1Speed.hz
function changeValues() {
    pre.osc1Type = oscType.value;
    pre.p.a[1] = parseFloat(pAT.value);
    pre.f.a[1] = parseFloat(fAT.value);pre.f.a[0] = parseFloat(fAV.value)
    pre.f.d[1] = parseFloat(fDT.value);pre.f.d[0] = parseFloat(fDV.value)
    pre.f.s[1] = parseFloat(fST.value);pre.f.s[0] = parseFloat(fSV.value)
    pre.f.r[1] = parseFloat(fRT.value);pre.f.r[0] = parseFloat(fRV.value)
    pre.fQ = parseFloat(fQ.value);
    pre.v.a[1] = parseFloat(vAT.value);pre.v.a[0] = parseFloat(vAV.value)
    pre.v.d[1] = parseFloat(vDT.value);pre.v.d[0] = parseFloat(vDV.value)
    pre.v.s[1] = parseFloat(vST.value);pre.v.s[0] = parseFloat(vSV.value)
    pre.v.r[1] = parseFloat(vRT.value);pre.v.r[0] = parseFloat(vRV.value)
    //LFO On/Off
    if (lfoOnOff.checked == true) {
        pre.lfo1OnOff = 1
    }
    else {
        pre.lfo1OnOff = 0
    }
    //LFO Mode
    pre.lfoMode = lfoMode.value

    //LFO Wave Type
    pre.lfo1Type = lfoType.value;

    //LFO Depth
    pre.lfo1Depth = parseFloat(lfoDepth.value);
    show()
}
show()




function loadSettings() {
    pre = JSON.parse(settings.value)
    show()
}
var code = ""
var url = window.location.href;
for (y=0;y<url.length;y++) {
    if (url[y-1] == "?") {
        code = url.slice(y)
    }
}
if (code.length > 0) {
    code = decodeURIComponent(code)
    pre = JSON.parse(code)
    show()
}

document.body.style.backgroundColor = randomColor();


var hzOrBpm = document.getElementsByName("hzOrBpm")