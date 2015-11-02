//--- The sprite object

var enemyObject =
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
    speed: 1.5,
    tileSize: 64,
    mapTileSize: 64,
    alpha: 1,

    //Combat stats
    damage: 2,
    health: 10,
    maxHealth: 10,
    isAttacking: false,
    canAttack: true,

    attackCoolDown: 2000,
    attackTimer: 0,

    wanderTime: 2000,

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

    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,

    //Movement and AI things
    validDirections: [],
    sightLine: 256,


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
        this.row = Math.floor(this.centerY() / this.mapTileSize);
        return this.row;

    },

    getColumn: function () {
        this.column = Math.floor(this.centerX() / this.mapTileSize);
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

    canHit: function () {
        return this.collidable;
    },


    takeDamage: function (damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        };
    },

    heal: function (heal) {
        this.health += heal;
    },

    getHealth: function () {
        return this.health;
    },

    getMaxHealth: function () {
        return this.maxHealth;
    },

    setMaxHealth: function (value) {
        this.maxHealth = value;
    },

    //Updates the vx and vy and their image
    update:function(){
        //Down
        if (this.moveDown && !this.moveUp) {
            this.direction = 0;
        }
        //Up
        if (this.moveUp && !this.moveDown) {
            this.direction = 1;
        }
        //Left
        if (this.moveLeft && !this.moveRight) {
            this.direction = 2;
        }
        //Right
        if (this.moveRight && !this.moveLeft) {
            this.direction = 3;
        }
        //45
        if (this.moveUp && this.moveRight) {
            this.direction = 4;
        };
        //270
        if (this.moveUp && this.moveLeft) {
            this.direction = 7;
        };
        //135
        if (this.moveDown && this.moveRight) {
            this.direction = 5;
        };
        //225
        if (this.moveDown && this.moveLeft) {
            this.direction = 6;
        };

        this.sourceX = this.direction * this.tileSize;
        /*Directions
DOWN: 0,
UP: 1,
LEFT: 2,
RIGHT: 3,
ANGLE_45: 4,
ANGLE_135: 5,
ANGLE_225: 6,
ANGLE_270: 7, */
        //Set Vx and Vy
        switch (this.direction) {
            case 0: //down
                this.vx = 0;
                this.vy = this.speed;
                break;
            case 1: //up
                this.vx = 0;
                this.vy = -this.speed;
                break;
            case 2: //left
                this.vx = -this.speed;
                this.vy = 0;
                break;
            case 3: //right
                this.vx = this.speed;
                this.vy = 0;
                break;
            case 4: //45
                this.vx = this.speed;
                this.vy = -this.speed;
                break;
            case 5: //135
                this.vx = this.speed;
                this.vy = this.speed;
                break;
            case 6: //225
                this.vx = -this.speed;
                this.vy = this.speed;
                break;
            case 7: //270
                this.vx = -this.speed;
                this.vy = -this.speed;
                break;

        };
    },

    findNewDirection: function (platform, empty, size,ROWS,COLUMNS) {

       //Look around and see what directions are valid
        var row = this.getRow();
        var column = this.getColumn();
        ROWS--;
        COLUMNS--;

        //Up
        if (row >0) {
            if (platform[row - 1][column] == empty) {
                this.validDirections.push(this.UP);
            };
        };
        //Down
        if (row < ROWS) {
            if (platform[row + 1][column] == empty) {
                this.validDirections.push(this.DOWN);
            };
        };
        //Left
        if (column > 0) {
            if (platform[row][column - 1] == empty) {
                this.validDirections.push(this.LEFT);
            };
        };

        //Right
        if (column < COLUMNS) {
            if (platform[row][column + 1] == empty) {
                this.validDirections.push(this.RIGHT);
            };
        }
        //45
        if (column < COLUMNS && row >0) {
            if (platform[row - 1][column + 1] == empty) {
                this.validDirections.push(this.ANGLE_45);
            };
        };
        //135
        if (column < COLUMNS && row < ROWS) {
            if (platform[row + 1][column + 1] == empty) {
                this.validDirections.push(this.ANGLE_135);
            };
        };
        //225
        if (column > 0 && row < ROWS) {
            if (platform[row + 1][column - 1] == empty) {
                this.validDirections.push(this.ANGLE_225);
            };
        };

        //270
        if (column > 0 && row > 0) {
            if (platform[row - 1][column - 1] == empty) {
                this.validDirections.push(this.ANGLE_270);
            };
        }; 

        //Get random direction
        var i = Math.floor(Math.random() * (this.validDirections.length - 1));
        this.direction = this.validDirections[i];

    },

    reverseDirection: function () {
        //Set Vx and Vy
        switch (this.direction) {
            case 0: //down
                this.moveDown = false;
                this.moveUp = true;
                this.moveLeft = false;
                this.moveRight = false;
                break;
            case 1: //up
                this.moveDown = true;
                this.moveUp = false;
                this.moveLeft = false;
                this.moveRight = false;
                break;
            case 2: //left
                this.moveDown = false;
                this.moveUp = false;
                this.moveLeft = false;
                this.moveRight = true;
                break;
            case 3: //right
                this.moveDown = false;
                this.moveUp = false;
                this.moveLeft = true;
                this.moveRight = false;
                break;
            case 4: //45
                this.moveDown = true;
                this.moveUp = false;
                this.moveLeft = true;
                this.moveRight = false;
                break;
            case 5: //135
                this.moveDown = false;
                this.moveUp = true;
                this.moveLeft = true;
                this.moveRight = false;
                break;
            case 6: //225
                this.moveDown = false;
                this.moveUp = true;
                this.moveLeft = false;
                this.moveRight = true;
                break;
            case 7: //270
                this.moveDown = true;
                this.moveUp = false;
                this.moveLeft = false;
                this.moveRight = true;
                break;
        };
    },

    huntPlayer: function (sprites, size, player) {
        if (this.canAttack) {
            //Vector Components
            var vx = player.centerX() - this.centerX();
            var vy = player.centerY() - this.centerY();

            var magnitude = Math.sqrt((vx * vx) + (vy * vy));

            if (magnitude < this.sightLine) {
                var dx = vx / magnitude;
                var dy = vy / magnitude;

                var pointX = this.centerX();
                var pointY = this.centerY();

                var segment = size * 0.25;
                var numPoints = Math.floor(magnitude / segment);
                var counter = 0;

                //Can he see the player?
                while (counter++ != numPoints) {

                    var vectorLength = segment * counter
                    pointX += Math.floor(dx * vectorLength);
                    pointY += Math.floor(dy * vectorLength);
                    for (var i = 0; i < sprites.length; i++) {
                        if (hitTestPoint(pointX, pointY, sprites[i])) {
                            return;
                        };
                    };
                };

                //If vx is larger then vy then he needs to move either left or right
                if (Math.abs(vx) >= Math.abs(vy)) {
                    if (vx <= 0) {
                        this.moveLeft = true;
                        //Make the moveRight false
                        this.moveRight = false;
                    }
                    else {
                        this.moveRight = true;
                        //Make the moveLeft false
                        this.moveLeft = false;
                    };
                }
                    //Other wise up or down
                else {
                    if (vy <= 0) {
                        this.moveUp = true;
                        //Make the moveDown variable false so the enemy will still move
                        this.moveDown = false;
                    }
                    else {
                        //Move down
                        this.moveDown = true;
                        //Make the moveUp variable false so the enemy still does something
                        this.moveUp = false;
                    };
                };

                if (Math.abs(vy - vx) > size * 0.25 && Math.abs(vx) > Math.abs(vy)) {
                    this.moveDown = false;
                    this.moveUp = false;
                };

                if (Math.abs(vy - vx) > size * 0.25 && Math.abs(vx) < Math.abs(vy)) {
                    this.moveRight = false;
                    this.moveLeft = false;
                };

            };
        };
    },

    attack: function (player) {
        if (this.canAttack) {
            this.canAttack = false;
            this.vy = 0;
            this.vx = 0;
            player.takeDamage(this.damage);
            this.isAttacking = true;
            var that = this;
            setTimeout(function () { that.attackReset()
            }, that.attackCoolDown );
        };
    },

    attackReset: function () {
        this.canAttack = true;
    },

    getDirection: function () {
        return this.direction;
    },

    randomDirection: function () {
        // direction = Math.floor(3 + Math.random * (3 - 0) + 1);
        this.direction = Math.floor(Math.random() * 7);

        this.wanderTime = Math.floor(1000 + (Math.random() * (8000 - 1000)) +1 );

        var that = this;
        setTimeout(function () {
            that.randomDirection()
        }, that.wanderTime); 
    },

    isDead: function () {
        return (this.health <= 0);
    }
};
