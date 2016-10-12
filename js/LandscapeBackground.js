
//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function LandscapeBackground() {
    this.simplex = null;
    this.yOff = 0;
    this.res = new Point(18,30);
    this.resMult = 15;
    this.scaleDiv = 16;
    this.yRange = 80*units;
    this.dataRes = new Point(this.res.x,this.res.y*this.resMult);
    this.layers = [];
    this.data = [];
    this.data2 = [];
    this.size = new Point(fullX,fullY * 1.5);

    this.intensity = tombola.rangeFloat(0,1);
    this.speed = 1;
    this.weave = 0;
    this.weave1 = 0;

    this.generate();

}

LandscapeBackground.prototype.generate = function() {
    this.simplex = new SimplexNoise();
    this.yRange = 80*units;
    this.size = new Point(fullX,fullY * 1.5);
    this.layers = [];
    this.data = [];
    this.data2 = [];

    var i;

    for (i=0; i<this.dataRes.y; i++) {
        var d = [];
        var d2 = [];
        for (var h=0; h<this.dataRes.x; h++) {
            d.push( this.simplex.noise(h/this.scaleDiv, (i/(this.scaleDiv*this.resMult))) );
            d2.push( this.simplex.noise(100 + (h/(this.scaleDiv/2)), 100 + (i/((this.scaleDiv/2)*this.resMult))) );
        }
        this.data.push (d);
        this.data2.push (d2);
    }


    for (i=0; i<this.res.y; i++) {

        var pos = new Point(dx, dy - (this.size.y/2) + ((this.size.y/this.res.y) * i));
        var data = this.data[i * this.resMult];
        var data2 = this.data2[i * this.resMult];

        this.layers.push( new LandscapeLayer(pos, data, data2));

    }
};



//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


LandscapeBackground.prototype.update = function() {


    this.yOff ++;

    this.weave = this.simplex.noise(this.yOff/100,0);

    this.intensity = (1 + this.simplex.noise(0,1000 + (this.yOff/200)))/2;

    //this.intensity += tombola.fudgeFloat(4,0.005);
    //this.intensity = valueInRange(this.intensity,0,1);

    this.size.y = fullY * (1.5 + (1 * this.intensity));

    this.data.shift();
    this.data2.shift();
    var d = [];
    var d2 = [];
    for (var i=0; i<this.dataRes.x; i++) {
        d.push( this.simplex.noise(i/this.scaleDiv, ((this.dataRes.y + this.yOff)/(this.scaleDiv*this.resMult) )) );
        d2.push( this.simplex.noise(100 + (i/(this.scaleDiv/2)) + (this.weave), 100 + ((this.dataRes.y + this.yOff)/((this.scaleDiv/2)*this.resMult) )) );
    }
    this.data.push(d);
    this.data2.push(d2);

    for (i=0; i<this.res.y; i++) {
        this.layers[i].pos.y = dy - (this.size.y/2) + ((this.size.y/this.res.y) * i);
        this.layers[i].data = this.data[i * this.resMult];
        this.layers[i].data2 = this.data2[i * this.resMult];
    }

};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------


LandscapeBackground.prototype.draw = function() {

    //color.stroke(cxa,cols[0]);
    cxa.globalAlpha = 1;

    for (var i=0; i<this.layers.length; i++) {
        this.layers[i].draw(cxa, fullX, 90*units);
    }


    var ctx = cxa;

    color.stroke(cxa,cols[2]);
    //color.stroke(cxa,bgCols[0]);
    //ctx.beginPath();

    cxa.globalAlpha = 0.15;
    for (i=1; i<this.layers.length; i++) {
        var pl = this.layers[i-1];
        var l = this.layers[i];
        var sx = l.pos.x - (fullX/2);
        var xd = fullX / (l.data.length-1);
        var height = this.yRange;

        for (var h=0; h<this.res.x; h++) {

            // stroke //
            /*if (i%2==0) {
                if (h%2!==0) {
                    if (h>0) {
                        ctx.moveTo(sx + (xd * (h-1)), pl.pos.y + (pl.data[h-1] * height));
                    } else {
                        ctx.moveTo(sx + (xd * h), l.pos.y + (l.data[h] * height));
                    }
                    ctx.lineTo(sx + (xd * h), l.pos.y + (l.data[h] * height));
                    ctx.lineTo(sx + (xd * (h+1)), pl.pos.y + (pl.data[h+1] * height));
                }

            } else {
                if (h%2==0) {
                    if (h>0) {
                        ctx.moveTo(sx + (xd * (h-1)), pl.pos.y + (pl.data[h-1] * height));
                    } else {
                        ctx.moveTo(sx + (xd * h), l.pos.y + (l.data[h] * height));
                    }
                    ctx.lineTo(sx + (xd * h), l.pos.y + (l.data[h] * height));
                    ctx.lineTo(sx + (xd * (h+1)), pl.pos.y + (pl.data[h+1] * height));
                }
            }*/

            // fill //

            var d = (l.pos.y + (l.data[h] * height)) - (pl.pos.y + (pl.data[h] * height));
            var pad = 0.05;
            //if (d > 0) {

                var p = (d / (this.yRange/2)) * 100;
                color.fill(ctx, colorBlend(  bgCol, cols[1], 100 - p ) );
                var ripple = -this.intensity * (height/3);

                if ((i%2==0 && h%2!==0) || (i%2!==0 && h%2==0)) {
                    ctx.beginPath();
                    if (h>0) {
                        ctx.moveTo(sx + (xd * (h-1)) - pad, pl.pos.y + (pl.data[h-1] * height) + (pl.data2[h-1] * ripple) - pad);
                    } else {
                        ctx.moveTo(sx + (xd * h), pl.pos.y + (pl.data[h] * height) + (pl.data2[h] * ripple) - pad);
                    }
                    ctx.lineTo(sx + (xd * h), l.pos.y + (l.data[h] * height) + (l.data2[h] * ripple) + pad);
                    if (h<this.res.x-1) {
                        ctx.lineTo(sx + (xd * (h+1)) + pad, pl.pos.y + (pl.data[h+1] * height) + (pl.data2[h+1] * ripple) - pad);
                    } else {
                        ctx.lineTo(sx + (xd * h), pl.pos.y + (pl.data[h] * height) + (pl.data2[h] * ripple) - pad);
                    }

                    ctx.closePath();
                    ctx.fill();
                }
                else {
                    ctx.beginPath();
                    if (h>0) {
                        ctx.moveTo(sx + (xd * (h-1)) - pad, l.pos.y + (l.data[h-1] * height) + (l.data2[h-1] * ripple) + pad);
                    } else {
                        ctx.moveTo(sx + (xd * h), l.pos.y + (l.data[h] * height) + (l.data2[h] * ripple) + pad);
                    }
                    ctx.lineTo(sx + (xd * h), pl.pos.y + (pl.data[h] * height) + (pl.data2[h] * ripple) - pad);
                    if (h<this.res.x-1) {
                        ctx.lineTo(sx + (xd * (h+1)) + pad, l.pos.y + (l.data[h+1] * height) + (l.data2[h+1] * ripple) + pad);
                    } else {
                        ctx.lineTo(sx + (xd * h), l.pos.y + (l.data[h] * height) + (l.data2[h] * ripple) + pad);
                    }

                    ctx.closePath();
                    ctx.fill();
                }


            //}

        }

    }
    //ctx.stroke();


    cxa.globalAlpha = 1;
    color.fill(cxa,cols[2]);
    //drawLogo(dx,dy,80*units,cxa,false,false);
    cxa.globalAlpha = 1;
    color.stroke(cxa,cols[0]);
    //color.stroke(cxa,bgCols[0]);
    drawLogo(dx,dy,80*units,cxa,false,true);

};


//-------------------------------------------------------------------------------------------
//  LAYER
//-------------------------------------------------------------------------------------------


function LandscapeLayer(pos,data,data2) {
    this.pos = pos;
    this.data = data;
    this.data2 = data2;
}
LandscapeLayer.prototype.update = function() {

};
LandscapeLayer.prototype.draw = function(ctx, w, h) {
    var sx = this.pos.x - (w/2);
    var xd = w / (this.data.length-1);
    var i;



    /*var grad=cxa.createLinearGradient(0,this.pos.y-h,0,this.pos.y+h);
    grad.addColorStop(0.1,color.string(cols[1]));
    grad.addColorStop(0.3,color.string(bgCols[0]));*/
    //cxa.fillStyle=grad;

    // fill //
    /*color.fill(cxa,cols[2]);
    ctx.beginPath();
    ctx.moveTo(sx,fullY);
    ctx.lineTo(sx, this.pos.y + (this.data[0] * h));
    for (i=1; i<this.data.length; i++) {
        ctx.lineTo(sx + (xd * i), this.pos.y + (this.data[i] * h));
    }
    ctx.lineTo(sx + (xd * i), fullY);
    ctx.closePath();
    ctx.fill();*/


    // draw line //
    /*color.stroke(cxa,cols[2]);
    ///color.stroke(cxa,cols[0]);
    //ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(sx, this.pos.y + (this.data[0] * h));
    for (i=1; i<this.data.length; i++) {
        ctx.lineTo(sx + (xd * i), this.pos.y + (this.data[i] * h));
    }
    ctx.stroke();*/


    /*color.stroke(cxa,cols[0]);
    ctx.beginPath();
    var s = 2 * units;
    //ctx.moveTo(sx, this.pos.y + (this.data[0] * h));
    for (i=0; i<this.data.length; i++) {

        ctx.moveTo(sx + (xd * i) - s, this.pos.y + (this.data[i] * h) - s);
        ctx.lineTo(sx + (xd * i) + s, this.pos.y + (this.data[i] * h) + s);
        ctx.moveTo(sx + (xd * i) - s, this.pos.y + (this.data[i] * h) + s);
        ctx.lineTo(sx + (xd * i) + s, this.pos.y + (this.data[i] * h) - s);
    }
    ctx.stroke();*/



};
