//Create Audio Context
var au = new AudioContext();


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
    this.volControl.gain.value = 0.8* pre.volControl

    //Start Envelope
    this.go = function() {
        //Pitch Envelope Initial Value
        switch (pre.pitchAttackType) {
            case "high": port = 2400;break;
            case "low": port = 0;break;
            case "port":break;
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
    this.lfo1.frequency.value = pre.lfo1Speed;
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
    pAT.value = parseFloat(pre.p.a[1])+"s";
    pitchAttackType.value = pre.pitchAttackType;
    //Filter Attack
    fAT.value = parseFloat(pre.f.a[1])+"s";fAV.value = parseFloat(pre.f.a[0]).toFixed(0) + " Hz"
    //Filter Decay
    fDT.value = parseFloat(pre.f.d[1])+"s";fDV.value = parseFloat(pre.f.d[0]).toFixed(0) + " Hz"
    //Filter Sustain
    fST.value = parseFloat(pre.f.s[1])+"s";fSV.value = parseFloat(pre.f.s[0]).toFixed(0) + " Hz"
    //Filter Release
    fRT.value = parseFloat(pre.f.r[1])+"s";fRV.value = parseFloat(pre.f.r[0]).toFixed(0) + " Hz"
    //Filter Q
    fQ.value = pre.fQ;
    //Volume Attack
    vAT.value = parseFloat(pre.v.a[1])+"s";vAV.value = parseFloat(pre.v.a[0]).toFixed(1) + "x"
    //Volume Decay
    vDT.value = parseFloat(pre.v.d[1])+"s";vDV.value = parseFloat(pre.v.d[0]).toFixed(1) + "x"
    //Volume Sustain
    vST.value = parseFloat(pre.v.s[1])+"s";vSV.value = parseFloat(pre.v.s[0]).toFixed(1) + "x"
    //Volume Release
    vRT.value = parseFloat(pre.v.r[1])+"s";vRV.value = parseFloat(pre.v.r[0]).toFixed(1) + "x"
    //LFO Switch
    lfoOnOff.checked = pre.lfo1OnOff;
    //LFO Wave Type
    lfoType.value = pre.lfo1Type;
    //LFO Mode
    lfoMode.value = pre.lfoMode
    lfoSpeed.value = pre.lfo1Speed;
    //LFO Depth
    lfoDepth.value = parseFloat(pre.lfo1Depth)+ "x"
    //Turn preset object into string and print to text box
    settings.value = JSON.stringify(pre);
}
function changeValues() {
    pre.osc1Type = oscType.value;
    pre.pitchAttackType = pitchAttackType.value
    pre.p.a[1] = parseFloat(pAT.value);
    pre.f.a[1] = parseFloat(fAT.value);pre.f.a[0] = parseFloat(fAV.value)
    pre.f.d[1] = parseFloat(fDT.value);pre.f.d[0] = parseFloat(fDV.value)
    pre.f.s[1] = parseFloat(fST.value);pre.f.s[0] = parseFloat(fSV.value)
    pre.f.r[1] = parseFloat(fRT.value);pre.f.r[0] = parseFloat(fRV.value)
    pre.fQ = parseInt(fQ.value);
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

    pre.lfo1Speed = lfoSpeed.value;

    //LFO Depth
    pre.lfo1Depth = parseFloat(lfoDepth.value);
    show()
}
show()
changeValues()



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
leftBox.style.backgroundColor = randomColor();
rightBox.style.backgroundColor = randomColor();


var hzOrBpm = document.getElementsByName("hzOrBpm")