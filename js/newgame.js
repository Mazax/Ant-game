


var antGame = {
    
    game: antGame,

    /*
    GAME_VERSION: "05",

        /// ASSETS ///

    //Sprites and spritesheets
    spr_antQueen: null,
    spr_guiTopBox: null,
    spr_guiUpgradeButton: null,

    //Audio
    aud_squeak: null,
    aud_upgrade: null,
    
        /// GUI ///
    
    //gui elements
    gui_topBox: null,
    gui_upgradeButton: null,

    //text
    text_ants: "",
    text_food: "",
    text_needles: "",

    text_antsPerSec: "",
    text_foodPerSec: "",
    text_needlesPerSec: "",   


        /// GAME OBJECTS ///
    
    //game objects
    antQueen: null,

    //resource variables
    ants: 0,
    food: 0,
    needles: 0,

    antsPerSec: 0,
    foodPerAnt: 0.3,
    needlesPerAnt: 0.1,

    //upgrade variables
    upgrades: null,
    */


    ////////////////////
    ///// preload //////
    ////////////////////

    preload: function(){

        /*
        //load plugis

            /// setup game ///

        this.game.stage.disableVisibilityChange = true;
        //setup screen
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.stage.backgroundColor = '#555555';

            /// load assets ///

        //sprites
        this.game.load.image('this.spr_guiTopBox', './assets/GUIBoxTop.png');

        //animations
        this.game.load.spritesheet('this.antQueen', './assets/AntQueen_Spritesheet_v1.png', 64, 64);
        this.game.load.spritesheet('this.spr_guiUpgradeButton', './assets/upgrade-animated-placeholder.png', 100, 30);

        //sound effects
        this.game.load.audio('this.aud_squeak', './assets/squeak.wav');
        this.game.load.audio('this.aud_upgrade', './assets/upgrade-squeak.wav');

        //Json
        //this.game.load.text('upgradesJson', '../upgrades.json');

        //input handle
        //this.game.input.onTap.add(this.onClick, this);
        */

        //this.game.load.spritesheet('this.spr_antQueen', './assets/AntQueen_Spritesheet_v1.png', 64, 64);
    },

    create: function(){

        //antQueen = game.add.sprite(0, 0, 'this.spr_antQueen');
    },
    update: function(){},
    render: function(){}

}