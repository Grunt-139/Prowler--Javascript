//--- The sprite object

var spriteObject =
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
    tileSize: 64,
    alpha: 1,

    row:0,
    column: 0,


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

    top: function(){
        return this.y;
    },

    bottom: function () {
        return this.y+this.height;
    },
};
