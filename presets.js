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
        pitchAttackType: "high",
        p: {
            a:[0,(Math.random()*0.1).toFixed(3)],
            d:[0,0],
            s:[0,0],
            r:[0,.5]},
        f: {
            a:[randomInt(0,10000),(Math.random()*0.25).toFixed(3)],
            d:[randomInt(0,10000),(Math.random()*0.25).toFixed(3)],
            s:[randomInt(0,10000),(Math.random()).toFixed(3)],
            r:[randomInt(0,10000),(Math.random()*0.25).toFixed(3)]},
        v: {
            a:[Math.random().toFixed(3),(Math.random()*0.25).toFixed(3)],
            d:[Math.random().toFixed(3),(Math.random()*0.25).toFixed(3)],
            s:[Math.random().toFixed(3),Math.random().toFixed(3)],
            r:[0,(Math.random()*0.25).toFixed(3)]},
        fQ: randomInt(1,25),
        lfo1OnOff: randomInt(0,1),
        lfo1Speed: Math.random(),
        lfo1Depth: Math.random().toFixed(3),
        lfo1Type: randomWave(),
        lfoMode:"fil",
        modWheel: "pitch",
        bendWheel: "pitch",
        volControl: 1,
        randomize: function() {
            switch (randomInt(0,2)) {
                case 0:
                    this.lfoMode = "vol"
                    break;
                case 1:
                    this.lfoMode = "fil"
                    break;
                case 2:
                    this.lfoMode = "pan"
                    break;
            }
            switch (randomInt(1,2)) {
                case 0:
                    this.pitchAttackType = "high"
                    break;
                case 1:
                    this.pitchAttackType = "low"
                    break;
                case 2:
                    this.pitchAttackType = "port"
                    break;
            }
        }
    },
    {"num":1,"name":"Random","osc1Type":"sawtooth","port":0,"pitchAttackType":"port","p":{"a":[0,0.028024468963444706],"d":[0,0],"s":[0,0],"r":[0,0.5]},"f":{"a":[5031,0.16912524561938808],"d":[434,0.1021423212863406],"s":[2345,0.23428602239464835],"r":[8462,0.054624129739140714]},"v":{"a":[0.7222857042192792,0.12409740833805183],"d":[0.017285436565058987,0.009865208580406404],"s":[0.13553045633320449,0.07854280392443291],"r":[0,0.002985889174445755]},"fQ":18,"lfo1OnOff":0,"lfo1Speed":{"hz":0.004187165345215904,"bpm":0},"lfo1Depth":0.20055897451762972,"lfo1Type":"sine","lfoMode":"vol","modWheel":"pitch","bendWheel":"pitch","volControl":1}
]
presets[1].randomize()



