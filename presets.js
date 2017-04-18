//Array of preset objects

var presets = [
    {
        num:0,
        name:"pre One",
        oscType: "square",
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
        oscType: randomWave(),
        port: randomInt(0,1),
        pitchAttackType: "high",
        p: {a:[0,(Math.random()*0.1).toFixed(3)]},
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
        lfo1Speed: Math.random().toFixed(3) * 10,
        lfo1Depth: Math.random().toFixed(3),
        lfo1Type: randomWave(),
        lfoMode:"fil",
        modWheel: "depth",
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
    }
]
presets[1].randomize()



