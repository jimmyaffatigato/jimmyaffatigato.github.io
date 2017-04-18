//HTML Stuff


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
    oscType.value = pre.oscType;
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
    //LFO Speed
    lfoSpeed.value = pre.lfo1Speed.toFixed(3) + " Hz";
    //LFO Depth
    lfoDepth.value = parseFloat(pre.lfo1Depth)+ "x"
    //Turn preset object into string and print to text box
    settings.value = JSON.stringify(pre);
}
function changeValues() {
    pre.oscType = oscType.value;
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

    //LFO Speed
    pre.lfo1Speed = parseFloat(lfoSpeed.value);

    //LFO Depth
    pre.lfo1Depth = parseFloat(lfoDepth.value) / depthMult;

    //Mod Wheel Assign
    pre.modWheel = modWheel.value;

    show()
}
show()
changeValues()

document.body.style.backgroundColor = randomColor();
leftBox.style.backgroundColor = randomColor();
rightBox.style.backgroundColor = leftBox.style.backgroundColor;

var scopeBox = document.getElementById("scopeBox");
var scopeContext = scopeBox.getContext("2d");



scope.fftSize = 2048;
var bufferLength = 1024;
console.log(bufferLength);

var dataArray = new Uint8Array(bufferLength);
scope.getByteTimeDomainData(dataArray);


function draw() {

  //drawVisual = requestAnimationFrame(draw);

  scope.getByteTimeDomainData(dataArray);

  scopeContext.fillStyle = document.body.style.backgroundColor;
  scopeContext.fillRect(0, 0, scopeBox.width, scopeBox.height);

  scopeContext.lineWidth = 2;
  scopeContext.strokeStyle = leftBox.style.backgroundColor;

  scopeContext.beginPath();

  var sliceWidth = scopeBox.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * scopeBox.height / 2;

    if (i === 0) {
      scopeContext.moveTo(x, y);
    } else {
      scopeContext.lineTo(x, y);
    }

    x += sliceWidth;
  }

  scopeContext.lineTo(scopeBox.width, scopeBox.height / 2);
  scopeContext.stroke();
};

var goop = setInterval(function(){draw()},60)

/*
scope.fftSize = 256;
var bufferLength = scope.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Float32Array(bufferLength);

scopeContext.clearRect(0, 0, scopeBox.width, scopeBox.height);

function draw() {
  drawVisual = requestAnimationFrame(draw);
  scope.getFloatFrequencyData(dataArray);
  scopeContext.fillStyle = 'rgb(0, 0, 0)';
  scopeContext.fillRect(0, 0, scopeBox.width, scopeBox.height);
  
  var barWidth = (scopeBox.width / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] + 140)*2;
    scopeContext.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
    scopeContext.fillRect(x,scopeBox.height-barHeight/2,barWidth,barHeight/2);
    x += barWidth + 1;
  }
};

draw();*/