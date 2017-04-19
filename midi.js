var notesOn = [];
function openMIDI() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false
        }).then(midiContext);
    }
    function midiContext(MIDIAccess) {
        midi = MIDIAccess;
        inputs = []
        var input;
        if (midi.inputs.size > 0) {
            for (h=0;h<9;h++){
                if (midi.inputs.get(h) != undefined) {
                    var tex = document.createTextNode(midi.inputs.get(h).name)
                    var opt = document.createElement("OPTION")
                    opt.setAttribute("value",h)
                    opt.appendChild(tex)
                    devices.appendChild(opt)
                }
            }
            input = midi.inputs.get(devices.value)
            input.onmidimessage = onMIDIMessage;
        }
        else {
            var tex = document.createTextNode("No Device")
            var opt = document.createElement("OPTION")
            opt.appendChild(tex);
            devices.appendChild(opt)
        }
        }
        function onMIDIMessage(event) {
            data = event.data;
            switch (data[0]) {
                case 144:
                    //Note On
                    if (data[2] > 0){
                        var newVoice = new Voice(data[1], data[2]);
                        notesOn.push(newVoice);
                        newVoice.go()
                    }
                    //Note Off
                    else {
                        for(notes=0;notes<notesOn.length;notes++){
                            if(notesOn[notes].note==data[1]){
                                notesOn[notes].bye()
                                notesOn[notes].osc.onended = notesOn.splice(notes,1)
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
                                    notesOn[notes].osc.frequency.setTargetAtTime(notesOn[notes].freq * (bend + 1), au.currentTime, 0)
                                }
                                break;
                            case "speed":
                                speedMult = data[2]/64
                                for (notes=0;notes<notesOn.length;notes++) {
                                    notesOn[notes].lfo.frequency.setTargetAtTime(pre.lfoSpeed * speedMult, au.currentTime, 0)
                                }
                                break;
                            break;
                            case "depth":
                                depthMult = data[2]/64
                                for (notes=0;notes<notesOn.length;notes++) {
                                    notesOn[notes].lfoGain.gain.setTargetAtTime(pre.lfoDepth * depthMult, au.currentTime, 0)
                                }
                                break;
                            case "vol":
                                volControl = data[2]/127
                            case "fil":break;
                        }
                    }
                    //Volume Knob
                    if (data[1] == 7) {
                        volControl = data[2]/127
                    }
                    break;
            }
        }
    }
openMIDI();

