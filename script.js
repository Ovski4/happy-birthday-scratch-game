var stage,
    shape,
    x,
    y,
    listener,
    startScratchedTime,
    endScratchedTime,
    totalScratchedTime = 0
;

/**
 * Initialize components
 */
function init() {
    var canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(24);

    var picture = new createjs.Bitmap("images/cats.png");
    picture.image.onload = function() {
        stage.update();
    };

    shape = stage.addChild(picture, new createjs.Shape());
    addFullOverlay();
    stage.on("stagemousedown", startRevealingOverlay, this);
}

/**
 * Start revealing the overlay
 *
 * @param evt
 */
function startRevealingOverlay(evt) {
    var infoText = document.getElementsByClassName("info");
    setTimeout(function() {
        startScratchedTime = new Date();
        console.log(startScratchedTime);
        infoText[0].style.visibility = "hidden";
    }, 700);

    listener = stage.on("stagemousemove", revealOverlay, this);
    stage.on("stagemouseup", endRevealOverlay, this);

    x = evt.stageX-0.001;
    y = evt.stageY-0.001;
    revealOverlay(evt); // reveal a first circle to begin with
}

/**
 * Create an overlay to hide the picture
 * It will be erased by the user
 */
function addFullOverlay() {
    shape.cache(0, 0, 360, 360);
    shape.graphics.beginFill("#fff").drawRect(0, 0, 340, 340);
    shape.updateCache("source-over");
    shape.graphics.clear();
    stage.update();
}

/**
 * Reveal overlay
 *
 * @param evt
 */
function revealOverlay(evt) {
    shape.graphics.ss(20,1).s('#000').mt(x,y).lt(evt.stageX, evt.stageY);
    // we erase what the user is drawing
    shape.updateCache("destination-out");
    shape.graphics.clear();
    x = evt.stageX;
    y = evt.stageY;
    stage.update();
}

/**
 * End reveal overlay
 *
 * @param evt
 */
function endRevealOverlay(evt) {
    endScratchedTime = new Date();
    var interval = endScratchedTime - startScratchedTime;
    totalScratchedTime = interval + totalScratchedTime;
    if (totalScratchedTime >= 3500) {
        var lostText = document.getElementsByClassName("lost");
        lostText[0].style.visibility = "visible";
    }
    console.log('Scratched for '+interval);
    console.log('total for '+totalScratchedTime);
    stage.off("stagemousemove", listener);
    evt.remove();
}
