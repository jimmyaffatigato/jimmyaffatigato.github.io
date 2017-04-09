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
        var notesOn = [];
        var au = new AudioContext();
        function randomWave() {
            switch (randomInt(0,3)) {
                case 0: return "sawtooth";break;
                case 1: return "sine";break;
                case 2: return "square";break;
                case 3: return "triangle";break
            }
        }
        var bend = 0;
        var lfoSpeed = Math.random() * randomInt(1, 10);
        var waveType = randomWave();
        var lfoType = randomWave()
        var tail = Math.random() * Math.random()
        var LFOOnOff;
        switch (randomInt(0,1)) {
            case 0: lfo1OnOff = false;break;
            case 1: lfo1OnOff = true;break;
        }
        var filter = randomInt(1,25)
        var attack = Math.random()
        var a = document.getElementById("a")
        var b = document.getElementById("b")
        var c = document.getElementById("c")
        var d = document.getElementById("d")
        var e = document.getElementById("e")
        var f = document.getElementById("f")
        var g = document.getElementById("g")
        a.innerHTML = "Oscillator Type: " + waveType.capitalize();
        b.innerHTML = "Filter Attack: " + attack.toFixed(1)
        c.innerHTML = "Q: " + filter;
        d.innerHTML = "Decay: " + tail.toFixed(1)
        e.innerHTML = "Pitch Bend Amount: 0.0"
        var lfoPercent = 0
        var lfoAmount = 0;
        switch (randomInt(0,1)) {
            case 0: lfoAmount = 1 ;lfoPercent = 100;break;
            case 1: lfoAmount = 0 ;lfoPercent = 50;break;
        }
        if (lfo1OnOff == true) {
            f.innerHTML = "LFO Type: " + lfoType.capitalize()
            g.innerHTML = "LFO Speed: " + lfoSpeed.toFixed(1) + "Hz"
            h.innerHTML = "LFO Amount: " + lfoPercent +"%"
        }
        function Voice(note, vel) {
            var voice = this
            this.note = note;
            var osc = new OscillatorNode(au)
            var lfo1 = new OscillatorNode(au)
            var fil1 = new BiquadFilterNode(au)
            var lfoFil = new BiquadFilterNode(au)
            var freq = midiToFreq(note)
            freq = parseInt(freq)
            var amount = freq.toFixed(1) * bend.toFixed(1)
            var bent = freq + amount;
            osc.frequency.value = bent
            this.getFreq = function() {
                return freq;
            }
            this.setFreq = function(newFreq) {
                osc.frequency.value = newFreq
            }
            osc.type = waveType;
            lfo1.frequency.value = lfoSpeed;
            lfo1.type = lfoType;
            lfoFil.frequency.value = 2000;
            fil1.type = "lowpass";
            fil1.frequency.value = 0;
            fil1.Q.value = filter;
            fil1.frequency.setTargetAtTime(8000, au.currentTime, attack)
            var env = new GainNode(au)
            var lfo1Gain = new GainNode(au)
            var oscGain = new GainNode(au)
            env.gain.value = vel / 255;
            env.gain.setTargetAtTime(((vel/255)/1.25),au.currentTime,.25)
            lfo1Gain.gain.value = (vel / 255) / 2 + lfoAmount
            oscGain.gain.value = vel /255
            osc.connect(fil1);
            fil1.connect(oscGain)
            oscGain.connect(env)
            lfo1.connect(lfoFil)
            lfoFil.connect(lfo1Gain)
            lfo1Gain.connect(oscGain.gain)
            env.connect(au.destination)
            osc.start()
            if (lfo1OnOff == true) {
                lfo1.start()
            }
            this.end = function() {
                env.gain.setTargetAtTime(0, au.currentTime, tail)
                osc.stop(au.currentTime + 4)
                if (lfo1OnOff == true) {
                    lfo1.stop(au.currentTime + 4)
                }
            }
        }
        function onMIDIMessage(event) {
            data = event.data;
            switch (data[0]) {
                case 144:
                    if (data[2] > 0) {
                        notesOn.push(new Voice(data[1], data[2]));
                        console.log(midiToNoteName(data[1]) + " On - V: "+data[2]);
                    }
                    else {
                        for (i=0;i<notesOn.length;i++) {
                            if (notesOn[i].note == data[1]) {
                                notesOn[i].end()
                                notesOn.splice(i, 1)
                                console.log(midiToNoteName(data[1]) + " Off")
                            }
                        }
                    }
                    break;
                case 176:
                    bend = data[2];
                    bend /= 127;
                    e.innerHTML = "Pitch Bend Amount: " + bend.toFixed(1);
                    for (i=0;i<notesOn.length;i++) {
                        var thisFreq = notesOn[i].getFreq()
                        thisFreq = parseInt(thisFreq)
                        var amount = thisFreq.toFixed(1) * bend.toFixed(3)
                        var bent = thisFreq + amount;
                        notesOn[i].setFreq(bent)
                    };
                    break;
            }
        }
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