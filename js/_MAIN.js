/**
 * Created by luketwyman on 03/11/2014.
 */



// INIT //
var canvas;
var cxa;
var scene = 0;
var TWEEN;


// METRICS //
var halfX = 0;
var halfY = 0;
var fullX = 0;
var fullY = 0;
var units = 0;
var dx = halfX;
var dy = halfY;
var headerType = 0;
var midType = 0;
var dataType = 0;
var bodyType = 0;
var subType = 0;
var device = "desktop";


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var touchTakeover = false;
var touch;
var mouseIsDown = false;


// COLORS //
var bgCols = [new RGBA(33,17,33,1)];
var cols = [new RGBA(255,255,255,1), new RGBA(0,226,186,1), new RGBA(255,131,125,1)];
var bgCol = bgCols[0];

var landscapeBackground;


//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function init() {

    ////////////// SETUP CANVAS ////////////

    canvas = document.getElementById("cnvs");
    var target = canvas;

    // MOUSE //
    target.addEventListener("mousedown", mousePress, false);
    target.addEventListener("mouseup", mouseRelease, false);
    target.addEventListener("mousemove", mouseMove, false);

    // TOUCH //
    target.addEventListener('touchstart', function(event) {
        if (event.targetTouches.length == 1) {
            touch = event.targetTouches[0];
            touchTakeover = true;
        } else {
            touchTakeover = false;
        }
        clickOrTouch();
    }, false);
    target.addEventListener('touchmove', function(event) {
        event.preventDefault();
        if (event.targetTouches.length == 1) {
            touch = event.targetTouches[0];
        }
        mouseMove(event);
    }, false);
    target.addEventListener('touchend', function(event) {
        mouseRelease();
        touchTakeover = false;
    }, false);

    cxa = canvas.getContext("2d");
    cxa.mozImageSmoothingEnabled = false;
    cxa.imageSmoothingEnabled = false;

    // SET CANVAS & DRAWING POSITIONS //
    metrics();


    landscapeBackground = new LandscapeBackground();

    // DONE //
    scene = 1;
    draw();

    /*setTimeout( function() {
        colourTo(bgCols[1],242,48,95,1,1.5);
    },2000);*/



} // END INIT








//-------------------------------------------------------------------------------------------
//  LOOP
//-------------------------------------------------------------------------------------------




function draw() {
    if (scene==1) {
        update();
        drawBG();
        landscapeBackground.draw();
        drawScene();
    }

    requestAnimationFrame(draw);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------



function update() {
    if (TWEEN) {
        TWEEN.update();
    }
    landscapeBackground.update();
}




function valueInRange(value,floor,ceiling) {
    if (value < floor) {
        value = floor;
    }
    if (value> ceiling) {
        value = ceiling;
    }
    return value;
}




