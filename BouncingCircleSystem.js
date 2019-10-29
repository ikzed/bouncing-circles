
////////////        CONFIG VARIABLES START           ////////////////

var context;
var frame_width, frame_height;      // canvas dimensions
const fps = 60;                     // code based on 60 fps animation
const ag = 9.8 * 0.1;               // acceleration due to gravity 9.8m/s^2
                                    // ... the 0.1 factor is to scale it so 10 pixels = 1m.
const frame_ag = ag / fps;          // delta in velocity (from gravity) per frame
const frameInterval = 1000 / fps;   // Time between frame in ms.
const ZERO_VELOCITY = 0;
var rad = 20;                       // constant radius used for all circles (in pixels)

var ballArr = [];                   // All circles in the canvas
var minCollisionSpeed = 0.4;        // Min speed for damped collisions. Zero out speed
                                    // ... for slower collisions.
var collisionEnergyLoss = 0.25;     // Energy loss constant 25% for circle collisions

var velDampingFactor = Math.sqrt(1 - collisionEnergyLoss);  // Velocity damping factor on collision
                                                            // applied sqrt to account for v^2 in kinetic energy.

var minCircles=1, maxCircles=5;     // Boundary values for random number of circles to launch in the canvas
var minVel=-20, maxVel=30;          // Boundary values for random initial launch velocity (x and y vectors)
var createRandomCircles = true;     // Config to randomly generate circles (suppressed if circles are injected
                                    // ... via the constructor.

var circlesSeparatedAtLaunch = false;   
/* Bool indicating if circles have separated after initial launch. Collision detection is
suppressed at launch) since multiple circles exist at the same mouse click location. */

////////////        CONFIG VARIABLES END            ////////////////

init();

// Constructor to inject the initial state of the system and set energy loss parameters
function BouncingBall(circleRadius, minTravelSpeed, collisionLossPct, ballArray) {
    rad = circleRadius;
    minCollisionSpeed = minTravelSpeed;
    collisionEnergyLoss = collisionLossPct;
    ballArr = ballArray;
    circlesSeparatedAtLaunch = false;
    createRandomCircles = false;
}





// Draw canvas to host the circles and add a click handler to launch the circles
// from the user's click coordinates
function init() {
    canvasElement = document.getElementById('canvas');
    context= canvasElement.getContext('2d');
    frame_width = canvasElement.width;
    frame_height = canvasElement.height;

    canvasElement.addEventListener("click", onClick, false);

    changeFrame();
}


// Move all circles according to their velocity.
// Disable circle collision checks (as function only used at launch).
// Set flag to re-enable collision checks once all circles have separated
// subsequent to the initial launch stage.
function checkAllCirclesSeparated() {
    for (var i=0; i < ballArr.length; i++){
        var b = ballArr[i];
        b.move();
    }

    outer:
    for ( var j = 0; j < ballArr.length; j++){
        for ( var k =j+1; k< ballArr.length; k++){
            if (ballArr[j].isColliding(ballArr[k])){
                break outer;
            }   
        }

        if (j == ballArr.length - 1) {
            circlesSeparatedAtLaunch = true;
        }
    }           
}



/* TODO: Could be further optimized (only check circle pairs which haven't been collision checked)
   and damp velocities of both circles at the same time.
   However, that would require more physics equations as in some cases A vs B and B vs A both need to be checked.
   Specifically the above optimization yielded errors in testing when a lower index circle was on the ground then
   the higher index one bounced infinitely - another case was circles suspended in mid air collision.

Detect if a circle is colliding with other circles. Damp velocity accordingly.
As a simplification velocity direction is assumed simply reversed 180 degrees on collision - practically kinetic energy
and momentum conservation need to be considered to derive the correct post collision direction of travel.
*/
function detectInterCircleCollisions(refCircle, refCircleIndex, circleArr) {
    var groundContact = false;

    //Damp velocity after collision and floor to 0 if less than threshold
    for (var k = 0; k < circleArr.length ; k++) {
        if (refCircleIndex == k) {continue;}
            if (refCircle.isColliding(circleArr[k])) {

                if (Math.abs(refCircle.vx) < minCollisionSpeed){
                    refCircle.vx = ZERO_VELOCITY;
                } else{
                    refCircle.vx = (-refCircle.vx * velDampingFactor);
                }
                if (Math.abs(refCircle.vy) < minCollisionSpeed) {
                    refCircle.vy = ZERO_VELOCITY;
                } else {
                    refCircle.vy = (-refCircle.vy * velDampingFactor);
                }

                //Indicates whether colliding against a ball resting on the ground
                if (circleArr[k].vx === ZERO_VELOCITY & circleArr[k].vy === ZERO_VELOCITY){
                    groundContact = true;
                }

                break;
            }
    }

    return groundContact;
}

// Determine if a circle is colliding against a wall (canvas edge)
// and apply direction change + energy damping as appropriate
function detectCircleWallCollisions(b, groundContact) {
    if (b.x < (b.radius - b.vx) || b.x > frame_width - (b.radius + b.vx)) {
        if (Math.abs(b.vx) < minCollisionSpeed) {
            b.vx = ZERO_VELOCITY;
        }
        else { 
            b.vx = (-b.vx * velDampingFactor);
            b.vy = b.vy * velDampingFactor;
        }
    }

    if  (b.y < (b.radius - b.vy) || b.y > frame_height - (b.radius+b.vy)) {
        if (b.vy > ZERO_VELOCITY && b.vy < minCollisionSpeed) {
            b.vy = ZERO_VELOCITY;
        }
        else { 
            b.vy = (-b.vy * velDampingFactor);
            b.vx = velDampingFactor * b.vx;
        }
    }
    else
    {
        //Apply gravitational acceleration if not bouncing against the ground
        //and not bouncing against a ball resting on the ground in the current frame.
        // i.e. only apply gravity if suspended in air
        if (!groundContact) {
            b.vy += frame_ag*frameInterval;
        }
    }
}

// Animation function looped at each frame change
// Move circles in each frame and adjust velocities in response to collisions.
function changeFrame() {
    clear();

    //Suppress circle-circle collision checks at launch until all circles separated
    if (!circlesSeparatedAtLaunch){
        checkAllCirclesSeparated();
    }
    

    for (var i = 0; i < ballArr.length; i++) {
        var circle = ballArr[i];

        circle.move();
        var groundContact = false;  

        //Detect circle-circle collisions
        if (circlesSeparatedAtLaunch) {
            groundContact = detectInterCircleCollisions(circle, i, ballArr);
        }
    
        //Detect circle collisions with walls 
        detectCircleWallCollisions(circle, groundContact);
    }

    requestAnimationFrame(changeFrame);
    // loop to continue animation frames
}


function clear() {
    context.fillStyle="#ffffff";
    context.fillRect(0,0,frame_width,frame_height);
    context.fillStyle="#888888";
    context.strokeRect(0,0,frame_width,frame_height);
}

function onClick(e) {
    var element = canvasElement;
    var offsetX = 0, offsetY = 0;

        if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    x = e.pageX - offsetX;
    y = e.pageY - offsetY;

    // generate random number of circles and launch velocities
    // if not injected via the constructor
    if (createRandomCircles) {
        generateRandomCircles(x,y,minCircles,maxCircles);
    }
}

// Generate a random number of circles with random speed
// all centered at param coordinates.
function generateRandomCircles(x, y, minNumCircles, maxNumCircles){
    ballArr = [];
    var numCircles = Math.floor(getRandomFloat(minNumCircles,maxNumCircles));

    for (var i=0; i< numCircles; i++){
        var vx = getRandomFloat(minVel, maxVel);
        var vy = getRandomFloat(minVel, maxVel);


        ballArr.push(new Ball(i, x, y, rad, "#000000", vx, vy));
    }
    circlesSeparatedAtLaunch = false;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


