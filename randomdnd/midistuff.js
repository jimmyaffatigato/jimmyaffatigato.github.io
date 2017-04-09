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
    function midiContext(MIDIAccess) {
        midi = MIDIAccess;
        var input, output;
        if (midi.inputs.size > 0) {
            input = midi.inputs.get(0)
            input.onmidimessage = onMIDIMessage;
            console.log("MIDI Device: " + input.manufacturer + " " + input.name)
        }
        else {
            console.log("No MIDI devices present. Try refreshing (F5)")
        }
        if (midi.outputs.size > 0) {
            output = midi.outputs.get(0)
        }
        var presets = [
            {
                num:0,
                name:"Preset One",
                waveType: "square",
                filterAttack: 0,
                pitchAttack: 0.1,
                decay: 0.5,
                filterQ: 20,
                LFOOnOff : true,
                lfoSpeed: 0.5,
                lfoType : "square",
                calc: function() {}
            },
            {
                num:1,
                name:"Random",
                waveType: randomWave(),
                filterAttack: Math.random(),
                pitchAttack: randomInt(0,25,"little") / 1000,
                decay: Math.random() * Math.random(),
                filterQ: randomInt(1,25),
                lfoOnOff: randomInt(0,1),
                lfoSpeed: Math.random() * randomInt(1,10),
                lfoType: randomWave(),
                distortionOnOff: randomInt(0,1),
                distortion: Math.random() * randomInt(0, 3) + 2,
                calc: function() { }
            },
            {
                num:2,
                name:"Character",
                waveType: "sine",
                filterAttack: 0,
                pitchAttack: 0,
                decay: 0,
                filterQ: 0,
                lfoOnOff : 0,
                lfoSpeed: 0,
                lfoType : "sine",
                calc: function() {
                    presets[2].waveType = randomWave();
                    presets[2].filterAttack = 15/char.abilities.cha
                    presets[2].pitchAttack = char.abilities.int / 1000
                    presets[2].decay = char.hp/50
                    presets[2].filterQ = char.abilities.str
                    presets[2].lfoOnOff = randomInt(0,1)
                    presets[2].lfoSpeed = char.abilities.dex
                    presets[2].lfoType = randomWave()
                }
            },
            {
                num:3,
                name:"Environment",
                waveType: "sine",
                filterAttack: 0,
                pitchAttack: 0,
                decay: 0,
                filterQ: 0,
                lfoOnOff : 0,
                lfoSpeed: 0,
                lfoType : "sine",
                calc: function() {
                    var date = new Date();
                    presets[3].waveType = randomWave();
                    presets[3].filterAttack = date.getHours()/24
                    presets[3].pitchAttack = date.getHours()/24
                    presets[3].decay = date.getHours()/24
                    presets[3].filterQ = date.getHours();
                    presets[3].lfoOnOff = 1;
                    presets[3].lfoSpeed = date.getHours()/24
                    presets[3].lfoType = randomWave()
                }
            }
        ]
        var au = new AudioContext();
        var notesOn = [];
        var preset = presets[1]
        var a = document.getElementById("a")
        var b = document.getElementById("b")
        var c = document.getElementById("c")
        var d = document.getElementById("d")
        var e = document.getElementById("e")
        var f = document.getElementById("f")
        var g = document.getElementById("g")
        var h = document.getElementById("h")
        function show() {
            a.innerHTML = "Wave: " + preset.waveType.capitalize();
            b.innerHTML = "Filter Attack: " + preset.filterAttack.toFixed(1);
            c.innerHTML = "Pitch Attack: " + (preset.pitchAttack * 100).toFixed(1);
            d.innerHTML = "Decay: " + (preset.decay).toFixed(1);
            console.log(preset.decay)
            e.innerHTML = "Filter Q: " + preset.filterQ;
            if (preset.distortionOnOff == 1) {
                f.innerHTML = "Distortion: x" + parseFloat(preset.distortion).toFixed(1)
            }
            if (preset.lfoOnOff == 1) {
                g.innerHTML = "LFO Speed: " + preset.lfoSpeed.toFixed(1) + "Hz";
                h.innerHTML = "LFO Wave: " + preset.lfoType.capitalize()
            }
        }
        preset.calc()
        show()
        console.log("Preset: ", preset)
        var waveType = preset.waveType;
        var filterAttack = preset.filterAttack;
        var pitchAttack = preset.pitchAttack;
        var decay = preset.decay;
        var filterQ = preset.filterQ;
        var lfoOnOff = preset.lfoOnOff
        var lfoSpeed = preset.lfoSpeed;
        var lfoType = preset.lfoType;
        var bend = 0.0;
        var distortion = 1
        if (preset.distortionOnOff == 1) {
            distortion = preset.distortion
        };
        function Voice(note, vel) {
            this.note = note;
            var osc = new OscillatorNode(au)
            var oscGain = new GainNode(au)
            var lfo = new OscillatorNode(au)
            var lfoGain = new GainNode(au)
            var fil = new BiquadFilterNode(au)
            var env = new GainNode(au)
            var freq = midiToFreq(note)
            freq = parseFloat(freq)
            var amount = freq.toFixed(4) * bend.toFixed(4)
            var bent = freq + amount;
            osc.frequency.value = bent - (bent/2)
            osc.frequency.setTargetAtTime(bent, au.currentTime, pitchAttack)
            this.getFreq = function() {
                return [freq, osc.frequency.value];
            }
            this.setFreq = function(newFreq) {
                osc.frequency.setTargetAtTime(newFreq, au.currentTime, 0)
            }
            osc.type = waveType;
            lfo.frequency.value = lfoSpeed;
            lfo.type = lfoType;
            fil.type = "lowpass";
            fil.frequency.value = 0;
            fil.Q.value = filterQ;
            fil.frequency.setTargetAtTime(8000, au.currentTime, filterAttack)
            env.gain.value = vel / 255;
            env.gain.setTargetAtTime(((vel/255)/1.25),au.currentTime,.25)
            lfoGain.gain.value = vel / 255
            oscGain.gain.value = (vel /255) * distortion
            osc.connect(fil);
            fil.connect(oscGain)
            oscGain.connect(env)
            lfo.connect(lfoGain)
            lfoGain.connect(oscGain.gain)
            env.connect(au.destination)
            osc.start()
            if (lfoOnOff == 1) {
                lfo.start()
            }
            this.end = function() {
                env.gain.setTargetAtTime(0, au.currentTime, decay)
                osc.stop(au.currentTime + 4)
                if (lfoOnOff == 1) {
                    lfo.stop(au.currentTime + 4)
                }
            }
        }
        function onMIDIMessage(event) {
            data = event.data;
            switch (data[0]) {
                case 144:
                    if (data[2] > 0) {
                        notesOn.push(new Voice(data[1], data[2]));
                        //console.log(midiToNoteName(data[1]) + " On - V: "+data[2]);
                    }
                    else {
                        for (i=0;i<notesOn.length;i++) {
                            if (notesOn[i].note == data[1]) {
                                notesOn[i].end()
                                notesOn.splice(i, 1)
                                //console.log(midiToNoteName(data[1]) + " Off")
                            }
                        }
                    }
                    break;
                case 176:
                    bend = data[2];
                    bend /= 127;
                    for (i=0;i<notesOn.length;i++) {
                        var thisFreq = midiToFreq(notesOn[i].note)
                        var bendAmount = parseFloat(thisFreq).toFixed(3) * bend.toFixed(3)
                        var newBend = parseFloat(thisFreq) + parseFloat(bendAmount);
                        newBend = parseFloat(newBend).toFixed(3)
                        notesOn[i].setFreq(newBend)
                    };
                    break;
            }
        }
        //Update HTML
        /*var a = document.getElementById("a")
        var b = document.getElementById("b")
        var c = document.getElementById("c")
        var d = document.getElementById("d")
        var e = document.getElementById("e")
        var f = document.getElementById("f")
        var g = document.getElementById("g")
        a.innerHTML = "Oscillator Type: " + waveType.capitalize();
        b.innerHTML = "Filter Attack: " + filterAttack.toFixed(1)
        i.innerHTML = "Pitch Attack: " + pitchAttack.toFixed(3) * 1000;
        c.innerHTML = "Q: " + filterQ;
        d.innerHTML = "Decay: " + decay.toFixed(1)
        e.innerHTML = "Pitch Bend Amount: 0.0"
        if (lfoOnOff == 1) {
            f.innerHTML = "LFO Type: " + lfoType.capitalize()
            g.innerHTML = "LFO Speed: " + lfoSpeed.toFixed(1) + "Hz"
        }*/
        function sendANote(note) {
            var noteOnMessage = [144, note, 99];
            output.send( noteOnMessage );
            output.send( [128, note, 0], window.performance.now() + 50.0 );  
            console.log(noteOnMessage);
        }
    }
    function midiFail() {
        console.log("This browser does not support MIDI devices")
    }
}
openMIDI();