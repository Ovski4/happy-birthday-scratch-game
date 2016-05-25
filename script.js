var stage,
    shape,
    x,
    y,
    listener,
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
    document.getElementById("message").innerHTML = configuration.message;

    totalScratchedTime = 0;

    var picture = new createjs.Bitmap(configuration.imagePath);
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
    startScratchedTime = new Date();
    setTimeout(function() {
        document.getElementById("info").style.visibility = "hidden";
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
    document.getElementById("info").style.visibility = "visible";
    document.getElementById("message").style.visibility = "hidden";
    document.getElementById("next").style.visibility = "hidden";
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
    if (totalScratchedTime >= 4000) {
        onImageDiscovered();
    }
    stage.off("stagemousemove", listener);
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