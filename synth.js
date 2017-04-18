//Create Audio Context
var au = new AudioContext();
var volControl = new GainNode(au)
volControl.gain.value = 0.8;
var scope = new AnalyserNode(au)
volControl.connect(scope)
scope.connect(au.destination)


//Converts Beats Per Minute (BPM) to Hertz (Hz)
function bpmToHz(bpm) {
    return parseFloat(bpm/60).toFixed(3)
}

//Converts Hz to BPM
function hzToBpm(hz) {
    return parseInt(hz*60)
}

//Select preset from array
var pre = presets[1]
//Global Variables
//Portamento
var port = 0;
//Pitch Bend
var bend = 0;
var speedMult = 1;
var depthMult = 1;
//Voice Constructor
function Voice(note, vel) {
    var voice = this
    this.note = note;
    this.vel = vel/127;
    this.freq = parseFloat(midiToFreq(note))
    
    this.osc = new OscillatorNode(au)
    this.oscGain = new GainNode(au)
    this.osc.type = pre.oscType;
    this.oscGain.gain.value = this.vel
    this.filEnv = new BiquadFilterNode(au)
    this.filEnv.type = "lowpass";
    this.filEnv.Q.value = pre.fQ;
    this.volEnv = new GainNode(au)
    this.panner = new StereoPannerNode(au)

    //Start Envelope
    this.go = function() {
        //Pitch Envelope Initial Value
        switch (pre.pitchAttackType) {
            case "high": port = 2400;break;
            case "low": port = 0;break;
            case "port":break;
        }

        var bent = this.freq * (bend + 1)
        this.osc.frequency.setTargetAtTime(port, au.currentTime, 0)
        port = this.freq;
        //Pitch Envelope Attack
        this.osc.frequency.setTargetAtTime(bent,au.currentTime, pre.p.a[1])
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
        this.osc.stop(au.currentTime + 4)
        this.osc.onended = function() {delete voice}
    }

    //LFO 1
    this.lfo1 = new OscillatorNode(au);
    this.lfo1Gain = new GainNode(au);
    this.lfo1OnOff = pre.lfo1OnOff;
    this.lfo1.type = pre.lfo1Type;
    this.lfo1.frequency.value = pre.lfo1Speed * speedMult;
    this.lfo1Gain.gain.value = pre.lfo1Depth * depthMult;

    //Connections
    this.osc.connect(this.oscGain);
    this.oscGain.connect(this.filEnv)
    this.filEnv.connect(this.volEnv)
    this.volEnv.connect(this.panner)
    this.panner.connect(volControl)

    this.lfo1.connect(this.lfo1Gain)
    switch (pre.lfoMode) {
        case "vol":
            this.lfo1Gain.gain.value = pre.lfo1Depth
            this.lfo1Gain.connect(this.oscGain.gain);break;
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
            this.lfo1Gain.connect(this.osc.frequency)
            break;
    }

    this.osc.start()
    if (pre.lfo1OnOff == 1) {
        this.lfo1.start()
    }
}

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