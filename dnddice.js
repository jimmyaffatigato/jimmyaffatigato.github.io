function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function d(num,times) {
    var total;
    for(i=0;i<times;i++){
        total+=randomInt(1,num);
    }
    return total;
}