

var game = new Phaser.Game(
    600, 
    800, 
    Phaser.AUTO, 
    null, 
    {
      preload: preload, 
      create: create, 
      update: update, 
      render: render
    }
);


const GAME_VERSION = "03";

///asset variables///

//sprites
var antImage;    
var antQueen;
var GUIBoxTopImage;
var upgradeSprites;
var box;
//texts
var GUIBoxTop;
var textAnts;
var textFood;
var textNeedles;
var textAntsPerSec;
var textFoodPerSec;
var textNeedlesPerSec;
var debugText;
//buttons
var upgradeButton;
//audio
var audioSqueak;
var audioUpgradeSqueak;

///// game variables /////

var upgradesContainer;

//resources
var ants;
var food;
var needles;
//amount per second
var antsPerMilSec;
//resources per second produced by an ant
var foodPerAnt;
var needlesPerAnt;
//upgrades
var upgradeCost = 10;


////////////////////
///// preload //////
////////////////////
function preload() {
    //load plugis
    //setup game
    game.stage.disableVisibilityChange = true;
    //setup screen
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#555555';
    //load assets
    game.load.image('antImage', './assets/AntQueenPreview1.png');
    game.load.image('GUIBoxTopImage', './assets/GUIBoxTop.png');
    game.load.spritesheet('upgradeSprites', './assets/upgrade-animated-placeholder.png', 
        100, 30);
    //sound effects
    game.load.audio('audioSqueak', './assets/squeak.wav');
    game.load.audio('audioUpgradeSqueak', './assets/upgrade-squeak.wav');

    //input handle
    game.input.onTap.add(onClick, this);
}

//////////////////
///// create /////
//////////////////
function create() {
    /// Init game ///
    //Queen sprite
    antQueen = game.add.sprite(0, 0, 'antImage');
    antQueen.x = game.width/2;
    antQueen.y = 600;
    antQueen.anchor.set(0.5, 0.5);
    antQueen.scale.set(1, 1);
    //GUI
    initGUI();
    debugText = game.add.text(game.width-10, game.height-10, 
        "Development demo version " + GAME_VERSION, { 
            font: "20px Lucida Sans Unicode", 
            fill: "#ffffff", 
            stroke: "#222222",
            strokeThickness: 2,
            align: "left"
        });
    debugText.anchor.x = 1;
    debugText.anchor.y = 1;
    //counters
    ants = 0;
    food = 0;
    needles = 0;
    antsPerMilSec = 0;
    foodPerAnt = 1/3/1000; //one every 3 sec
    needlesPerAnt = 1/10/1000; //one every 10 sec
    //audio
    audioSqueak = game.add.audio('audioSqueak');
    audioUpgradeSqueak = game.add.audio('audioUpgradeSqueak');
    
    //animation test
    //box = game.add.sprite(game.width/2, game.height/2, 
    //'boxAnimation');
    //box.animations.add("move", [0, 1, 2]);

    initUpgradesContainer(game.width - 20, 100 + 20);
}

function initGUI(){
    //bg gui box
    game.add.sprite(0, 0, 'GUIBoxTopImage');
    //texts
    //left side
    var textConf = { 
            font: "20px Lucida Sans Unicode", 
            fill: "#ffffff", 
            stroke: "#222222",
            strokeThickness: 2,
            align: "left"
        };
    textAnts = game.add.text(10, 20*0+10, "Ants: 0", textConf);
    textFood = game.add.text(10, 20*1+10, "Food: 0", textConf);
    textNeedles = game.add.text(10, 20*2+10, "Ants: 0", textConf);
    //right side
    textConf.align = "right";
    textAntsPerSec = game.add.text(game.width-10, 20*0+10, "Ants Per Second: 0", textConf);
    textFoodPerSec = game.add.text(game.width-10, 20*1+10, "Food Per Second: 0", textConf);
    textNeedlesPerSec = game.add.text(game.width-10, 20*2+10, "Needles Per Second: 0", textConf);
    textAntsPerSec.anchor.x = 1;
    textFoodPerSec.anchor.x = 1;
    textNeedlesPerSec.anchor.x = 1;
}


//////////////////
///// update /////
//////////////////
function update() {
    //animation test
    //box.animations.play("move", 10, true);
    //Update game variables
    updateResources(game.time.elapsed);
    //Update gui
    updateTexts();        
}

function updateResources(millisecondsFromLastFrame) {
    //calculate resources per millisecond
    var foodPerMilSec = foodPerAnt * ants;
    var needlesPerMilSec = needlesPerAnt * ants;
    //add resources
    ants += antsPerMilSec * millisecondsFromLastFrame;
    food += foodPerMilSec * millisecondsFromLastFrame;
    needles += needlesPerMilSec * millisecondsFromLastFrame;
}   

function updateTexts(){
    //update text
    textAnts.text = "Ants: " + Math.floor(ants);
    textFood.text = "Food: " + Math.floor(food);
    textNeedles.text = "Needles: " + Math.floor(needles);
    textAntsPerSec.text = 
        "Ants Per Second: " + (antsPerMilSec * 1000).toFixed(1);
    textFoodPerSec.text = 
        "Food Per Second: " + (foodPerAnt * ants * 1000).toFixed(1);
    textNeedlesPerSec.text = 
        "Needles Per Second: " + (needlesPerAnt * ants * 1000).toFixed(1);
}

function render() {
    //Input debug
    //  Just renders out the pointer data when you touch the canvas
    //game.debug.pointer(game.input.mousePointer);
    //game.debug.pointer(game.input.pointer1);
    //game.debug.pointer(game.input.pointer2);
}

////////////////////
/// Input Events ///
////////////////////

//onClick is called when left mouse button is pressed 
function onClick(input){
    //Mmuse left
    if (game.input.activePointer.isMouse){

        

        if (onQueen(input.x, input.y)) {
            console.log('click!');
            audioSqueak.play();
            ants += 1;

            newUpgrade();
        }
    }
    //touch
    else if (game.input.pointer1.isDown){
        if (onQueen(input.x, input.y)){
            console.log("tap!");
            audioSqueak.play();
            ants += 1;
        }
    }
}

function onButton(upgradeObject) {
    /*
    console.log("Upgrade button clicked!");        
    if (food > upgradeCost){
        //Upgrade
        food -= upgradeCost;
        upgradeCost += 1;
        antQueen.scale.x += antQueen.scale.x * 0.1;
        antQueen.scale.y += antQueen.scale.y * 0.1;
        audioUpgradeSqueak.play();
        audioUpgradeSqueak._sound.playbackRate.value = upgradeCost * 0.1;
    }
    */
}

//Check if the parameter coordinates are on top of the queen-ant
function onQueen(x, y){
    if (Phaser.Rectangle.contains( antQueen.getBounds(), x, y)) {
        return true;
    }
    return false;
}
/*
function newAnt(antsAmount){
    if (antsAmount == undefined) {
        antsAmount = 1;
    }
    ants += antsAmount;
}
*/

////////////////
/// Upgrades ///
////////////////

function initUpgradesContainer(topRightX, topRightY){
    var padding = 20;

    //create container with BG sprite
    var width = game.width * 0.3;
    var height = game.height * 0.8;
    //var height = game.height - (topRightY + padding);

    //create BG bitmap
    var bmd = game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#ff0000';
    bmd.ctx.fill();

    //create sprite
    upgradesContainer = game.add.sprite(game.width - padding, 100 + padding, bmd);
    //upgradesContainer.alpha = 0.3;
    upgradesContainer.anchor.setTo(1, 0);

    //init upgrade-array
    upgradesContainer.upgrades = [];
    upgradesContainer.padding = 10;
}

function newUpgrade(){
    if (upgradesContainer.upgrades.length < 10){
        //get with and height
        var width = upgradesContainer.width - upgradesContainer.padding * 2;
        var height = 50;

        //create a new upgrade
        var newUpgrade = newUpgradeBG(width, height, '#ffffff');
        upgradesContainer.addChild(newUpgrade);
        //newUpgrade.bringToTop();

        newUpgrade.button = game.add.button(
                5, newUpgrade.height / 2, "upgradeSprites", function() {removeUpgrade(newUpgrade)}, this, 0, 0, 1
            );
        newUpgrade.button.anchor.set(0, 0.5);
        newUpgrade.addChild(newUpgrade.button);

        //add upgrade to stack
        upgradesContainer.upgrades.push(newUpgrade);
    }
}

function newUpgradeBG(width, height, color){

    var previousUpgrade = upgradesContainer.upgrades[upgradesContainer.upgrades.length - 1];
    //create BG bitmap
    var bmd = game.add.bitmapData(width, height);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();

    var vec = upgradePosition(upgradesContainer.upgrades.length);

    //create sprite
    var sprite = game.add.sprite(vec.x, vec.y, bmd);
    sprite.anchor.setTo(0, 0);
    return sprite;
}

function removeUpgrade(upgradeToBeRemoved){
    console.log(upgradeToBeRemoved);
    
    //remove from stack
    var index = upgradesContainer.upgrades.indexOf(upgradeToBeRemoved);
    if (index > -1) {
        upgradesContainer.upgrades.splice(index, 1);

        //update stack positions
        for (var i = 0; i < upgradesContainer.upgrades.length; i++){
            var vec = upgradePosition(i);
            upgradesContainer.upgrades[i].position.set(vec.x, vec.y);
        }
    }
    //remove game object
    upgradeToBeRemoved.kill();
}

function upgradePosition(index) {

    //calculate next spawn position
    var x =  - upgradesContainer.width + upgradesContainer.padding; 
    var y = upgradesContainer.padding;
    if (index !== 0){
        y = 
            upgradesContainer.upgrades[index - 1].y + 
            upgradesContainer.upgrades[index - 1].height + 
            upgradesContainer.padding;
    }
    return new Phaser.Point(x, y);
}