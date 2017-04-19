//HTML Stuff

//Element Definitions
var leftBox = document.getElementById("leftBox"),
rightBox = document.getElementById("rightBox"),
scopeBox = document.getElementById("scopeBox"),
pAT = document.getElementById("pAT"),
fAT = document.getElementById("fAT"),
fDT = document.getElementById("fDT"),
fST = document.getElementById("fST"),
fRT = document.getElementById("fRT"),
fAV = document.getElementById("fAV"),
fDV = document.getElementById("fDV"),
fSV = document.getElementById("fSV"),
fRV = document.getElementById("fRV"),
fQ = document.getElementById("fQ"),
vAT = document.getElementById("vAT"),
vDT = document.getElementById("vDT"),
vST = document.getElementById("vST"),
vRT = document.getElementById("vRT"),
vAV = document.getElementById("vAV"),
vDV = document.getElementById("vDV"),
vSV = document.getElementById("vSV"),
vRV = document.getElementById("vRV"),
lfoOnOff = document.getElementById("lfoOnOff"),
lfoMode = document.getElementById("lfoMode"),
lfoType = document.getElementById("lfoType"),
lfoSpeed = document.getElementById("lfoSpeed"),
lfoDepth = document.getElementById("lfoDepth"),
modWheel = document.getElementById("modWheel"),
devices = document.getElementById("devices"),
settings = document.getElementById("settings");

//Update HTML
function show() {
    oscType.value = pre.oscType;
    pAT.value = parseFloat(pre.p.a[1])+"s";
    pitchAttackType.value = pre.pitchAttackType;
    fAT.value = parseFloat(pre.f.a[1])+"s";fAV.value = parseFloat(pre.f.a[0]).toFixed(0) + " Hz";
    fDT.value = parseFloat(pre.f.d[1])+"s";fDV.value = parseFloat(pre.f.d[0]).toFixed(0) + " Hz";
    fST.value = parseFloat(pre.f.s[1])+"s";fSV.value = parseFloat(pre.f.s[0]).toFixed(0) + " Hz";
    fRT.value = parseFloat(pre.f.r[1])+"s";fRV.value = parseFloat(pre.f.r[0]).toFixed(0) + " Hz";
    fQ.value = pre.fQ;
    vAT.value = parseFloat(pre.v.a[1])+"s";vAV.value = parseFloat(pre.v.a[0]).toFixed(1) + "x";
    vDT.value = parseFloat(pre.v.d[1])+"s";vDV.value = parseFloat(pre.v.d[0]).toFixed(1) + "x";
    vST.value = parseFloat(pre.v.s[1])+"s";vSV.value = parseFloat(pre.v.s[0]).toFixed(1) + "x";
    vRT.value = parseFloat(pre.v.r[1])+"s";vRV.value = parseFloat(pre.v.r[0]).toFixed(1) + "x";
    lfoOnOff.checked = pre.lfoOnOff;
    lfoType.value = pre.lfoType;
    lfoMode.value = pre.lfoMode;
    lfoSpeed.value = pre.lfoSpeed.toFixed(3) + " Hz";
    lfoDepth.value = parseFloat(pre.lfoDepth)+ "x";
    settings.value = JSON.stringify(pre);
}
function changeValues() {
    pre.oscType = oscType.value;
    pre.pitchAttackType = pitchAttackType.value;
    pre.p.a[1] = parseFloat(pAT.value);
    pre.f.a[1] = parseFloat(fAT.value);pre.f.a[0] = parseFloat(fAV.value);
    pre.f.d[1] = parseFloat(fDT.value);pre.f.d[0] = parseFloat(fDV.value);
    pre.f.s[1] = parseFloat(fST.value);pre.f.s[0] = parseFloat(fSV.value);
    pre.f.r[1] = parseFloat(fRT.value);pre.f.r[0] = parseFloat(fRV.value);
    pre.fQ = parseInt(fQ.value);
    pre.v.a[1] = parseFloat(vAT.value);pre.v.a[0] = parseFloat(vAV.value);
    pre.v.d[1] = parseFloat(vDT.value);pre.v.d[0] = parseFloat(vDV.value);
    pre.v.s[1] = parseFloat(vST.value);pre.v.s[0] = parseFloat(vSV.value);
    pre.v.r[1] = parseFloat(vRT.value);pre.v.r[0] = parseFloat(vRV.value);
    if (lfoOnOff.checked == true) {
        pre.lfoOnOff = 1;
    }
    else {
        pre.lfoOnOff = 0;
    }
    pre.lfoMode = lfoMode.value;
    pre.lfoType = lfoType.value;
    pre.lfoSpeed = parseFloat(lfoSpeed.value);
    pre.lfoDepth = parseFloat(lfoDepth.value);
    pre.modWheel = modWheel.value;
    show();
}
show();
changeValues();
document.body.style.backgroundColor = randomColor();
leftBox.style.backgroundColor = randomColor();
leftBox.style.height = window.innerHeight - (window.innerWidth / 100) * 2;
rightBox.style.height = window.innerHeight - (window.innerWidth / 100) * 2;
rightBox.style.backgroundColor = leftBox.style.backgroundColor;
scopeBox.width = window.innerWidth / 2;
scopeBox.height = window.innerHeight;
var scopeContext = scopeBox.getContext("2d");
scope.fftSize = 2048;
var bufferLength = 1024;
var dataArray = new Uint8Array(bufferLength);
scope.getByteTimeDomainData(dataArray);
function draw() {
  scope.getByteTimeDomainData(dataArray);
  scopeContext.fillStyle = document.body.style.backgroundColor;
  scopeContext.fillRect(0, 0, scopeBox.width, scopeBox.height);
  scopeContext.lineWidth = 10;
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
setInterval(function(){draw()},100);