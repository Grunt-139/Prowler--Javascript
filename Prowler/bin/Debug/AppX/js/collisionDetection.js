//Yay hit detection at 1 am

function platformCollision(platformMap, size, platform, object) {

    var overLapX;
    var overLapY;

   console.log("Top: " + object.top() + "\nBottom: " + object.bottom() + "\nLeft: " + object.left() + "\nRight: " + object.right());

    //If the object's top left corner is overlapping the tile
    //on its upper left side...
    if (platformMap[object.top()][object.left()] == platform) {
        //Figure out by how much the object's top left corner
        //point is overlapping the tile on both the x and y
        //axes. 
        overlapX = object.x % size;
        overlapY = object.y % size;

        if (overlapY >= overlapX) {
            if (object.vy < 0
                && platformMap[object.bottom()][object.left()]
                != platform) {
                //Collision on top side of the object
                //Position the object to the bottom 
                //edge of the platform tile
                //which it is overlapping and set its vy to zero
             //   object.y = (object.getRow() * size);
                object.vy = 0;
            };

        }
        else {
            //Collision on left side of the object
            //Position the object to the right 
            //edge of the platform tile and set its vx to zero
         //   object.x= object.getColumn() * size;
            object.vx = 0;
        };
    };

    //If the object's bottom left corner is overlapping the tile
    //on its lower left side...
    if (platformMap[object.bottom()][object.left()] == platform) {
        overlapX = object.x % size;

        //Measure the y overlap from far left side of the tile
        //and compensate for the object's height
        overlapY= size - ((object.y + object.height) % size);

        if (overlapY >= overlapX) {
            if (object.vy > 0
                && platformMap[object.top()][object.left()]
                != platform) {
                //Collision on bottom
               // object.y= (object.getRow() * size)+ (size - object.height);
                object.vy = 0;
            };
        }
        else {
            //Collision on left
         //   object.x= object.getColumn() * size;
            	object.vx = 0;
        };
    };

    //If the object's bottom right corner is overlapping the tile
    //on its lower right side...
    if (platformMap[object.bottom()][object.right()]
        == platform) {
        //Measure the x and y overlap from the far right and bottom
        //side of the tile and compensate for the object's
        //height and width
        overlapX
        = size
            - ((object.x + object.width) % size);
        overlapY
        = size
            - ((object.y + object.height) % size);

        if (overlapY >= overlapX) {
            if (object.vy > 0
                && platformMap[object.top()][object.right()]
                != platform) {
                //Collision on bottom
             //   object.y= (object.getRow() * size) + (size - object.height);
                object.vy = 0;
            };
        }
        else {
            //Collision on right
        //    object.x= (object.getColumn() * size)+ ((size - object.width) - 1);
            //	object.vx = 0;
        };
    }
    //If the object's top right corner is overlapping the tile
    //on its upper right side...
    if (platformMap[object.top()][object.right()]
        == platform) {
        //Measure the x overlap from the far right side of the
        //tile and compensate for the object's width
        overlapX = size- ((object.x + object.width) % size);
        overlapY = object.y % size;

        if (overlapY >= overlapX) {
            if (object.vy < 0
                && platformMap[object.bottom()][object.right()]
                != platform) {
              //  object.y = (object.getRow() * size);
                object.vy = 0;
            };
        }
        else {
            //Collision on right
        //    object.x= (object.getColumn() * size)+ ((size - object.width) - 1);
            	object.vx = 0;
        };
    }; 

};


//Collision between rectangles, using combined half heights and combined half widths to get detection, returns true/false, moves object 1 out of the way
function rectangleCollision(r1, r2) {
    //Calculate the distance vector
    var vx = r1.centerX() - r2.centerX();
    var vy = r1.centerY() - r2.centerY();

    //Figure out the combined half-widths and half-heights
    var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
    var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

    //Check whether vx is less than the combined half widths 
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occurring! 
        //Check whether vy is less than the combined half heights 
        if (Math.abs(vy) < combinedHalfHeights) {
            //A collision has occurred! This is good! 
            //Find out the size of the overlap on both the X and Y axes
            var overlapX = combinedHalfWidths - Math.abs(vx);
            var overlapY = combinedHalfHeights - Math.abs(vy);

            //The collision has occurred on the axis with the
            //*smallest* amount of overlap. Let's figure out which
            //axis that is

            if (overlapX >= overlapY) {
                //The collision is happening on the X axis 
                //But on which side? vy can tell us
                if (vy > 0) {
                    //Top
                    //Move the rectangle out of the collision
                    r1.y = r1.y + overlapY;
                }
                else {
                    //Bottom
                    //Move the rectangle out of the collision
                    r1.y = r1.y - overlapY;
                };
            }
            else {
                //The collision is happening on the Y axis 
                //But on which side? vx can tell us
                if (vx > 0) {
                    //Left Side
                    //Move the rectangle out of the collision
                    r1.x = r1.x + overlapX;
                }
                else {
                    //Right Side
                    //Move the rectangle out of the collision
                    r1.x = r1.x - overlapX;
                };
            };

            return true;
        };
    };

    return false;
};

//collisions between circles, basic radius check that moves the first object back out of the collision and returns true/false
function circleCollision(c1, c2) {

    var overlap;
    
    var r1 = c1.halfWidth();
    var r2 = c2.halfWidth();

    var vx = c1.centerX() - c2.centerX();
    var vy = c1.centerY() - c2.centerY();

    //The two circle's radius added together
    var totalRadii = r1 + r2;

    //Magnitude between two circles
    var magnitude = Math.sqrt((vx * vx + vy * vy));

    //Normal for vector
    var dx;
    var dy;

    if (magnitude < totalRadii) {
        overlap = totalRadii - magnitude;
        dx = vx / magnitude;
        dy = vy / magnitude;

        c1.x += overlap * dx;
        c1.y += overlap * dy;

        return true;
    };

    return false;

};

//Collisions between bullets and objects, basic radius check that returns true or false
function bulletCollision(c1, c2) {

    var r1 = c1.halfWidth();
    var r2 = c2.halfWidth();

    var vx = c1.centerX() - c2.centerX();
    var vy = c1.centerY() - c2.centerY();

    //The two circle's radius added together
    var totalRadii = r1 + r2;

    //Magnitude between two circles
    var magnitude = Math.sqrt((vx * vx + vy * vy));


    if (magnitude < totalRadii) {
        return true;
    };

    return false;
};

//For line of sight, tests to see if the point is within the sprites bounds
function hitTestPoint(pointX, pointY, sprite) {
    var hit
      = pointX > sprite.left() && pointX < sprite.right()
      && pointY > sprite.top() && pointY < sprite.bottom();

    return hit;
}