
//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function LandscapeBackground() {
    this.simplex = null;
    this.yOff = 0;
    this.res = new Point(Math.floor(fullX/(60*units)),28);
    this.resMult = 18;
    this.scaleDiv = 17;
    this.yRange = 80*units;
    this.dataRes = new Point(this.res.x,this.res.y*this.resMult);
    this.layers = [];
    this.data = [];
    this.data2 = [];
    this.size = new Point(fullX,fullY * 1.5);

    this.intensity = tombola.rangeFloat(0,1);
    this.weave = 0;

    this.particles = [];
    this.testCount = 0;

    this.generate();

}

LandscapeBackground.prototype.generate = function() {
    this.simplex = new SimplexNoise();
    this.yOff = 0;
    this.yRange = 80*units;
    this.size = new Point(fullX,fullY * 1.5);
    this.layers = [];
    this.data = [];
    this.data2 = [];
    this.particles = [];

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


    for (i=0; i<250; i++) {
        pos = new Point(Math.random()*fullX, Math.random()*fullY);
        var vector = new Vector(tombola.rangeFloat(-1.5,1.5), tombola.rangeFloat(-0.2,0.2));
        var size = tombola.rangeFloat(0.15,0.95);
        this.particles.push( new WaterParticle(pos, vector, size));
    }

};


LandscapeBackground.prototype.resize = function() {
    //this.generate();
    this.yRange = 80*units;
    this.size = new Point(fullX,fullY * 1.5);
    this.dataRes.x = this.res.x = Math.floor(fullX/(60*units));

    for (var i=0; i<this.res.y; i++) {

        var pos = new Point(dx, dy - (this.size.y/2) + ((this.size.y/this.res.y) * i));

        this.layers[i].pos = pos;

    }
};


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


LandscapeBackground.prototype.update = function() {


    this.yOff ++;

    this.weave = this.simplex.noise(this.yOff/100,0);

    this.intensity = (1 + this.simplex.noise(0,1000 + (this.yOff/200)))/2;


    var yScale = 1.5;
    if (device=='mobile') {
        yScale = 1.1;
    }

    this.size.y = fullY * (yScale + (yScale * this.intensity));

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

    var ctx = cxa;
    ctx.globalAlpha = 1;

    var height = this.yRange;
    var pad = 0.5 * units;
    var ripple = -this.intensity * (height/3);


    var xDiv = this.size.x/this.res.x;
    var yDiv = this.size.y/this.res.y;
    var yGutter = (this.size.y - fullY)/2;

    var highlight = colorBlend(  bgCol, cols[1], 18 );


    var length = this.res.y;
    for (var i=1; i<length; i++) {
        var pl = this.layers[i-1];
        var l = this.layers[i];
        var sx = l.pos.x - (fullX/2);
        var xd = fullX / (this.res.x-1);


        for (var h=0; h<this.res.x; h++) {



            // fill //

            var d = (l.pos.y + (l.data[h] * height)) - (pl.pos.y + (pl.data[h] * height)); // tri height
            var p = (d / (this.yRange/2)) * 100; // percent
            var col = colorBlend(  bgCol, highlight, 100 - p );

            // white tint //
            var xPos = sx + (xd * h);
            var yPos = l.pos.y + (l.data[h] * height) + (l.data2[h] * ripple);

            if (xPos > (dx - (120*units)) && xPos < (dx + (120*units))) {

                if (yPos > (dy + (50*units)) && yPos < (dy + (200*units))) {
                    d = (dy + (125*units)) - yPos;
                    var d2 = dx - xPos;
                    if (d<0) d = -d;
                    if (d2<0) d2 = -d2;

                    p = ((1 - (d / (75*units))) * (1 - (d2 / (120*units)) )) * 3;
                    col = colorBlend(col,cols[0],p);
                }
            }

            color.fill(ctx, col );


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
                }
                else {
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
                }
                else {
                    ctx.lineTo(sx + (xd * h), l.pos.y + (l.data[h] * height) + (l.data2[h] * ripple) + pad);
                }

                ctx.closePath();
                ctx.fill();
            }

        }

    }


    color.fill(cxa,cols[0]);
    length = this.particles.length;
    for (i=0; i<length; i++) {

        var gridX = Math.floor(this.particles[i].pos.x / xDiv);
        var gridY = Math.floor((yGutter + (this.particles[i].pos.y)) / yDiv);

        var yOff = (this.layers[gridY].data[gridX] * height) + (this.layers[gridY].data2[gridX] * ripple);
        this.particles[i].update(yOff);
        this.particles[i].draw();
    }


    cxa.globalAlpha = 0.75;
    if (noisePNG) {
        drawPattern(0,0,fullX,fullY,noisePNG,200,ctx);
    }


    cxa.globalAlpha = 1;
    color.stroke(cxa,cols[0]);

    /*ctx.beginPath();
    ctx.moveTo(dx - (85*units),dy);
    ctx.lineTo(dx - (75*units),dy);
    ctx.moveTo(dx + (85*units),dy);
    ctx.lineTo(dx + (75*units),dy);
    ctx.stroke();*/

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
    color.stroke(cxa,cols[2]);
    ///color.stroke(cxa,cols[0]);
    //ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(sx, this.pos.y + (this.data[0] * h));
    for (i=1; i<this.data.length; i++) {
        ctx.lineTo(sx + (xd * i), this.pos.y + (this.data[i] * h));
    }
    ctx.stroke();


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


function WaterParticle(pos,vector,size) {
    this.pos = pos;
    this.vector = vector;
    this.yOff = 0;
    this.size = size;
    this.alpha = tombola.rangeFloat(0,0.1);
}
WaterParticle.prototype.update = function(yOff) {
    this.pos.x += tombola.rangeFloat(0,this.vector.x);
    this.pos.y += tombola.rangeFloat(0,this.vector.y);

    this.alpha += tombola.rangeFloat(-0.01,0.01);
    this.alpha = valueInRange(this.alpha,0,0.2);

    this.yOff = lerp(this.yOff, yOff, 5);

    if (this.pos.x<0) {
        this.pos.x = fullX;
    }
    if (this.pos.x>fullX) {
        this.pos.x = 0;
    }
    if (this.pos.y<0) {
        this.pos.y = fullY;
    }
    if (this.pos.y>fullY) {
        this.pos.y = 0;
    }
};
WaterParticle.prototype.draw = function() {
    cxa.globalAlpha = this.alpha;
    cxa.beginPath();
    cxa.arc(this.pos.x, this.pos.y + this.yOff, this.size * units, 0, TAU);
    cxa.closePath();
    cxa.fill();
};


function lerp(current,destination,speed) {
    return current + (((destination-current)/100) * speed);
}

