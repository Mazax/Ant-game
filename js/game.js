
var game = new Phaser.Game(600, 800, Phaser.AUTO, null, {
      preload: preload, create: create, update: update, render: render
    });


const GAME_VERSION = "03";

    ///game variables///

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

    //game variables

    //resources
    var ants;
    var food;
    var needles;

    //amount per second
    var antsPerMilSec;

    //resources per second produced by an ant
    var foodPerAnt;
    var needlesPerAnt;

    var upgradeCost = 10;

    ///// preload //////
    function preload() {
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

    ///// create /////
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

        upgradeButton = game.add.button(
                game.width*0.9, 300, "upgradeSprites", upgrade, this, 0, 0, 1
            );
        upgradeButton.anchor.set(0.5, 0.5);

        audioSqueak = game.add.audio('audioSqueak');
        audioUpgradeSqueak = game.add.audio('audioUpgradeSqueak');
        /*
        //animation test
        box = game.add.sprite(game.width/2, game.height/2, 
        'boxAnimation');
        box.animations.add("move", [0, 1, 2]);
        */
    }

    function upgrade() {
        
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
    }

    ///// update /////
    function update() {

        //animation test
        //box.animations.play("move", 10, true);

        //Update game variables
        updateResources(game.time.elapsed);
        //Update gui
        updateTexts();        
    }

    function render() {

        //Input debug
        //  Just renders out the pointer data when you touch the canvas
        //game.debug.pointer(game.input.mousePointer);
        //game.debug.pointer(game.input.pointer1);
        //game.debug.pointer(game.input.pointer2);

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

    //onClick is called when left mouse button is pressed 
    function onClick(input){
        //Mmuse left
        if (game.input.activePointer.isMouse){
            if (onQueen(input.x, input.y)) {
                console.log('click!');
                audioSqueak.play();
                ants += 1;
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