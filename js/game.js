

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


const GAME_VERSION = "07";

var UPGRADES = {
    antsPerMilSec: 0, 
    foodPerMilSec: 1,
    needlesPerMilSec: 2,

    antsPerClick: 3,

    foodPerAnt: 4,
    needlesPerAnt: 5
}

///asset variables///

//sprites   
var antQueen;
var GUIBoxTopImage;
var upgradeSprites;
var box;
//texts
var textConfiguration;
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
//sprite continer
var upgradesContainer;

//resources
var ants;
var food;
var needles;

//speed of resource gathering
var antsPerClick;

var antsPerMilSec; 
var foodPerMilSec;
var needlesPerMilSec;

//amount per gather
var foodPerAnt;
var needlesPerAnt;

/*
//resources
var ants;
var food;
var needles;
//amount per second
var antsPerMilSec;
//resources per second produced by an ant
var foodPerAnt;
var needlesPerAnt;
*/

//upgrades
var upgrades;
var upgradesJson;


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

    /// load assets ///
    //sprites
    game.load.image('GUIBoxTopImage', './assets/GUIBoxTop.png');
    //animations
    game.load.spritesheet('antQueen', './assets/AntQueen_Spritesheet_v1.png', 
        64, 64);
    game.load.spritesheet('upgradeSprites', './assets/upgrade-animated-placeholder.png', 
        100, 30);
    //sound effects
    game.load.audio('audioSqueak', './assets/squeak.wav');
    game.load.audio('audioUpgradeSqueak', './assets/upgrade-squeak.wav');
    //Json
    game.load.text('upgradesJson', '../upgrades.json');

    //input handle
    game.input.onTap.add(onClick, this);

}

//////////////////
///// create /////
//////////////////
function create() {
    /// Init game ///
    //Queen sprite
    antQueen = game.add.sprite(0, 0, 'antQueen');
    antQueen.animations.add("walk", [0, 1, 2]);
    antQueen.animations.add("jump", [3,0]);
    antQueen.animations.play("walk", 10, true);
    antQueen.x = game.width / 4;
    antQueen.y = game.height / 4 * 3;
    antQueen.anchor.set(0.5, 0.5);
    antQueen.scale.set(1, 1);

    //GUI
    textConfiguration = { 
            font: "20px Lucida Sans Unicode", 
            fill: "#ffffff", 
            stroke: "#222222",
            strokeThickness: 2,
            align: "left"
        };

    initGUI();

    debugText = game.add.text(game.width-10, game.height-10, 
        "Development demo version " + GAME_VERSION, textConfiguration);
    debugText.anchor.x = 1;
    debugText.anchor.y = 1;

    ///resource init
    ants = 0;
    food = 0;
    needles= 0;    

    antsPerMilSec = 0;
    foodPerMilSec = 1/5/1000;
    needlesPerMilSec = 1/10/1000;

    antsPerClick = 1;
    foodPerAnt = 1;
    needlesPerAnt = 1;

    //audio
    audioSqueak = game.add.audio('audioSqueak');
    audioUpgradeSqueak = game.add.audio('audioUpgradeSqueak');
    
    //animation test
    //box = game.add.sprite(game.width/2, game.height/2, 
    //'boxAnimation');
    //box.animations.add("move", [0, 1, 2]);

    //initUpgrades();
    initUpgradesContainer(game.width - 20, 100 + 20);
    //initUpgrades();

    //json
    var upgradesJson = JSON.parse(game.cache.getText('upgradesJson'));
}

function initGUI(){
    //bg gui box
    game.add.sprite(0, 0, 'GUIBoxTopImage');
    //texts
    //left side
    textAnts = game.add.text(10, 20*0+10, "Ants: 0", textConfiguration);
    textFood = game.add.text(10, 20*1+10, "Food: 0", textConfiguration);
    textNeedles = game.add.text(10, 20*2+10, "Ants: 0", textConfiguration);
    //right side
    textAntsPerSec = game.add.text(game.width-10, 20*0+10, "Ants Per Second: 0", textConfiguration);
    textFoodPerSec = game.add.text(game.width-10, 20*1+10, "Food Per Second: 0", textConfiguration);
    textNeedlesPerSec = game.add.text(game.width-10, 20*2+10, "Needles Per Second: 0", textConfiguration);
    
    textAntsPerSec.align = "right";
    textFoodPerSec.align = "right";
    textNeedlesPerSec.align = "right";

    textAntsPerSec.anchor.x = 1;
    textFoodPerSec.anchor.x = 1;
    textNeedlesPerSec.anchor.x = 1;
}

function restartGame(){
    game.state.restart(true, false);
}

function pauseGame(){
    game.paused = !game.paused;
}

function muteGame(){
    game.sound.mute = !game.sound.mute;
}

//////////////////
///// update /////
//////////////////
function update() {
    //animation
    if (antQueen.animations.currentAnim.name === "jump" && antQueen.animations.frame === 0){
         antQueen.animations.play("walk", 10, true);
    }
    //Update game variables
    updateResources(game.time.elapsed);
    //Update gui
    updateTexts();        
}

function updateResources(millisecondsFromLastFrame) {
    ants += antsPerMilSec * millisecondsFromLastFrame;
    food += ants* foodPerAnt * foodPerMilSec * millisecondsFromLastFrame;
    needles += ants * needlesPerAnt * needlesPerMilSec * millisecondsFromLastFrame;
}   

function updateUpgrades() {
    
}

function updateTexts(){
    //update text
    textAnts.text = "Ants: " + Math.floor(ants);
    textFood.text = "Food: " + Math.floor(food);
    textNeedles.text = "Needles: " + Math.floor(needles);
    textAntsPerSec.text = 
        "Ants Per Second: " + (antsPerMilSec * 1000).toFixed(2);
    textFoodPerSec.text = 
        "Food Per Second: " + (foodPerMilSec * ants * 1000).toFixed(1);
    textNeedlesPerSec.text = 
        "Needles Per Second: " + (needlesPerMilSec * ants * 1000).toFixed(1);
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
        if (isInsideObjectSprite(input.x, input.y, antQueen)){
            //console.log('click!');
            onQueen();            
        }
        for (var i = 0; i < upgradesContainer.upgrades.length; i++){
            if (isInsideObjectSprite(input.x, input.y, upgradesContainer.upgrades[i])){
                if(upgradesContainer.upgrades[i] != undefined){
                    upgradesContainer.upgrades[i].buy();
                }
            }
        }
    }
    //touch
    else if (game.input.pointer1.isDown){
        if (isInsideObjectSprite(input.x, input.y, antQueen)){
            //console.log("tap!");
            onQueen();
            upgradesContainer.upgrades[0].buy();
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

function onQueen(){
    antQueen.animations.play('jump', 10, false);
    audioSqueak.play();
    ants += antsPerClick;
}

//Check if the parameter coordinates are on top of the queen-ant
function isInsideQueenSprite(x, y){
    if (Phaser.Rectangle.contains( antQueen.getBounds(), x, y)) {
        return true;
    }
    return false;
}

function isInsideObjectSprite(x, y, object){
    if (Phaser.Rectangle.contains( object.getBounds(), x, y)) {
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
    var width = game.width * 0.4;
    var height = game.height * 0.785;
    //var height = game.height - (topRightY + padding);

    //create BG bitmap
    var bmd = game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#7f4934';
    bmd.ctx.fill();

    //create sprite
    upgradesContainer = game.add.sprite(game.width - padding, 100 + padding, bmd);
    //upgradesContainer.alpha = 0.3;
    upgradesContainer.anchor.setTo(1, 0);

    //init upgrade-array
    upgradesContainer.upgrades = [];
    upgradesContainer.padding = 10;

    initUpgrades();
}

function initUpgrades(){  
    
    upgradesContainer.upgrades[UPGRADES.antsPerMilSec] = 
        new Upgrade(UPGRADES.antsPerMilSec, "ants per mil sec", 10000, 10000);
    upgradesContainer.addChild(upgradesContainer.upgrades[UPGRADES.antsPerMilSec]);

    upgradesContainer.upgrades[UPGRADES.foodPerMilSec] = 
        new Upgrade(UPGRADES.foodPerMilSec, "food per mil sec", 500, 500);
    upgradesContainer.addChild(upgradesContainer.upgrades[UPGRADES.foodPerMilSec]);
///combine
    upgradesContainer.upgrades[UPGRADES.needlesPerMilSec] = 
        new Upgrade(UPGRADES.needlesPerMilSec, "needles per mil sec", 500, 500);
    upgradesContainer.addChild(upgradesContainer.upgrades[UPGRADES.needlesPerMilSec]);

    upgradesContainer.upgrades[UPGRADES.antsPerClick] = 
        new Upgrade(UPGRADES.antsPerClick, "ants per click", 100, 500); //change this
    upgradesContainer.addChild(upgradesContainer.upgrades[UPGRADES.antsPerClick]);

    upgradesContainer.upgrades[UPGRADES.foodPerAnt] = 
        new Upgrade(UPGRADES.foodPerAnt, "food per ant", 10, 10);
    upgradesContainer.addChild(upgradesContainer.upgrades[UPGRADES.foodPerAnt]);

    upgradesContainer.upgrades[UPGRADES.needlesPerAnt] = 
        new Upgrade(UPGRADES.needlesPerAnt, "needles per ant", 20, 20);
    upgradesContainer.addChild(upgradesContainer.upgrades[UPGRADES.needlesPerAnt]);
    
    /*
    for (var i = 0; i < Object.keys(UPGRADES).length; i++){

        var keys = Object.keys(UPGRADES);

        upgradesContainer.upgrades[i] = 
            new Upgrade(i, keys[i], 20, 10);
        upgradesContainer.addChild(upgradesContainer.upgrades[i]);
    }
    */
}

function Upgrade(type, name, cost, interest){
    var width = upgradesContainer.width - (upgradesContainer.padding * 2);
    var height = 70;  

    var x = -upgradesContainer.width + upgradesContainer.padding;
    var y = (height * type) + upgradesContainer.padding + (upgradesContainer.padding * type); 

    //create BG bitmap
    var bmd = game.add.bitmapData(width, height);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#e07247';
    bmd.ctx.fill();

    //create sprite
    var upgrade = game.add.sprite(x, y, bmd);

    upgrade.width = width;
    upgrade.height = height;   

    upgrade.type = type;
    upgrade.name = name;
    upgrade.cost = cost;
    upgrade.interest = interest;
    upgrade.buy = createBuyFunction(upgrade.type, upgrade.cost, upgrade.interest);
    
    upgrade.text = game.add.text(upgradesContainer.padding, upgradesContainer.padding, 
        upgrade.name + "\nFood cost: " + upgrade.cost, textConfiguration);
    upgrade.addChild(upgrade.text);

    return upgrade;
}

function createBuyFunction(type, cost, interest){
    var buyFunction;

        buyFunction = 
                function(){
                    if (food >= cost){
                        //Buy succesfull
                        food = food - cost;
                        antsPerClick = antsPerClick + 1;

                    }else{
                        console.log("Not enough food!");
                    }
                };
            break;
    /*
    switch(type){
        case UPGRADES.antsPerMilSec:
            buyFunction = 
                function(){
                    if (food >= cost){
                        //Buy succesfull
                        food = food - cost;
                        antsPerClick = antsPerClick + 1;

                    }else{
                        console.log("Not enough food!");
                    }
                };
            break;
    }
    */

    return buyFunction;
}