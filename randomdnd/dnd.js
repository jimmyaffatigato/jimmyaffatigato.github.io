var char = {
    name:"",
    class:"",
    race:"",
    abilities:{
        str:0,
        dex:0,
        con:0,
        int:0,
        wis:0,
        cha:0,
        strMod:0,
        dexMod:0,
        conMod:0,
        intMod:0,
        wisMod:0,
        chaMod:0,
    },
    skills:{
        acrobatics:0,
        animalHandling:0,
        arcana:0,
        athletics:0,
        deception:0,
        history:0,
        insight:0,
        intimidation:0,
        investigation:0,
        medicine:0,
        nature:0,
        perception:0,
        performance:0,
        persuasion:0,
        religion:0,
        sleightOfHand:0,
        stealth:0,
        survival:0,
        strThrow:0,
        dexThrow:0,
        conThrow:0,
        intThrow:0,
        wisThrow:0,
        chaThrow:0
    },
    hp:0,
    ac:0,
    miscac:0,
    hitDie:0,
    armor:{name:"",damage:0},
    shield:"",
    equipment:[],
    spells:[],
    setRace:{
        dwarf:function() {
            char.race = "Dwarf";
            char.abilities.str+=1;
            char.abilities.dex+=1;
            char.abilities.con+=1;
            char.abilities.int+=1;
            char.abilities.wis+=1;
            char.abilities.cha+=1;
        },
        elf:function() {
            char.race = "Elf";
            char.abilities.str+=1;
            char.abilities.dex+=1;
            char.abilities.con+=1;
            char.abilities.int+=1;
            char.abilities.wis+=1;
            char.abilities.cha+=1;
        },
        gnome:function() {
            char.race = "Gnome";
            char.abilities.str+=1;
            char.abilities.dex+=1;
            char.abilities.con+=1;
            char.abilities.int+=1;
            char.abilities.wis+=1;
            char.abilities.cha+=1;
        },
        halfElf:function() {
            char.race = "Half Elf";
            char.abilities.str+=1;
            char.abilities.dex+=1;
            char.abilities.con+=1;
            char.abilities.int+=1;
            char.abilities.wis+=1;
            char.abilities.cha+=1;
        },
        halfOrc:function() {
            char.race = "Half Orc";
            char.abilities.str+=1;
            char.abilities.dex+=1;
            char.abilities.con+=1;
            char.abilities.int+=1;
            char.abilities.wis+=1;
            char.abilities.cha+=1;
        },
        human:function() {
            char.race = "Human";
            char.abilities.str+=1;
            char.abilities.dex+=1;
            char.abilities.con+=1;
            char.abilities.int+=1;
            char.abilities.wis+=1;
            char.abilities.cha+=1;
        }
    },
    setClass:{
        barbarian:function() {
            char.class = "Barbarian"
            char.hitDie = 12;
            char.miscac = 1;
        },
        bard:function() {
            char.class = "Bard"
            char.hitDie = 10;
            char.miscac = 1;
        },
        cleric:function() {
            char.class = "Cleric"
            char.hitDie = 10;
            char.miscac = 1;
        },
        druid:function() {
            char.class = "Druid"
            char.hitDie = 10;
            char.miscac = 1;
        },
        monk:function() {
            char.class = "Monk"
            char.hitDie = 10;
            char.miscac = 1;
        },
        paladin:function() {
            char.class = "Paladin"
            char.hitDie = 10;
            char.miscac = 1;
        },
        ranger:function() {
            char.class = "Ranger"
            char.hitDie = 10;
            char.miscac = 1;
        },
        sorcerer:function() {
            char.class = "Sorcerer"
            char.hitDie = 10;
            char.miscac = 1;
        },
        warlock:function() {
            char.class = "Warlock"
            char.hitDie = 10;
            char.miscac = 1;
        },
        wizard:function() {
            char.class = "Wizard"
            char.hitDie = 10;
            char.miscac = 1;
        }
    },
    randomize:function(){
        char.name = randomName() + " " + randomName();
        char.abilities.str = abilityRoll();
        char.abilities.dex = abilityRoll();
        char.abilities.con = abilityRoll();
        char.abilities.int = abilityRoll();
        char.abilities.wis = abilityRoll();
        char.abilities.cha = abilityRoll();
        switch (randomInt(0,9)) {
            case 0:char.setClass.barbarian();break;
            case 1:char.setClass.bard();break;
            case 2:char.setClass.cleric();break;
            case 3:char.setClass.druid();break;
            case 4:char.setClass.monk();break;
            case 5:char.setClass.paladin();break;
            case 6:char.setClass.ranger();break;
            case 7:char.setClass.sorcerer();break;
            case 8:char.setClass.warlock();break;
            case 9:char.setClass.wizard();break;
        }
        switch (randomInt(0,5)) {
            case 0:char.setRace.dwarf();break;
            case 1:char.setRace.elf();break;
            case 2:char.setRace.gnome();break;
            case 3:char.setRace.halfElf();break;
            case 4:char.setRace.halfOrc();break;
            case 5:char.setRace.human();break;
        }
        char.armor = new RandomArmor();
        char.weapon = new RandomWeapon();
        char.spells = spellLevel(randomInt(0,9), char.class)
    },
    calc:function(){
        char.abilities.strMod = mod(char.abilities.str)
        char.abilities.dexMod = mod(char.abilities.dex)
        char.abilities.conMod = mod(char.abilities.con)
        char.abilities.intMod = mod(char.abilities.int)
        char.abilities.wisMod = mod(char.abilities.wis)
        char.abilities.chaMod = mod(char.abilities.cha)
        char.hp = char.hitDie + char.abilities.conMod;
        char.ac = char.abilities.dexMod + char.armor.damage + char.miscac;
    }
}

function abilityRoll() {
    var roll = 0;
    var dice = [d(6),d(6),d(6),d(6)];dice.sort();dice.splice(0,1);
    for (var i in dice) {roll+=dice[i]}
    return roll;
}

function mod(att) {
    var out = (((att - 10) - (att % 2)) / 2)
    return out
}

function RandomWeapon() {
    weapo = weapons[randomInt(0,weapons.length-1)]
    this.name = weapo.name + " of " + randomName()+randomWord();
    this.damage = weapo.damage;
}

function RandomArmor() {
    armo = armors[randomInt(0,armors.length-1)]
    this.name = armo.type + " of " + randomName()+randomWord();
    this.damage = armo.arm
}

function RandomShield() {
    this.name = shield()+" of "+randomName()+randomWord();
    this.arm = randomInt(11,20)
}

function randomClass() {
    return classes[randomInt(0,classes.length-1)]
}
function randomRace() {
    return races[randomInt(0,races.length-1)]
}
var sillyRaces = ["Big Elf","Snorque","Squatter","Balloon Man","Slime Girl","Duck","Canky"]
