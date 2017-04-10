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
        var notesOn = [];
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
        p: {a:[0,0.05],d:[0,0],s:[0,0],r:[0,.5]},
        f: {a:[8000,0.5],d:[4000,0.5],s:[2500,1],r:[0,0.5]},
        v: {a:[1,0.25],d:[0.75,0.5],s:[0.7,1],r:[0,0.5]},
        // Envelope values : filter: {attack:[value,time],decay[value,time], ...}
        filterQ: 20,
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
        filterQ: randomInt(1,25),
        lfo1OnOff: randomInt(0,1),
        lfo1Speed: Math.random() * randomInt(1,10),
        lfo1Depth: Math.random(),
        lfo1Type: randomWave(),
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
    this.filEnv.Q.value = pre.filterQ;
    this.volEnv = new GainNode(au)
    //Start Envelope
    this.go = function() {
        this.osc1.frequency.setTargetAtTime(0, au.currentTime, 0)
        this.osc1.frequency.setTargetAtTime(this.freq,au.currentTime, pre.p.a[1])
        this.filEnv.frequency.setTargetAtTime(0, au.currentTime, 0)
        this.filEnv.frequency.setTargetAtTime(pre.f.a[0],au.currentTime, pre.f.a[1])
        this.filEnv.frequency.setTargetAtTime(pre.f.d[0],(au.currentTime+pre.f.a[1]), pre.f.d[1])
        this.volEnv.gain.setTargetAtTime(0, au.currentTime, 0)
        this.volEnv.gain.setTargetAtTime(pre.v.a[0],au.currentTime, pre.v.a[1])
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

var a = document.getElementById("a"),
b = document.getElementById("b"),
c = document.getElementById("c"),
d = document.getElementById("d"),
e = document.getElementById("e"),
f = document.getElementById("f"),
g = document.getElementById("g"),
h = document.getElementById("h"),
j = document.getElementById("j"),
k = document.getElementById("k"),
l = document.getElementById("l"),
m = document.getElementById("m"),
n = document.getElementById("n"),
o = document.getElementById("o");

//Update HTML
function show() {
    a.innerHTML = "Wave: " + pre.osc1Type.capitalize();
    c.innerHTML = "Filter Attack: " + pre.f.a[1].toFixed(1)+ "s (" +pre.f.a[0]+" Hz)";
    d.innerHTML = "Filter Decay: " + pre.f.d[1].toFixed(1)+ "s (" +pre.f.d[0]+" Hz)";
    e.innerHTML = "Filter Sustain: " + pre.f.s[1].toFixed(1)+ "s (" +pre.f.s[0]+" Hz)";
    f.innerHTML = "Filter Release: " + pre.f.r[1].toFixed(1)+ "s (" +pre.f.r[0]+" Hz)";
    g.innerHTML = "Volume Attack: " + pre.v.a[1].toFixed(1)+ "s (" +pre.v.a[0].toFixed(1)+"x)";
    h.innerHTML = "Volume Decay: " + pre.v.d[1].toFixed(1)+ "s (" +pre.v.d[0].toFixed(1)+"x)";
    j.innerHTML = "Volume Sustain: " + pre.v.s[1].toFixed(1)+ "s (" +pre.v.s[0].toFixed(1)+"x)";
    k.innerHTML = "Volume Release: " + (pre.v.r[1]).toFixed(1)+ "s (" +pre.v.r[0].toFixed(1)+"x)";
    l.innerHTML = "Filter Q: " + pre.filterQ;
    m.innerHTML = "LFO: Off"
    if (pre.lfo1OnOff == 1) {
        m.innerHTML = "LFO Speed: " + pre.lfo1Speed.toFixed(1) + " Hz";
        n.innerHTML = "LFO Wave: " + pre.lfo1Type.capitalize();
        o.innerHTML = "LFO Depth: " + pre.lfo1Depth.toFixed(1) + "x";
    }
}
show()