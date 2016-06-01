var stage,
    shape,
    x,
    y,
    listenerMouseMove,
    listenerMouseDown,
    startScratchedTime,
    endScratchedTime,
    totalScratchedTime = 0,
    gameNumber = 0
;

var games = configuration.games;

document.getElementById("next").onclick = function() {
    gameNumber++;
    //localStorage.setItem("gameNumber", gameNumber);
    stage.removeAllChildren();
    setStage(games[gameNumber]);
    stage.update();
};

document.getElementById("info").onclick = function() {
    document.getElementById("info").style.visibility = "hidden";
    x = undefined;
    y = undefined;
};

/**
 * Initialize components
 */
function init() {
    preloadPictures();
    var canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(24);
    if (localStorage.getItem("gameNumber") !== null) {
        gameNumber = Number(localStorage.getItem('gameNumber'));
    }
    setStage(games[gameNumber]);
}

/**
 * Preload the pictures
 */
function preloadPictures() {
    // preload configuration images
    for (var i = 0; i < games.length; i++) {
        var preloadedImage = new Image();
        var preloadedBackgroundImage = new Image();
        preloadedImage.src = games[i]['imagePath'];
        preloadedBackgroundImage.src = games[i]['backgroundImagePath'];
    }
    //preload last gif
    var preloadedGif = new Image();
    preloadedGif.src = "images/leo.gif";

}

/**
 * Set the stage
 *
 * @param configuration
 */
function setStage(configuration) {
    x = undefined;
    y = undefined;
    document.getElementById("message").innerHTML = configuration.message;

    totalScratchedTime = 0;

    var picture = new createjs.Bitmap(configuration.imagePath);
    picture.image.onload = function() {
        stage.update();
    };

    shape = stage.addChild(picture, new createjs.Shape());
    addFullOverlay();
    stage.off("stagemousedown", listenerMouseDown);
    listenerMouseDown = stage.on("stagemousedown", startRevealingOverlay, this);
}

/**
 * Start revealing the overlay
 *
 * @param evt
 */
function startRevealingOverlay(evt) {
    startScratchedTime = new Date();

    listenerMouseMove = stage.on("stagemousemove", revealOverlay, this);
    stage.on("stagemouseup", endRevealOverlay, this);

    revealOverlay(evt); // reveal a first circle to begin with
}

/**
 * Create an overlay to hide the picture
 * It will be erased by the user
 */
function addFullOverlay() {
    document.getElementById("info").style.visibility = "visible";
    document.getElementById("message").style.visibility = "hidden";
    document.getElementById("next").style.visibility = "hidden";
    shape.cache(0, 0, 360, 360);
    shape.graphics
        .beginFill("#277fc1")
        .drawRect(0, 0, 320, 320)
        .beginFill("#f41d2b")
        .drawRect(145, 0, 30, 320)
        .drawRect(0, 145, 320, 30)
    ;
    var circleRowCount = 7;
    for (var i = 0; i < circleRowCount; i++) {
        var shift = (320/circleRowCount)/2;
        if (i%2 == 0) {
            shift = (320/circleRowCount);
        }
        for (var j = 0; j < circleRowCount; j++) {
            i2 = i*(320/circleRowCount)+22;
            j2 = j*(320/circleRowCount)+shift-15;
            shape.graphics.beginFill("#f41d2b").drawCircle(i2, j2, 10);
        }
    }

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
    // first circle
    if (typeof x == 'undefined') {
        x = evt.stageX-0.001;
    }
    if (typeof y == 'undefined') {
        y = evt.stageY-0.001;
    }
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
    x = undefined;
    y = undefined;
    endScratchedTime = new Date();
    var interval = endScratchedTime - startScratchedTime;
    totalScratchedTime = interval + totalScratchedTime;
    if (totalScratchedTime >= 4000) {
        onImageDiscovered();
    }
    stage.off("stagemousemove", listenerMouseMove);
    evt.remove();
}

/**
 * function called when the image is considered as discovered
 */
function onImageDiscovered()
{
    var configuration = games[gameNumber];
    document.getElementById("message").style.visibility = "visible";
    if (typeof configuration.class != 'undefined') {
        document.getElementById("message").className = configuration.class;
    }
    document.getElementById("message").style.background = 'url("'+configuration.backgroundImagePath+'")';
    if (games.length > gameNumber+1) {
        document.getElementById("next").style.visibility = "visible";
    } else { // last element
        localStorage.removeItem('gameNumber');
    }
}