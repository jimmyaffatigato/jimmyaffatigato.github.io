var au = new AudioContext();
var volControl = new GainNode(au);
volControl.gain.value = 0.8;
var scope = new AnalyserNode(au);
volControl.connect(scope);
scope.connect(au.destination);

var pre = presets[1]
var port = 0;
var bend = 0;
var speedMult = 1;
var depthMult = 1;

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
    var bufferSize = 2 * au.sampleRate,
    noiseBuffer = au.createBuffer(1, bufferSize, au.sampleRate),
    output = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random();
    }
    var whiteNoise = au.createBufferSource();
    var noiseGain = new GainNode(au)
    noiseGain.gain.value = 0.1
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);
    if (noise.checked == true) {
        whiteNoise.connect(noiseGain)
        noiseGain.connect(this.filEnv);
    }

    this.go = function() {
        switch (pre.pitchAttackType) {
            case "high": port = 2400;break;
            case "low": port = 0;break;
            case "port":break;
        }
        var bent = this.freq * (bend + 1)
        this.osc.frequency.setTargetAtTime(port, au.currentTime, 0)
        port = this.freq;
        this.osc.frequency.setTargetAtTime(bent,au.currentTime, pre.p.a[1])
        this.filEnv.frequency.setTargetAtTime(0, au.currentTime, 0)
        this.filEnv.frequency.setTargetAtTime(pre.f.a[0],au.currentTime, pre.f.a[1])
        this.filEnv.frequency.setTargetAtTime(pre.f.d[0],(au.currentTime+pre.f.a[1]), pre.f.d[1])
        this.volEnv.gain.setTargetAtTime(0, au.currentTime, 0)
        this.volEnv.gain.setTargetAtTime(pre.v.a[0],au.currentTime, pre.v.a[1])
        this.volEnv.gain.setTargetAtTime(pre.v.d[0],(au.currentTime+pre.v.a[1]), pre.v.d[1])
    }
    this.bye = function() {
        this.filEnv.frequency.setTargetAtTime(pre.f.s[0],au.currentTime, pre.f.s[1])
        this.filEnv.frequency.setTargetAtTime(pre.f.r[0],(au.currentTime+pre.f.s[1]), pre.f.r[1])
        this.volEnv.gain.setTargetAtTime(pre.v.s[0],au.currentTime, pre.v.s[1])
        this.volEnv.gain.setTargetAtTime(pre.v.r[0],au.currentTime+pre.v.s[1], pre.v.r[1])
        this.osc.stop(au.currentTime + 4)
        whiteNoise.stop(au.currentTime + 4)
    }

    //LFO 1
    this.lfo = new OscillatorNode(au);
    this.lfoGain = new GainNode(au);
    this.lfoOnOff = pre.lfoOnOff;
    this.lfo.type = pre.lfoType;
    this.lfo.frequency.value = pre.lfoSpeed * speedMult;
    this.lfoGain.gain.value = pre.lfoDepth * depthMult;

    //Connections
    this.osc.connect(this.oscGain);
    this.oscGain.connect(this.filEnv)
    this.filEnv.connect(this.volEnv)
    this.volEnv.connect(this.panner)
    this.panner.connect(volControl)

    this.lfo.connect(this.lfoGain)
    switch (pre.lfoMode) {
        case "vol":
            this.lfoGain.gain.value = pre.lfoDepth
            this.lfoGain.connect(this.oscGain.gain);break;
        case "fil":
            this.lfoGain.gain.maxValue = 20000;
            this.lfoGain.gain.minValue = 0;
            this.lfoGain.gain.value = (pre.f.d[0] * pre.lfoDepth) + 100;
            this.lfoGain.connect(this.filEnv.frequency);
        break;
        case "pan":
            this.lfoGain.gain.value = pre.lfoDepth
            this.lfoGain.connect(this.panner.pan);break
        case "pitch":
            this.lfoGain.gain.value = this.freq * pre.lfoDepth
            this.lfoGain.connect(this.osc.frequency)
            break;
    }

    this.osc.start()
    if (pre.lfoOnOff == 1) {
        this.lfo.start()
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