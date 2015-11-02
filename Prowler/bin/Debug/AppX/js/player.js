//--- The player object

var playerObject =
{
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 64,
    sourceHeight: 64,
    width: 64,
    height: 64,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    visible: true,
    scrollable: true,
    direction: 1,
    MAX_SPEED:2,
    speed: 0,
    tileSize: 64,
    alpha: 1,
    
    spread: 1,

    //Combat Items
    damage: 10,
    health: 10,
    maxHealth: 10,

    //Stats
    armour: false,
    chemicalSuit: false,
    winterSuit: false,
    medKits: 0,
    maxMedKits: 2,
    food: 0,
    score: 0,
    money: 0,
    commonRelics: 0,
    uncommonRelics: 0,
    rareRelics: 0,
    starveDmg:1,
    hungerDmg: 1,
    freezeDmg: 1,
    chemDmg: 1,

    //For the defenses they work essentially backwards
    //At default they block 10% of damage by multiplying the damage by 90% of that value 
    //example 100 pts of damage 100 * 0.9 = 90 pts, versus 100 *0.1=10 pts of damage
    winterSuitDefense: 90,
    chemicalSuitDefense: 90,
    armourDefense: 90,

    //Upgrade Levels
    winterUpgradeLevel: 0,
    chemUpgradeLevel: 0,
    armourUpgradeLevel: 0,
    gunUpgradeLevel: 0,

    hunger: 100,
    cold: 100,
    maxHunger: 100,
    maxCold: 100,

    row: 0,
    column: 0,

    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3,
    ANGLE_45: 4,
    ANGLE_135: 5,
    ANGLE_225: 6,
    ANGLE_270: 7,

    //Tile id
    id:0,

    //Getters

    getId: function () {
        return this.id;
    },
    centerX: function () {
        return this.x + (this.width / 2);
    },
    centerY: function () {
        return this.y + (this.height / 2);
    },
    halfWidth: function () {
        return this.width / 2;
    },
    halfHeight: function () {
        return this.height / 2;
    },

    getRow: function () {
        this.row = Math.floor(this.centerX() / this.tileSize);
        return this.row;

    },

    getColumn: function () {
        this.column = Math.floor(this.centerY() / this.tileSize);
        return this.column;
    },

    right: function () {
        return (this.x + this.width);
    },

    left: function () {
        return this.x;
    },

    top: function () {
        return this.y;
    },

    bottom: function () {
        return this.y + this.height;
    },

    getSpread: function () {
        
        if (this.hunger < 50) {
            return ((-this.spread * 1.1) + Math.random() * (this.spread * 1.1 + this.spread * 1.1));
        }
        else if (this.hunger < 75) {
            return (-this.spread + Math.random() * (this.spread + this.spread));
        }
        else {
            return ((-this.spread * .25) + Math.random() * (this.spread * .25 + this.spread * .25));
        };
    },

    relicsCollected: function () {
        return (this.commonRelics + this.uncommonRelics + this.rareRelics);
    },

    takeDamage: function (damage) {
        if (this.armour) {
           damage *= (this.armourDefense * 0.01);
        };

        this.health -= Math.floor(damage);
        if (this.health < 0) {
            this.health = 0;
        };
    },

    heal: function (healAmount) {
        this.health += healAmount;

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        };

        this.health = Math.ceil(this.health);
    },

    eat: function (food){
        this.hunger += food;

        if (this.hunger > this.maxHunger) {
            this.hunger = this.maxHunger;
        };

        this.hunger = Math.ceil(this.hunger);
    },

    getMaxSpeed: function(){
        return (this.MAX_SPEED);
    },

    getHealth: function () {
        return this.health;
    },

    getMaxHealth: function () {
        return this.maxHealth;
    },

    getHunger:function(){
        return this.hunger;
    },

    getMaxHunger:function(){
        return this.maxHunger;
    },
    getCold: function(){
        return this.cold;
    },

    getMaxCold: function () {
       return this.maxCold;
    },
    freeze: function () {
        if (this.winterSuit) {
            this.freezeDmg *= (this.winterSuitDefense * 0.01);
        };

        //Stages of freezing
        //Below 75 -> slow down
        //Below 60 -> slow down more
        //Below 30 -> pain

        this.cold -= this.freezeDmg;
        if (this.cold < 0) {
            this.cold = 0;
        };

        if (this.cold < 75 && this.speed != this.MAX_SPEED*0.75) {
            this.speed *=0.75;
        }   
        else if (this.cold < 60 && this.speed != this.MAX_SPEED*0.5) {
            this.speed *= 0.5;
        }
        else if (this.cold < 30) {
            this.takeDamage(this.freezeDmg);
        };

        if (this.speed <= 0) {
            this.speed = 1;
        };
    },

    warm: function () {
        //Congrats you're warming up

        this.cold += this.freezeDmg;
        if (this.cold > this.maxCold) {
            this.cold = this.maxCold;
        };

        if (this.cold > 60 && this.speed != this.MAX_SPEED * 0.75) {
            this.speed = this.MAX_SPEED * 0.75;
        }
        else if (this.cold > 75 && this.speed != this.MAX_SPEED) {
            this.speed = this.MAX_SPEED;
        };
        

        if (this.speed >= this.MAX_SPEED) {
            this.speed = this.MAX_SPEED;
        };
    },

    starve: function () {
        this.hunger -= this.hungerDmg;
        //Below 75 -> spread happens
        //Below 50 -> increased spread
        //Below 25 -> lose health

        if (this.hunger < 0) {
            this.hunger = 0;
        };
        if (this.hunger < 25) {
            this.takeDamage(this.hungerDmg);
       };
    },

    chemicalBurn: function () {
        if (this.chemicalSuit) {
            this.chemDmg *= (this.chemicalSuitDefense * 0.01);
        };
        this.takeDamage(this.chemDmg);
    },

    getDirection: function () {
        return this.direction;
    },
};
