function RandomArmor() {
    this.name = armor()+" of "+randomName()+randomWord();
    this.arm = randomInt(11,20)
}
function RandomShield() {
    this.name = shield()+" of "+randomName()+randomWord();
    this.arm = randomInt(11,20)
}
function randomWeapon() {
    return weapons[randomInt(0,weapons.length-1)]
}
function randomClass() {
    return classes[randomInt(0,classes.length-1)]
}
function randomRace() {
    return races[randomInt(0,races.length-1)]
}
var sillyRaces = ["Big Elf","Snorque","Squatter","Balloon Man","Slime Girl","Duck","Canky"]
