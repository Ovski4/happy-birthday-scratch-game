var stage, shape;
var x, y, listener, color;

function init() {
    stage = new createjs.Stage("test");
    color = createjs.Graphics.getHSL(170, 50, 50);
    var testImg = new createjs.Bitmap("https://pbs.twimg.com/profile_images/54789364/JPG-logo-highres.jpg");
    testImg.image.onload = function() {
        stage.update();
    };
    shape = stage.addChild(testImg, new createjs.Shape());
    shape.cache(0, 0, 600, 400);
    fill();
    stage.on("stagemousedown", startDraw, this);

    function startDraw(evt) {
        listener = stage.on("stagemousemove", draw, this);
        stage.on("stagemouseup", endDraw, this);

        x = evt.stageX-0.001; // offset so we draw an initial dot
        y = evt.stageY-0.001;
        draw(evt); // draw the initial dot
    }
}

function fill() {
//shape.graphics.ss(4000,1).s(color).mt(50,50).lt(50, 50);
    shape.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 100);
    shape.updateCache("source-over");
    shape.graphics.clear();
    stage.update();
}

function draw(evt) {
    shape.graphics.ss(20,1).s(color).mt(x,y).lt(evt.stageX, evt.stageY);

    // the composite operation is the secret sauce.
    // we'll either draw or erase what the user drew.
    shape.updateCache("destination-out");

    shape.graphics.clear();
    x = evt.stageX;
    y = evt.stageY;
    stage.update();
}

function endDraw(evt) {
    stage.off("stagemousemove", listener);
    evt.remove();
}
