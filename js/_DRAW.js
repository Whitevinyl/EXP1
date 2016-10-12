/**
 * Created by luketwyman on 03/11/2014.
 */


//-------------------------------------------------------------------------------------------
//  BG
//-------------------------------------------------------------------------------------------


function drawBG() {

    //cxa.globalAlpha = 1;

    color.fill(cxa,bgCol);
    cxa.fillRect(0,0,fullX,fullY);
}





//-------------------------------------------------------------------------------------------
//  FOREGROUND
//-------------------------------------------------------------------------------------------




function drawScene() {



}



//-------------------------------------------------------------------------------------------
//  DRAW FUNCTIONS
//-------------------------------------------------------------------------------------------

function drawLogo(x,y,s,ctx,baseline,stroke) {

    if (!baseline) {
        y = y + ((s*units) * 0.5);
    }

    if (stroke) {
        ctx.beginPath();
        ctx.moveTo(x+(units*0.075*s),y); // bar bottom right
        ctx.lineTo(x-(units*0.42*s),y-(units*s)); // left arm top right
        ctx.lineTo(x-(units*0.6*s),y-(units*s)); // left arm top left
        ctx.lineTo(x-(units*0.105*s),y); // bar bottom left
        ctx.lineTo(x+(units*0.075*s),y); // bar bottom right
        ctx.lineTo(x+(units*0.075*s),y-(units*0.69*s)); // bar right join
        //ctx.closePath();
        //ctx.stroke();


        ctx.moveTo(x-(units*0.075*s),y-(units*s)); // bar top left
        ctx.lineTo(x+(units*0.105*s),y-(units*s)); // bar top right
        ctx.lineTo(x+(units*0.6*s),y); // right arm bottom right
        ctx.lineTo(x+(units*0.42*s),y); // right arm bottom left
        ctx.lineTo(x-(units*0.075*s),y-(units*s)); // bar top left
        ctx.lineTo(x-(units*0.075*s),y-(units*0.31*s)); // bar left join
        ctx.stroke();

    } else {
        ctx.beginPath();
        ctx.moveTo(x-(units*0.6*s),y-(units*s));
        ctx.lineTo(x-(units*0.105*s),y); // OUTER L
        // CENTER B
        ctx.lineTo(x+(units*0.075*s),y);
        ctx.lineTo(x+(units*0.075*s),y-(units*0.69*s)); //    |\

        ctx.lineTo(x+(units*0.42*s),y);
        ctx.lineTo(x+(units*0.6*s),y);
        ctx.lineTo(x+(units*0.105*s),y-(units*s));
        // CENTER T
        ctx.lineTo(x-(units*0.075*s),y-(units*s));
        ctx.lineTo(x-(units*0.075*s),y-(units*0.31*s)); //    \|
        ctx.lineTo(x-(units*0.42*s),y-(units*s));
        ctx.closePath();
        ctx.fill();
    }


}


function colorBlend(col1,col2,percent) {

    var r = col1.R + Math.round((col2.R - col1.R) * (percent/100));
    var g = col1.G + Math.round((col2.G - col1.G) * (percent/100));
    var b = col1.B + Math.round((col2.B - col1.B) * (percent/100));
    var a = col1.A + Math.round((col2.A - col1.A) * (percent/100));

    return new RGBA(r,g,b,a);
}




//-------------------------------------------------------------------------------------------
//  EFFECTS
//-------------------------------------------------------------------------------------------


