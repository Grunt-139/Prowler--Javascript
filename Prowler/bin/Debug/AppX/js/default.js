// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict"; 

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    //canvas stuff
    var gameCanvas;
    var gameCtx;

    //UI canvas for User interface things and overlays
    var uiCanvas;
    var uiCtx;

    //Touch Controls
    var startMove;
    var startX;
    var startY;

    var SIZE = 64;
    var TILE_SIZE = 64;

    var offSetX = window.innerWidth * 0.3;
    var offSetY = window.innerHeight * 0.2;

    var uiBarOffsetX = window.innerWidth * 0.4;
    var uiTextOffsetX = window.innerWidth * 0.3;
    var settlementIconOffsetX = window.innerWidth * 0.32;
    var settlementTextOffsetX;
    var scoreOffsetX;
    var iconOffsetX;

    //Main Menu
    //Buttons
    //Get menu elements
    //Buttons
    var playButton;
    var howToButton;
    var creditsButton;
    var backButton;
    //Views
    var mainMenu;
    var howTo;
    var credits;
    var playGameDiv;

    //World Map
    var worldMap = [
        [0, 0, 0, 0, 0],
        [0, 11, 13, 12, 0],
        [0, 14, 12, 14, 0],
        [0, 0, 0, 0, 0],
    ];

    var buildingMap= [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 21, 0],
        [0, 0, 21, 0, 0],
        [0, 0, 0, 0, 0],
    ];

    var playerRow = 0;
    var playerColumn = 0;
    var prevRow = 0;
    var prevColumn = 0;
    
    //Inside Areas
    var BUILDING = 21;
    var BUILDING_ENTRANCE_1 = 22;
    var BUILDING_1 = 23;

    //Outside areas
    var SETTLEMENT_MAP = 11;
    var WASTE_1 = 12;
    var WASTE_2 = 13;
    var WASTE_3 = 14;

    //Arrays for specific objects
    var enemies = [];
    var dead = [];
    var pickUps = [];
    var doors = [];
    var terrain = [];
    var sprites = [];
    var bullets = [];
    

    //Objectives
    var objective = 1;

    //Icons
    var i_WinterClothing;
    var i_ChemicalSuit;
    var i_Armour;
    var i_Food;
    var i_Medkit;

    //Settlement Icons
    var s_WinterClothing;
    var s_ChemicalSuit;
    var s_Armour;
    var s_Gun;

    //Canvas/Context for the Medkit Icon
    var i_MedkitCanvas;
    var i_MedkitCtx;

    //Canvas/Context for the food Icon
    var i_FoodCanvas;
    var i_FoodCtx;

    //Canvas for upgrades
    var settlementCanvas;
    var settlementCtx;

    var chemCanvas;
    var chemCtx;

    var gunCanvas;
    var gunCtx;

    var winterCanvas;
    var winterCtx;

    var armourCanvas;
    var armourCtx;

    var backCanvas;
    var backCtx;

    //Cost variables
    var chemCost = 15;
    var gunCost = 10;
    var winterCost = 10;
    var armourCost = 25;

    //Descriptions
    var gunDescription = "";
    var chemDescription = "";
    var winterDescription = "";
    var armourDescription = "";

    //Touch Controls
    var moveCanvas;
    var moveCtx;
    var fireCanvas;
    var fireCtx;

    //Enviromental/Survival Variables
    var starvationTimer;
    var freezingTimer;
    var chemicalTimer;

    var weatherChangeTimer;

    var weatherShiftDelay = 5000;
    var starvationDelay = 1500;
    var freezingDelay = 1000;
    var chemDelay = 5000;

    var isSnowing = false;
    var isRaining = false;
    var isInside = false;

    var environmentCanvas;
    var environmentCtx;

    var environmentShiftTimer;
    var environmentShiftDelay = 800;
    var environmentPosition = -8;

    var curMap = [];
    var curWorldMap = worldMap;

    //The number of rows and columns
    var ROWS = 10;
    var COLUMNS = 10;

    //Arrow key codes
    var UP = 38;
    var DOWN = 40;
    var RIGHT = 39;
    var LEFT = 37;
    var SPACE = 32;

    //Move
    var moveUp = false;
    var moveDown = false;
    var moveLeft = false;
    var moveRight = false;
    var canShoot = true;

    var tileSheetColumns = 10;
    var tileSheetRows = 10;

    

    //Tile Sheet Coordinates

    var EMPTY = 0;

    //Buildings
    var B_ROOF = 41;
    var B_RIGHT = 42;
    var B_Left = 43;
    var B_UP = 44;
    var B_DOWN = 45;

    //Corners
    var B_BOTTOM_RIGHT = 51;
    var B_BOTTOM_LEFT = 52;
    var B_TOP_RIGHT = 53;
    var B_TOP_LEFT = 54;

    var DOOR_LEFT = 61;
    var DOOR_RIGHT = 62;
    var DOOR_UP = 63;
    var DOOR_DOWN = 64;

    //Floors and Walls
    var B_FLOOR = 71;
    var G_FLOOR = 72;
    var B_WALL = 79;

    //OUTSIDE
    var G_FLAT = 73;
    var G_UP = 74;
    var G_TOP_LEFT = 75;
    var G_TOP_RIGHT = 76;
    var G_BOTTOM_LEFT = 77;
    var G_BOTTOM_RIGHT = 78;

    //Settlement
    var SAFE_ZONE = 94;

    //Object
    var safeZone;

    //ICONS
    var I_CHEM = 81;
    var I_DCHEM = 82;
    var I_WINTER = 83;
    var I_DWINTER = 84;
    var I_ARMOUR = 85;
    var I_DARMOUR = 86;
    var I_MEDKIT = 87;
    var I_DMEDKIT = 88;
    var I_FOOD = 89;
    var I_DFOOD = 91;
    var I_GUN = 92;
    var I_DGUN = 93;

    //PICK UPS
    var COMMON = 31;
    var UNCOMMON = 32;
    var RARE = 33;
    var MEDKIT = 34;
    var FOOD = 35;

    //PLAYER and Enemy
    var PLAYER = 10;
    var ENEMY = 20;


    //Player object
    var player;
    

    //Character States
    var C_DOWN = 0;
    var C_UP = 1;
    var C_LEFT = 2;
    var C_RIGHT = 3;
    var C_45 = 4;
    var C_135 = 5;
    var C_225 = 6;
    var C_270 = 7;
    var C_DEAD = 8;


    //Game states
    var MENU = 0;
    var LOADING = 1;
    var BUILD_MAP = 2;
    var PLAYING = 3;
    var SETTLEMENT = 4;
    var PAUSED = 5;
    var OVER = 6;

    var gameState = MENU;

    var upgradeBegin = false;
    var upgradeEnd = false;

    var gameStarted = false;

    var gameRestart = false;

    //Death Handler
    var deathTimer;

    //Asset Loader
    var assetsToLoad = [];
    var assetsLoaded = 0;
    var loadingDone = false;
    //Load the tilesheet image
    var image = new Image();
    image.src = "../images/TileSheet.png";
    image.addEventListener("load", loadHandler,false);
    assetsToLoad.push(image);
    //Load pause image
    var pauseImage = new Image();
    pauseImage.src = "../images/pause.png";
    pauseImage.addEventListener("load", loadHandler,false);
    assetsToLoad.push(pauseImage);
    //Load rain Image
    var rainImage = new Image();
    rainImage.src = "../images/rain.png";
    rainImage.addEventListener("load", loadHandler, false);
    assetsToLoad.push(rainImage);
    //Load snow image
    var snowImage = new Image();
    snowImage.src = "../images/snow.png";
    snowImage.addEventListener("load", loadHandler, false);
    assetsToLoad.push(snowImage);

    //Sounds
    var music;
    var ambience;
    var gunShot;
    var hit;
    var monsterAttack;
    var monsterDeath1;
    var monsterDeath2;
    var monsterDamage;
    var playerDamage;
    var playerDeath;

    //Push sounds into asset loader
    assetsToLoad.push(music);
    assetsToLoad.push(ambience);
    assetsToLoad.push(gunShot);
    assetsToLoad.push(hit);
    assetsToLoad.push(monsterAttack);
    assetsToLoad.push(monsterDeath1);
    assetsToLoad.push(monsterDeath2);
    assetsToLoad.push(monsterDamage);
    assetsToLoad.push(playerDamage);
    assetsToLoad.push(playerDeath);

    //Animation Handle
    var updateId = null;

    //Add keyboard listeners
    window.addEventListener("keydown", function (event) {
        if (gameStarted) {
            switch (event.keyCode) {
                case UP:
                    moveUp = true;
                    break;

                case DOWN:
                    moveDown = true;
                    break;

                case LEFT:
                    moveLeft = true;
                    break;

                case RIGHT:
                    moveRight = true;
                    break;

                case SPACE:
                    if (canShoot) {
                        canShoot = false;
                        shoot();
                    }
                    break;
            }
        };
    }, false);

    window.addEventListener("keyup", function (event) {
        if (gameStarted) {
            switch (event.keyCode) {
                case UP:
                    moveUp = false;
                    break;

                case DOWN:
                    moveDown = false;
                    break;

                case LEFT:
                    moveLeft = false;
                    break;

                case RIGHT:
                    moveRight = false;
                    break;

                case SPACE:
                    canShoot = true;
                    break;
            }
        };
    }, false);

    window.addEventListener("resize", onViewStateChanged);

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                init();


            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    //This Function will check if the view state is snapped. 
    //If it is we set our gamestate to paused. 
    function onViewStateChanged() {
        var viewStates = Windows.UI.ViewManagement.ApplicationViewState, msg;
        var newViewState = Windows.UI.ViewManagement.ApplicationView.value;

        if (newViewState === viewStates.snapped) {
            gameState = PAUSED;
            clearInterval(starvationTimer);
            clearInterval(freezingTimer);
            clearInterval(chemicalTimer);
        } else {
            gameState = PLAYING;
            starvationTimer = setInterval(starvationHandler, starvationDelay);
            freezingTimer = setInterval(freezingHandler, freezingDelay);
            chemicalTimer = setInterval(rainingHandler, chemDelay);
        };
    }
    
    function init() {
        //Get menu elements
        //Buttons
        playButton = document.getElementById("playButton");
        howToButton = document.getElementById("howToButton");
        creditsButton = document.getElementById("creditsButton");
        backButton = document.getElementById("backButton");
        //Views
        mainMenu = document.getElementById("menuItems");
        howTo = document.getElementById("howTo");
        credits = document.getElementById("credits");
        playGameDiv = document.getElementById("playGame");

        //Set listeners
        playButton.addEventListener("click", playHandler);

        howToButton.addEventListener("click", howToHandler);
        creditsButton.addEventListener("click", creditHandler);
        backButton.addEventListener("click", menuBackHandler);

        howTo.style.display = "none";
        credits.style.display = "none";
        backButton.style.display = "none";
        playGameDiv.style.display = "none";
    };


    function startGame() {
        //Sounds
        //Music
        music = document.querySelector("#music");
        music.addEventListener("canplaythrough", loadHandler, false);
        music.load();
        //Ambience
        ambience = document.querySelector("#ambience");
        ambience.addEventListener("canplaythrough", loadHandler, false);
        ambience.load();
        //Gunshot
        gunShot = document.querySelector("#gunShot");
        gunShot.addEventListener("canplaythrough", loadHandler, false);
        gunShot.load();
        //Hit
        hit = document.querySelector("#hit");
        hit.addEventListener("canplaythrough", loadHandler, false);
        hit.load();
        //Monster Attack
        monsterAttack = document.querySelector("#monsterAttack");
        monsterAttack.addEventListener("canplaythrough", loadHandler, false);
        monsterAttack.load();
        //Monster Death 1
        monsterDeath1 = document.querySelector("#monsterDeath1");
        monsterDeath1.addEventListener("canplaythrough", loadHandler, false);
        monsterDeath1.load();
        //Monster death 2
        monsterDeath2 = document.querySelector("#monsterDeath2");
        monsterDeath2.addEventListener("canplaythrough", loadHandler, false);
        monsterDeath2.load();
        //Monster Damage
        monsterDamage = document.querySelector("#monsterDamage");
        monsterDamage.addEventListener("canplaythrough", loadHandler, false);
        monsterDamage.load();
        //Player Hit
        playerDamage = document.querySelector("#playerDamage");
        playerDamage.addEventListener("canplaythrough", loadHandler, false);
        playerDamage.load();
        //Player Death
        playerDeath = document.querySelector("#playerDeath");
        playerDeath.addEventListener("canplaythrough", loadHandler, false);
        playerDeath.load();

        


        //Set up game canvas
        gameCanvas = document.getElementById("gameCanvas");
        gameCtx = gameCanvas.getContext("2d");

        gameCtx.canvas.width = COLUMNS * SIZE;
        gameCtx.canvas.height = ROWS * SIZE;

        gameCanvas.style.top = offSetY + "px";
        gameCanvas.style.left = offSetX + "px";

        //Set up UI canvas
        uiCanvas = document.createElement("canvas");
        uiCanvas.setAttribute("width", TILE_SIZE);
        uiCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(uiCanvas);
        uiCtx = uiCanvas.getContext("2d");

        uiCtx.canvas.width = window.innerWidth;
        uiCtx.canvas.height = window.innerHeight;


        //Set up environment Canvas
        environmentCanvas = document.createElement("canvas");
        environmentCanvas.setAttribute("width", COLUMNS *SIZE);
        environmentCanvas.setAttribute("height", ROWS * SIZE);
        playGameDiv.appendChild(environmentCanvas);
        environmentCtx = environmentCanvas.getContext("2d");

        environmentCtx.canvas.width = COLUMNS * SIZE;
        environmentCtx.canvas.height = ROWS * SIZE;

        environmentCanvas.style.top = offSetY + "px";
        environmentCanvas.style.left = offSetX + "px";

        update();
        gameState = LOADING;

    };

    function loadHandler() {
        assetsLoaded++;
        console.log(assetsLoaded + " " + assetsToLoad.length);
        if (assetsLoaded === assetsToLoad.length) {
            //Remove the load handlers
            image.removeEventListener("load", loadHandler, false);
            pauseImage.removeEventListener("load", loadHandler, false);
            snowImage.removeEventListener("load", loadHandler, false);
            rainImage.removeEventListener("load", loadHandler, false);

            //Sounds
            music.removeEventListener("canplaythrough", loadHandler, false);
            ambience.removeEventListener("canplaythrough", loadHandler, false);
            gunShot.removeEventListener("canplaythrough", loadHandler, false);
            hit.removeEventListener("canplaythrough", loadHandler, false);
            monsterAttack.removeEventListener("canplaythrough", loadHandler, false);
            monsterDeath1.removeEventListener("canplaythrough", loadHandler, false);
            monsterDeath2.removeEventListener("canplaythrough", loadHandler, false);
            monsterDamage.removeEventListener("canplaythrough", loadHandler, false);
            playerDamage.removeEventListener("canplaythrough", loadHandler, false);
            playerDeath.removeEventListener("canplaythrough", loadHandler, false);

            music.play();
            music.volume = 0.3;

            //Allow the game to continue
            loadingDone = true;
        };
    };

    //Handlers
    //************************************************************************
    //Menu Handlers
    function playHandler() {
        mainMenu.style.display = "none";
        playGameDiv.style.display = "inline";
        if (!gameRestart) {
            startGame();
        }
        else if (gameRestart) {
            gameState = LOADING;
            update();
        };
    };

    function howToHandler() {
        mainMenu.style.display = "none";
        howTo.style.display = "inline";
        backButton.style.display = "block";
       
    };

    function creditHandler() {
        mainMenu.style.display = "none";
        credits.style.display = "inline";
        backButton.style.display = "block";
    };

    function menuBackHandler() {
        mainMenu.style.display = "inline";
        backButton.style.display = "none";
        howTo.style.display = "none";
        credits.style.display = "none";
       
    };

    //Game Handlers
    function foodHandler() {
        if (player.food != 0 && gameStarted) {
            player.eat(player.hunger *0.5);
            player.heal(player.health * 0.1);
            player.food--;
        };
    };

    function medkitHandler() {
        if (player.medKits && player.health != player.maxHealth && gameStarted) {
            player.heal(player.maxHealth);
            player.medKits--;
        };
    };

    function chemUpgrade() {
        switch (player.chemUpgradeLevel) {
            case 0:
                if (player.money > chemCost) {
                    player.money -= chemCost;
                    //Initial purchase
                    player.chemicalSuit = true;
                    //Set the new Cost
                    chemCost = 10;
                    player.chemUpgradeLevel++;
                };
                break;
            case 1:
                if (player.money > chemCost) {
                    player.money -= chemCost;
                    //Increase of 10% defense
                    player.chemicalSuitDefense -= 0.1;
                    //Set the new cost
                    chemCost = 15;
                    player.chemUpgradeLevel++;
                };
                break;
            case 2:
                
                if (player.money > chemCost) {
                    player.money -= chemCost;
                    //Increase of 10% defense
                    player.chemicalSuitDefense -= 0.1;
                    //Set the new cost
                    chemCost = 20;
                    player.chemUpgradeLevel++;
                };
                break;
            case 3:
                if (player.money > chemCost) {
                    player.money -= chemCost;
                    //10% increase in defense
                    player.chemicalSuitDefense -= 0.1;
                    player.chemUpgradeLevel++;
                };
                break;
        };
    };

    function winterUpgrade() {
        switch (player.winterUpgradeLevel) {
            case 0:
                if (player.money > winterCost) {
                    player.money -= winterCost;
                    //Give the player a coat
                    player.winterSuit = true;
                    //Increase cost
                    winterCost = 10;
                    player.winterUpgradeLevel++;
                };
                break;
            case 1:
                if (player.money > winterCost) {
                    player.money -= winterCost;
                    //10% increase in defense
                    player.winterSuitDefense -= 0.1;
                    //Increase cost
                    winterCost = 15;
                    player.winterUpgradeLevel++;
                };
                break;
            case 2:
                if (player.money > winterCost) {
                    player.money -= winterCost;
                    //10% increase in defense
                    player.winterSuitDefense -= 0.1;
                    //Increase cost
                    winterCost = 20;
                    player.winterUpgradeLevel++;
                };
                break;
            case 3:
                if (player.money > winterCost) {
                    player.money -= winterCost;
                    //10% increase in defense
                    player.winterSuitDefense -= 0.1;
                    player.winterUpgradeLevel++;
                };
                break;
        };
    };

    function gunUpgrade() {
        switch (player.gunUpgradeLevel) {
            case 0:
                if (player.money > gunCost) {
                    player.money -= gunCost;
                    //25 percent increase in damage
                    player.damage = Math.ceil((player.damage * 1.25));
                    //Increase cost
                    gunCost = 15;
                    player.gunUpgradeLevel++;
                };
                break;
            case 1:
                if (player.money > gunCost) {
                    player.money -= gunCost;
                    //25 percent decrease in spread
                    player.spread *= 0.75;
                    //Increase cost
                    gunCost = 20;
                    player.gunUpgradeLevel++;
                };
                break;
            case 2:
                if (player.money > gunCost) {
                    player.money -= gunCost;
                    //25 percent increase in damage
                    player.damage = Math.ceil((player.damage * 1.25));
                    //Increase cost
                    gunCost = 25;
                    player.gunUpgradeLevel++;
                };
                break;
            case 3:
                if (player.money > gunCost) {
                    player.money -= gunCost;
                    //no spread
                    player.spread = 0;
                    player.gunUpgradeLevel++;
                };
                break;
        };
    };

    function armourUpgrade() {
        switch (player.armourUpgradeLevel) {
            case 0:
                if (player.money > armourCost) {
                    player.money -= armourCost;
                    //Heres a coat
                    player.armour = true;
                    //Increase cost
                    armourCost = 10;
                    player.armourUpgradeLevel++;
                };
                break;
            case 1:
                if (player.money > armourCost) {
                    player.money -= armourCost;
                    //10 % increase in defense
                    player.armourDefense -= 0.1;
                    //Increase cost
                    armourCost = 15;
                    player.armourUpgradeLevel++;
                };
                break;
            case 2:
                if (player.money > armourCost) {
                    player.money -= armourCost;
                    //10 % increase in defense
                    player.armourDefense -= 0.1;
                    //Increase cost
                    armourCost = 25;
                    player.armourUpgradeLevel++;
                };
                break;
            case 3:
                if (player.money > armourCost) {
                    player.money -= armourCost;
                    //10 % increase in defense
                    player.armourDefense -= 0.1;
                    player.armourUpgradeLevel++;
                };
                break;
        };
    };

    function backHandler() {
        upgradeEnd = true;;
    };

    //Touch Handlers
    function fireTouchHandler() {
        shoot();
    };

    function moveTouchHandler() {
        //If the game is playing
        if (gameStarted && startX==null && startY ==null) {
            console.log("touch");
            startX = event.x;
            startY = event.y;
            console.log("Start x: " + startX + " Start y: " + startY)
            moveCanvas.addEventListener("mousemove", moveSlideTouchHandler, false);
        };
    };

    function moveSlideTouchHandler() {
        console.log("Start x: " + startX + " Start Y:  " + startY + " Move x: " + event.x + " Move y: " + event.y);
        if(startX !=null && startY != null){
            if (event.x > startX) {
                moveRight = true;
                moveLeft = false;
            };

            if (event.x < startX) {
                moveLeft = true;
                moveRight = false;
            };

            if (event.y > startY) {
                moveDown = true;
                moveUp = false;
            };

            if (event.y < startY) {
                moveUp = true;
                moveDown = false;
            };
        };
        moveCanvas.addEventListener("mouseup", moveMouseUpHandler,false);
    };

    function moveMouseUpHandler() {
        //  console.log("up");

        moveUp = false;
        moveDown = false;
        moveRight = false;
        moveLeft = false;

        startX = null;
        startY = null;

        moveCanvas.removeEventListener("mouseMove", moveSlideTouchHandler,false);
        moveCanvas.removeEventListener("mouseup", moveMouseUpHandler,false);
    };

    //Death Handler for enemies
    function deathHandler() {
        if (dead.length != 0) {
            for (var d = 0; d < dead.length; d++) {

                if (dead[d].alpha > 0.1) {
                    dead[d].alpha -= 0.1;
                };

                if (dead[d].alpha <= 0.1) {
                    dead.splice(d, 1);
                };

            };
        }
        else {
            clearInterval(deathTimer);
        };
    };


    //Survival Handlers

    function drawEnvironment() {
        
        environmentCtx.clearRect(0, 0, environmentCtx.canvas.width, environmentCtx.canvas.height);
        if (isRaining && !isInside) {
            environmentCtx.drawImage(rainImage, environmentPosition * SIZE, environmentPosition * SIZE, environmentCtx.canvas.width, environmentCtx.canvas.height);
        };

        if (isSnowing && !isInside) {
            environmentCtx.drawImage(snowImage, environmentPosition * SIZE, environmentPosition * SIZE, environmentCtx.canvas.width, environmentCtx.canvas.height);
        };

        

    };

    //Shift the environment context
    function environmentShift() {
        if (gameStarted) {
            environmentPosition++;
            if (environmentPosition == 8) {
                environmentPosition = -8;
            };
        };
    };

    function starvationHandler() {
        player.starve();
    };

    function freezingHandler() {
        if (isSnowing && !isInside) {
            player.freeze();
        }
        else if (!isSnowing || isInside) {
            player.warm();
        };
    };

    function rainingHandler() {
        if (isRaining && !isInside) {
            player.chemicalBurn();
            playerDamage.currentTime = 0;
            playerDamage.play();
            playerDamage.volume = 0.1;
        };
    };

    function weatherChange() {
        //Set the isRaining and isSnowing to false
        if (gameStarted) {

            isRaining = false;
            isSnowing = false;
            environmentCtx.clearRect(0, 0, environmentCtx.canvas.width, environmentCtx.canvas.height);

            var random = Math.floor(Math.random() * 10);
            //Randomly says whether its raining or snowing
            if (random <= 3) {
                isRaining = true;
            };
            if (random < 7 && random > 3) {
                isSnowing = true;
            };

            weatherShiftDelay = Math.floor(5000 + (Math.random() * 20000 - 5000) + 1);

            weatherChangeTimer = setTimeout(weatherChange, weatherShiftDelay);
        };
    };

    //Player shooting
    function shoot() {
        if (player != null && gameStarted) {
            var bullet = Object.create(spriteObject);
            bullet.x = player.centerX();
            bullet.y = player.centerY();
            bullet.speed = 5;
            //Based off the players direction
            //Set the bullets vx and vy
            switch (player.direction) {
                case 0: //down
                    bullet.vx = player.getSpread();
                    bullet.vy = bullet.speed;
                    break;
                case 1: //up
                    bullet.vx = player.getSpread();
                    bullet.vy = -bullet.speed ;
                    break;
                case 2: //left
                    bullet.vx = -bullet.speed;
                    bullet.vy = player.getSpread();
                    break;
                case 3: //right
                    bullet.vx = bullet.speed;
                    bullet.vy = player.getSpread();
                    break;
                case 4: //45
                    bullet.vx = bullet.speed;
                    bullet.vy = -bullet.speed + player.getSpread();
                    break;
                case 5: //135
                    bullet.vx = bullet.speed;
                    bullet.vy = bullet.speed + player.getSpread();
                    break;
                case 6: //225
                    bullet.vx = -bullet.speed;
                    bullet.vy = bullet.speed + player.getSpread();
                    break;
                case 7: //270
                    bullet.vx = -bullet.speed;
                    bullet.vy = -bullet.speed + player.getSpread();
                    break;

            };
            bullet.width = 2;
            bullet.height = 2;
            bullets.push(bullet);

            gunShot.currentTime = 0;
            gunShot.play();
            gunShot.volume = 0.1;
        };
    };
    //*****************************************************************************************************

    function playGame() {

        //Updates
        playerUpdate();
        bulletUpdate();
        enemyUpdate();

        //Collisions
        playerCollisions();
        enemyCollisions();
        bulletCollisions();

        //Clear the screen
        gameCtx.clearRect(0, 0, gameCtx.canvas.width, gameCtx.canvas.height);
        uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);

        //Draw the UI elements
        drawUI();
        //Draw the game elements
        drawGame();
       
       
    };
    
    function update() {

        updateId = requestAnimationFrame(update, gameCanvas);

       //console.log(gameState);
        //Change what the game is doing based on the game state
        switch (gameState) {
            case MENU:
                break;
            case LOADING:
                createMaps(worldMap);
                createMaps(buildingMap);
                if (loadingDone) {
                    gameState = BUILD_MAP;
                };
                break;

            case BUILD_MAP:
                //Kill the arrays
                enemies = [];
                dead = [];
                pickUps = [];
                doors = [];
                terrain = [];
                sprites = [];
                bullets = [];
                //Kill the safe zone
                safeZone = null;
               // console.log(curMap.id);
                buildMap(curMap, false);
                buildMap(curMap, true);
                buildUI();
                buildSettlementUI();



                gameState = PLAYING;

                if (!gameStarted) {
                    starvationTimer = setInterval(starvationHandler, starvationDelay);
                    freezingTimer = setInterval(freezingHandler, freezingDelay);
                    chemicalTimer = setInterval(rainingHandler, chemDelay);
                    environmentShiftTimer = setInterval(environmentShift, environmentShiftDelay);
                    weatherChangeTimer = setTimeout(weatherChange, weatherShiftDelay);
                    gameStarted = true;
                    player.food++;

                    ambience.play();
                    ambience.volume = 0.2;
                };
                break;

            case PLAYING:
                playGame();
                if (isRaining || isSnowing) {
                    drawEnvironment();
                };

                if (player.health == 0) {
                    playerDeath.play();
                    gameState = OVER;
                };
                break;

            case SETTLEMENT:
                if (!upgradeBegin) {
                    upgradeBegin = true;
                    clearInterval(starvationTimer);
                    clearInterval(freezingTimer);
                    clearInterval(chemicalTimer);

                    //Create listeners
                    armourCanvas.addEventListener("click", armourUpgrade,false);
                    chemCanvas.addEventListener("click", chemUpgrade,false);
                    winterCanvas.addEventListener("click", winterUpgrade,false);
                    gunCanvas.addEventListener("click", gunUpgrade,false);
                    backCanvas.addEventListener("click", backHandler,false);

                    //Give the player Score and money
                    var remainder = objective;
                    for (var i = 0; i < player.rareRelics && remainder > 0; i++) {
                        player.money += 100;
                        player.score += 200;
                        remainder--;
                        player.rareRelics--;
                    };

                    for (var j = 0; j < player.uncommonRelics && remainder > 0; j++) {
                        player.money += 25;
                        player.score += 150;
                        remainder--;
                        player.uncommonRelics--;
                    };

                    for (var k = 0; k < player.commonRelics && remainder > 0; k++) {
                        player.money +=5;
                        player.score +=100;
                        remainder--;
                        player.commonRelics--;
                    };
                };
                
                settlement();

                if (upgradeEnd) {
                    gameState = PLAYING;
                    upgradeEnd = false;
                    upgradeBegin = false;

                    //Clear everything
                    settlementCtx.clearRect(0, 0, settlementCtx.canvas.width, settlementCtx.canvas.height);
                    backCtx.clearRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);
                    chemCtx.clearRect(0, 0, chemCtx.canvas.width, chemCtx.canvas.height);
                    winterCtx.clearRect(0, 0, winterCtx.canvas.width, winterCtx.canvas.height);
                    gunCtx.clearRect(0, 0, gunCtx.canvas.width, gunCtx.canvas.height);
                    armourCtx.clearRect(0, 0, armourCtx.canvas.width, armourCtx.canvas.height);
                    backCtx.clearRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);

                    //Kill the listeners
                    armourCanvas.removeEventListener("click", armourUpgrade,false);
                    chemCanvas.removeEventListener("click", chemUpgrade,false);
                    winterCanvas.removeEventListener("click", winterUpgrade,false);
                    gunCanvas.removeEventListener("click", gunUpgrade,false);
                    backCanvas.removeEventListener("click", backHandler,false);

                    //Set the new objective
                    if (objective < 10) {
                        objective += 2;
                        if (objective > 10) {
                            objective = 10;
                        };
                    };
                };

                break;

            case OVER:
                console.log("Death before dishonour!");
                endGame();
                break;
            case PAUSED:
                console.log("Paused");

                if (gameStarted) {
                    //Wipe the game and ui canvases
                    gameCtx.clearRect(0, 0, gameCtx.canvas.width, gameCtx.canvas.height);
                    uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
                    //Wipe the upgrade icons
                    chemCtx.clearRect(0, 0, chemCtx.canvas.width, chemCtx.canvas.height);
                    winterCtx.clearRect(0, 0, winterCtx.canvas.width, winterCtx.canvas.height);
                    gunCtx.clearRect(0, 0, gunCtx.canvas.width, gunCtx.canvas.height);
                    armourCtx.clearRect(0, 0, armourCtx.canvas.width, armourCtx.canvas.height);
                    //Wipe the back button
                    backCtx.clearRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);
                    //Wipe the settlement Canvases
                    settlementCtx.clearRect(0, 0, settlementCtx.canvas.width, settlementCtx.canvas.height);

                    //Wipe the medkit and food canvases
                    i_MedkitCtx.clearRect(0,0,i_MedkitCtx.canvas.width,i_MedkitCtx.canvas.height);
                    i_FoodCtx.clearRect(0,0,i_FoodCtx.canvas.width,i_FoodCtx.canvas.height);

                    //Wipe the controls
                    moveCtx.clearRect(0, 0, moveCtx.canvas.width, moveCtx.canvas.height);
                    fireCtx.clearRect(0, 0, fireCtx.canvas.width, fireCtx.canvas.height);
                    
                    uiCtx.canvas.width = window.innerWidth;
                    uiCtx.canvas.height = window.innerHeight;
                    uiCtx.drawImage(pauseImage, 0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
                };
                break;
        }

    };

    //Draw Functions
    //*****************************************************************************************************
    function drawGame() {
        gameCtx.save();
        gameCtx.lineWidth = 4;
       // gameCtx.translate(offSetX, offSetY);
        
        gameCtx.strokeRect(0, 0, COLUMNS * SIZE, ROWS * SIZE);
        //Display the sprites on the gameWorld
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];

            if (sprite.visible) {
                gameCtx.drawImage
                (
                  image,
                  sprite.sourceX, sprite.sourceY,
                  sprite.sourceWidth, sprite.sourceHeight,
                  Math.floor(sprite.x), Math.floor(sprite.y),
                  sprite.width, sprite.height
                );
            }
        };

        //Draw Enemies
        for (var e = 0; e < enemies.length; e++) {
            var enemy = enemies[e];
            gameCtx.drawImage
                    (
                      image,
                      enemy.sourceX, enemy.sourceY,
                      enemy.sourceWidth, enemy.sourceHeight,
                      Math.floor(enemy.x), Math.floor(enemy.y),
                      enemy.width, enemy.height
                    );
        };



        //Draw pickups
        for (var p = 0; p < pickUps.length; p++) {
            var pickup = pickUps[p];
            gameCtx.drawImage
                    (
                      image,
                      pickup.sourceX, pickup.sourceY,
                      pickup.sourceWidth, pickup.sourceHeight,
                      Math.floor(pickup.x), Math.floor(pickup.y),
                      pickup.width, pickup.height
                    );
        };

        //Draw the dead
        if (dead.length != 0) {
            for (var d = 0; d < dead.length; d++) {

                gameCtx.save();
                gameCtx.globalAlpha = dead[d].alpha;
                gameCtx.drawImage
                   (
                     image,
                     dead[d].sourceX, dead[d].sourceY,
                     dead[d].sourceWidth, dead[d].sourceHeight,
                     Math.floor(dead[d].x), Math.floor(dead[d].y),
                     dead[d].width, dead[d].height
                   );
                gameCtx.restore();
            };
        };

        //Draw the player
        if (player != null) {
            gameCtx.drawImage(
                          image,
                          player.sourceX, player.sourceY,
                          player.sourceWidth, player.sourceHeight,
                          Math.floor(player.x), Math.floor(player.y),
                          player.width, player.height
                        );
        };

        //Draw Safe Zone
        if (safeZone != null) {
            gameCtx.drawImage(
                          image,
                          safeZone.sourceX, safeZone.sourceY,
                          safeZone.sourceWidth, safeZone.sourceHeight,
                          Math.floor(safeZone.x), Math.floor(safeZone.y),
                          safeZone.width, safeZone.height
                        );
        };


        //Draw doors
        for (var d = 0; d < doors.length; d++) {
            var door = doors[d];
            gameCtx.drawImage
                    (
                      image,
                      door.sourceX, door.sourceY,
                      door.sourceWidth, door.sourceHeight,
                      Math.floor(door.x), Math.floor(door.y),
                      door.width, door.height
                    );
        };

        //Draw the health bars
        gameCtx.save();
      
        for (var e = 0; e < enemies.length; e++) {
           var healthLength = Math.floor((enemies[e].health / enemies[e].maxHealth)*50);
            
            //Outer Bar
            gameCtx.beginPath();
            gameCtx.rect(enemies[e].x - 10, enemies[e].y - 10, 50, 8);
            gameCtx.fillStyle = 'white';
            gameCtx.fill();
            gameCtx.lineWidth = 2;
            gameCtx.strokeStyle = 'black';
            gameCtx.stroke();

            //Inner bar
            gameCtx.fillStyle = "red";
            gameCtx.fillRect(enemies[e].x - 10, enemies[e].y - 10, healthLength, 8);
        };

        //Draw Bullets
        gameCtx.restore();
        gameCtx.save();
        gameCtx.fillStyle = "red";
        for (var b = 0; b < bullets.length; b++) {
            gameCtx.beginPath();
            gameCtx.arc(bullets[b].x, bullets[b].y, bullets[b].width, 0, 2 * Math.PI);
            gameCtx.fill();
        };
        gameCtx.restore();

        gameCtx.restore();

    };

    function drawUI() {

        uiCtx.canvas.width = window.innerWidth;
        uiCtx.canvas.height = window.innerHeight;

        uiCtx.save();

        //Icon Update
        iconUpdate();
        //Update the health, cold, temp bar
        barsUpdate(); 
        //Score Update
        scoreUpdate();
        //Touch Areas
        controlsUpdate();

        uiCtx.restore();
    };

    function drawSettlement() {

        var tempNewObjective = Math.ceil(objective * 1.25);
        settlementTextOffsetX = settlementCtx.canvas.width *0.25;

        //Winter Clothing
        if (player.winterUpgradeLevel == 4) {
            s_WinterClothing.sourceX = Math.floor((I_DWINTER % tileSheetRows) - 1) * TILE_SIZE;
        };

        //Chemical Suit
        if (player.chemUpgradeLevel == 4) {
            s_ChemicalSuit.sourceX = Math.floor((I_DCHEM % tileSheetColumns) - 1) * TILE_SIZE;
        };
        //Armour
        if (player.armourUpgradeLevel == 4) {
            s_Armour.sourceX = Math.floor((I_DARMOUR % tileSheetColumns) - 1) * TILE_SIZE;
        };
        //Gun
        if (player.gunUpgradeLevel == 4) {
            s_Gun.sourceX = Math.floor((I_DGUN % tileSheetColumns) - 1) * TILE_SIZE;
        };

        //Draw a square
        settlementCtx.save();


        settlementCtx.save();
        
        settlementCtx.fillStyle = "#333333";
        settlementCtx.fillRect(0, 0, ROWS * SIZE, COLUMNS * SIZE);
        settlementCtx.lineWidth = 4;
        settlementCtx.strokeRect(0, 0, ROWS * SIZE, COLUMNS * SIZE);
        settlementCtx.restore();

        settlementCtx.save();
        settlementCtx.font = "bold 15px arial";
        settlementCtx.fillText("Welcome back Prowler,", settlementCtx.canvas.width * 0.05, settlementCtx.canvas.height * 0.05);
        settlementCtx.fillText("Rearm, suit up and get back out there.", settlementCtx.canvas.width * 0.05, settlementCtx.canvas.height * 0.1);
        settlementCtx.fillText("Your next goal is " + tempNewObjective + " relics.", settlementCtx.canvas.width * 0.05, settlementCtx.canvas.height * 0.15);
        
        //Set the descriptions for the upgrades
        setDescriptions();
       

        settlementCtx.save();
        settlementCtx.font = "bold 20px arial";
        settlementCtx.fillText("Upgrades:", settlementCtx.canvas.width * 0.05, settlementCtx.canvas.height * 0.25);
        settlementCtx.restore();
        //Titles
        settlementCtx.fillText("Rifle Upgrade", settlementCtx.canvas.width * 0.06, settlementCtx.canvas.height * 0.29);
        settlementCtx.fillText("Chemical Suit", settlementCtx.canvas.width * 0.06, settlementCtx.canvas.height * 0.46);
        settlementCtx.fillText("Winter Clothing Upgrade", settlementCtx.canvas.width * 0.06, settlementCtx.canvas.height * 0.63);
        settlementCtx.fillText("Armour Upgrade", settlementCtx.canvas.width * 0.06, settlementCtx.canvas.height * 0.8);
        //Descriptions
        settlementCtx.fillText("Level  " + player.gunUpgradeLevel + ": " + gunDescription, settlementTextOffsetX, settlementCtx.canvas.height * 0.33);
        settlementCtx.fillText("Level  " + player.chemUpgradeLevel+ ": " + chemDescription, settlementTextOffsetX, settlementCtx.canvas.height * 0.5);
        settlementCtx.fillText("Level  " + player.winterUpgradeLevel + ": " + winterDescription, settlementTextOffsetX, settlementCtx.canvas.height * 0.68);
        settlementCtx.fillText("Level  " + player.armourUpgradeLevel + ": " + armourDescription, settlementTextOffsetX, settlementCtx.canvas.height * 0.84);

        settlementCtx.restore();

        settlementCtx.restore();
        chemCtx.drawImage(
                 image,
                  s_ChemicalSuit.sourceX, s_ChemicalSuit.sourceY,
                  s_ChemicalSuit.sourceWidth, s_ChemicalSuit.sourceHeight,
                  0, 0,
                  s_ChemicalSuit.width, s_ChemicalSuit.height
                  );

        winterCtx.drawImage(
                  image,
                  s_WinterClothing.sourceX, s_WinterClothing.sourceY,
                  s_WinterClothing.sourceWidth, s_WinterClothing.sourceHeight,
                  0, 0,
                  s_WinterClothing.width, s_WinterClothing.height
                  );

        gunCtx.drawImage(
                  image,
                  s_Gun.sourceX, s_Gun.sourceY,
                  s_Gun.sourceWidth, s_Gun.sourceHeight,
                  0, 0,
                  s_Gun.width, s_Gun.height);

        armourCtx.drawImage(image,
                  s_Armour.sourceX, s_Armour.sourceY,
                  s_Armour.sourceWidth, s_Armour.sourceHeight,
                  0, 0,
                  s_Armour.width, s_Armour.height); 

        //Back button
        backCtx.save();
        backCtx.fillStyle = "grey";
        backCtx.fillRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);
        backCtx.font = "20px bold arial";
        backCtx.fillStyle = "black";
        backCtx.fillText("Back to Game", backCtx.canvas.width * 0.25, backCtx.canvas.height * 0.49);
        backCtx.lineWidth = 6;
        backCtx.strokeRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);

        backCtx.restore();

        

    };

    function setDescriptions() {
        switch (player.chemUpgradeLevel) {
            case 0:
                chemDescription = "Cost: $"+ chemCost +" Buy a suit. 10% protection from Acid Rain";
                break;
            case 1:
                chemDescription = "Cost: "+ chemCost +" Upgrade your suit for an additional 10%.";
                break;
            case 2:
                chemDescription = "Cost: "+ chemCost +" Upgrade your suit for an additional 10%.";
                break;
            case 3:
                chemDescription = "Cost: " + chemCost + " Upgrade your suit for an additional 10%.";
                break;
            case 4:
                chemDescription = "Chemical suit is fully upgraded";
                chemCanvas.removeEventListener("click", chemUpgrade(),false);
                break;
        };
        switch (player.winterUpgradeLevel) {
            case 0:
                winterDescription = "Cost: $" + winterCost + " Buy a parka. 10% protection from the cold";
                break;
            case 1:
                winterDescription = "Cost: " + winterCost + " Upgrade your parka for an additional 10%.";
                break;
            case 2:
                winterDescription = "Cost: " + winterCost + " Upgrade your parka for an additional 10%.";
                break;
            case 3:
                winterDescription = "Cost: " + winterCost + " Upgrade your parka for an additional 10%.";
                break;
            case 4:
                winterDescription = "Winter Clothing is fully upgraded";
                winterCanvas.removeEventListener("click", winterUpgrade(),false);
                break;
        };
        switch (player.gunUpgradeLevel) {
            case 0:
                gunDescription = "Cost: $" + gunCost + " Heavier rounds, 25% increase in damage";
                break;
            case 1:
                gunDescription = "Cost: " + gunCost + " Match rounds, 10% decrease in spread";
                break;
            case 2:
                gunDescription = "Cost: " + gunCost + " Heavier Rounds, 25% increase in damage";
                break;
            case 3:
                gunDescription = "Cost: " + gunCost + " Match ammo, no spread";
                break;
            case 4:
                gunDescription = "Rifle fully upgraded";
                gunCanvas.removeEventListener("click", gunUpgrade(),false);
                break;
        };

     switch (player.armourUpgradeLevel) {
         case 0:
             armourDescription = "Cost: $" + armourCost + " Buy some body armour, 25% protection";
             break;
         case 1:
             armourDescription = "Cost: " + armourCost + " Upgrade your armour for an additional 10% protection.";
             break;
         case 2:
             armourDescription = "Cost: " + armourCost + " Upgrade your armour for an additional 10% protection.";
             break;
         case 3:
             armourDescription = "Cost: " + armourCost + " Upgrade your armour for an additional 10% protection.";
             break;
         case 4:
             armourDescription = "Armour fully upgraded";
             armourCanvas.removeEventListener("click", armourUpgrade(),false);
             break;
        };

    };

    function settlement() { 
        //Wipe the upgrade icons
        chemCtx.clearRect(0, 0, chemCtx.canvas.width, chemCtx.canvas.height);
        winterCtx.clearRect(0, 0, winterCtx.canvas.width, winterCtx.canvas.height);
        gunCtx.clearRect(0, 0, gunCtx.canvas.width, gunCtx.canvas.height);
        armourCtx.clearRect(0, 0, armourCtx.canvas.width, armourCtx.canvas.height);

        //Wipe the back button
        backCtx.clearRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);

        settlementCtx.clearRect(0, 0, settlementCtx.canvas.width, settlementCtx.canvas.height);
        drawSettlement();

        uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
        drawUI();

    };
    //****************************************************************************************************
    //BUILD Functions
    //*****************************************************************************************************
    //Used to convert the world map arrays from numbers, to effectively pointers to other arrays
    function createMaps(map) {
        //This is used to convert the world map arrays from numbers, to effectively pointers to other arrays
        var mapRows = map.length;
        var mapColumns = map[0].length;
        var currentType;
        for (var rows = 0; rows < mapRows; rows++) {
            for (var columns = 0; columns < mapColumns; columns++) {
                currentType = map[rows][columns];
                switch (currentType) {
                    case EMPTY:
                        //Create map object
                        var object = Object.create(mapObject);
                        //Set the id for the object
                        object.id = EMPTY;
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;
                        break;

                    case SETTLEMENT_MAP:
                        //Create map object
                        var object = Object.create(mapObject);
                        object.mapArray = [
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 94, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                            [72, 72, 72, 72, 72, 72, 72, 72, 72, 72]
                        ];
                        object.objectArray = [
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 10, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        ];
                        object.inside = false;
                        //Set the id for the object
                        object.id = map[rows][columns];
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;

                        if (!gameStarted) {
                            playerRow = rows;
                            playerColumn = columns;
                            curMap = map[rows][columns];
                        };

                        break;
                    case WASTE_1:
                        //Create map object
                        var object = Object.create(mapObject);
                        object.mapArray = [
                               [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                               [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                               [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                               [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                               [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                               [72, 72, 54, 53, 72, 72, 72, 72, 72, 72],
                               [72, 72, 43, 62, 72, 72, 72, 72, 72, 72],
                               [72, 72, 52, 51, 72, 72, 72, 72, 72, 72],
                               [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                               [72, 72, 72, 72, 72, 72, 72, 72, 72, 72]
                        ];
                        object.objectArray= [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 20, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        ];

                        object.inside = false;
                        //Set the id for the object 
                        object.id = map[rows][columns];
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;
                        break;
                    case WASTE_2:
                        //Create map object
                        var object = Object.create(mapObject);
                        object.mapArray = [
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72]
                        ];
                        object.objectArray = [
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 20, 0, 0, 0, 20, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 20, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],];
                        object.inside = false;
                        //Set the id for the object 
                        object.id = map[rows][columns];
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;
                        break;
                    case WASTE_3:
                        //Create map object
                        var object = Object.create(mapObject);
                        object.mapArray = [
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 74, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 74, 72, 72, 72, 72, 72],
                           [72, 72, 73, 73, 78, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 74, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 74, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 74, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72],
                           [72, 72, 72, 72, 72, 72, 72, 72, 72, 72]
                        ];
                        object.objectArray = [
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 31, 0, 0, 0],
                                [0, 0, 20, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 31, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 35, 0, 0],
                                [0, 0, 0, 0, 20, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ];
                        object.inside = false;
                        //Set the id for the object 
                        object.id = map[rows][columns];
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;
                        break;
                    case BUILDING:
                        //Create map object
                        var object = Object.create(mapObject);

                        object.innerMap = [
                            [0, 0, 0],
                            [0, 22, 0],
                            [0, 23, 0],
                            [0, 0, 0],
                        ];

                        createMaps(object.innerMap);
                        
                        object.inside = true;
                        //Set the id for the object 
                        object.id = map[rows][columns];
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;
                        break;

                    case BUILDING_ENTRANCE_1:
                        //Create map object
                        var object = Object.create(mapObject);
                        object.mapArray = [
                               [79, 79, 79, 79, 64, 79, 79, 79, 79, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 79, 79, 79, 71, 71, 79, 79, 79, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 79, 71, 71, 71, 71, 71, 71, 79, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79]
                        ];
                        object.objectArray = [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 20, 0, 0, 0, 0, 0, 0, 20, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        ];

                        object.inside = true;
                        //Set the id for the object 
                        object.id = map[rows][columns];
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;
                        break;

                    case BUILDING_1:
                        var object = Object.create(mapObject);
                        object.mapArray = [
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 79, 79, 71, 71, 71, 71, 79, 79, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 71, 71, 71, 71, 71, 71, 71, 71, 79],
                               [79, 79, 79, 79, 79, 79, 79, 79, 79, 79]
                        ];
                        object.objectArray = [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 33, 34, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        ];
                        object.inside = true;
                        //Set the id for the object 
                        object.id = map[rows][columns];
                        //Then replace that position in the map array with effectively a reference to that object
                        map[rows][columns] = object;
                        break;
                };
            };
        };
    };

    function changeMaps(newArea, map) {

        switch (newArea) {
            case LEFT:
                if (map[playerRow][playerColumn - 1].id != EMPTY) {
                    
                    curMap = map[playerRow][playerColumn - 1];
                    playerColumn -= 1;
                    gameState = BUILD_MAP;
                    player.x = gameCtx.canvas.width - player.width;
                    isInside = curMap.inside;
                    return true;
                } else {
                    return false;
                };
                break;
            case RIGHT:
                if (map[playerRow][playerColumn + 1].id != EMPTY) {
                    curMap = map[playerRow][playerColumn + 1];
                    playerColumn += 1;
                    gameState = BUILD_MAP;
                    player.x = 0;
                    isInside = curMap.inside;
                    return true;
                } else {
                    return false;
                };
                break;
            case UP:
                if (map[playerRow - 1][playerColumn].id != EMPTY) {
                    curMap = map[playerRow-1][playerColumn];
                    playerRow -= 1;
                    gameState = BUILD_MAP;
                    player.y = gameCtx.canvas.height - player.height;
                    isInside = curMap.inside;
                    return true;
                } else {
                    return false;
                };
                break;
            case DOWN:
                if (map[playerRow + 1][playerColumn].id != EMPTY) {
                    curMap = map[playerRow + 1][playerColumn];
                    playerRow += 1;
                    gameState = BUILD_MAP;
                    player.y = 0;
                    isInside = curMap.inside;
                    return true;
                } else {
                    return false;
                };
                break;
            case 0:
                if (map[playerRow][playerColumn].id != EMPTY) {
                    if (map[playerRow][playerColumn].id == BUILDING) {
                        curWorldMap = map[playerRow][playerColumn].innerMap;
                        goInside();
                    } else {
                        goOutside();
                        curMap = map[playerRow][playerColumn];
                    };

                    gameState = BUILD_MAP;
                    isInside = curMap.inside;

                    return true;
                } else {
                    return false;
                };
                break;
        };
    };

    function goInside() {

        //Pause the ambience sounds
        ambience.pause();

        //Set the isRaining and isSnowing to false
        isRaining = false;
        isSnowing = false;
        environmentCtx.clearRect(0, 0, environmentCtx.canvas.width, environmentCtx.canvas.height);


        for (var row = 0; row < curWorldMap.length; row++) {
            for (var column = 0; column < curWorldMap[0].length; column++) {
                if (curWorldMap[row][column].id == BUILDING_ENTRANCE_1) {
                    curMap = curWorldMap[row][column];

                    //Save the old row and column
                    prevColumn = playerColumn;
                    prevRow = playerRow

                    //Set the players new row and column in the world map
                    playerRow = row;
                    playerColumn = column;
                    break;
                };
            };
        };

        //Set the correct X and Y when they walk in
        if (curMap.id == BUILDING_ENTRANCE_1) {
            for (var row = 0; row < ROWS; row++) {
                for (var column = 0; column < COLUMNS; column++) {
                    if (curMap.mapArray[row][column] == DOOR_DOWN) {
                        player.y = (row+1) * SIZE;
                        player.x = column * SIZE;
                        break;
                    };
                    if (curMap.mapArray[row][column] == DOOR_UP) {
                        player.y = (row - 1) * SIZE;
                        player.x = column * SIZE;
                        break;
                    };
                    if (curMap.mapArray[row][column] == DOOR_LEFT) {
                        player.y = row * SIZE;
                        player.x = (column + 1) * SIZE;
                        break;
                    };
                    if (curMap.mapArray[row][column] == DOOR_RIGHT) {
                        player.y = row * SIZE;
                        player.x = (column - 1) * SIZE;
                        break;
                    };
                };
            };
        };
    };

    function goOutside() {

        //Play the ambience sounds
        ambience.play();

        curWorldMap = worldMap;
        playerRow = prevRow;
        playerColumn = prevColumn;
        curMap = curWorldMap[prevRow][prevColumn];

        var random = Math.floor(Math.random() * 10);
        //Randomly says whether its raining or snowing
        if (random <= 3) {
            isRaining = true;
        };
        if (random < 7 && random > 3) {
            isSnowing = true;
        };

        //Set the correct X and Y when they walk in
            for (var row = 0; row < ROWS; row++) {
                for (var column = 0; column < COLUMNS; column++) {
                    if (curMap.mapArray[row][column] == DOOR_DOWN) {
                        player.y = (row + 1) * SIZE;
                        player.x = column * SIZE;
                        break;
                    };
                    if (curMap.mapArray[row][column] == DOOR_UP) {
                        player.y = (row - 1) * SIZE;
                        player.x = column * SIZE;
                        break;
                    };
                    if (curMap.mapArray[row][column] == DOOR_LEFT) {
                        player.y = row * SIZE;
                        player.x = (column - 1) * SIZE;
                        break;
                    };
                    if (curMap.mapArray[row][column] == DOOR_RIGHT) {
                        player.y = row * SIZE;
                        player.x = (column + 1) * SIZE;
                        break;
                    };
                };
            };
    };

    function buildMap(levelMap,objects) {

        var currentTile;
        if (levelMap.id != EMPTY) {
            for (var row = 0; row < ROWS; row++) {
                for (var column = 0; column < COLUMNS; column++) {

                    if (objects) {
                        currentTile = levelMap.objectArray[row][column];
                    } else {
                        currentTile = levelMap.mapArray[row][column];
                    };

                    if (currentTile != EMPTY) {
                        //Find the tile's x and y position on the tile sheet

                        var tilesheetX = Math.floor((currentTile % tileSheetRows) - 1) * TILE_SIZE;
                        var tilesheetY = Math.floor((currentTile / tileSheetColumns) - 1) * TILE_SIZE;


                        switch (currentTile) {
                            //Buildings
                            case B_ROOF: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);
                                break;
                            }

                            case B_RIGHT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);

                                break;
                            }
                            case B_Left: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case B_UP: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case B_DOWN: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }

                                //Corners
                            case B_BOTTOM_RIGHT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case B_BOTTOM_LEFT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case B_TOP_RIGHT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case B_TOP_LEFT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }

                            case DOOR_LEFT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;

                                doors.push(object);

                                break;
                            }
                            case DOOR_RIGHT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                doors.push(object);

                                break;
                            }
                            case DOOR_UP: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                doors.push(object);
                                break;
                            }
                            case DOOR_DOWN: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                doors.push(object);
                                break;
                            }

                                //Floors and Walls
                            case B_FLOOR: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;

                                sprites.push(object);
                                break;
                            }
                            case G_FLOOR: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;

                                sprites.push(object);
                                break;
                            }
                            case B_WALL: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }

                                //OUTSIDE
                            case G_FLAT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case G_UP: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case G_TOP_LEFT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case G_TOP_RIGHT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case G_BOTTOM_LEFT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                            case G_BOTTOM_RIGHT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                sprites.push(object);

                                //Add to terrain array
                                terrain.push(object);
                                break;
                            }
                                //Pickups
                            case COMMON: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;

                                object.sourceHeight = TILE_SIZE * 0.25;
                                object.sourceWidth = TILE_SIZE * 0.25;
                                object.height = TILE_SIZE * 0.25;
                                object.width = TILE_SIZE * 0.25;

                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                pickUps.push(object);
                                break;
                            }
                            case UNCOMMON: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.sourceHeight = TILE_SIZE * 0.25;
                                object.sourceWidth = TILE_SIZE * 0.25;
                                object.height = TILE_SIZE * 0.25;
                                object.width = TILE_SIZE * 0.25;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                pickUps.push(object);
                                break;
                            }
                            case RARE: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.sourceHeight = TILE_SIZE * 0.25;
                                object.sourceWidth = TILE_SIZE * 0.25;
                                object.height = TILE_SIZE * 0.25;
                                object.width = TILE_SIZE * 0.25;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                pickUps.push(object);
                                break;
                            }
                            case MEDKIT: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.sourceHeight = TILE_SIZE * 0.25;
                                object.sourceWidth = TILE_SIZE * 0.25;
                                object.height = TILE_SIZE * 0.25;
                                object.width = TILE_SIZE * 0.25;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                pickUps.push(object);
                                break;
                            }
                            case FOOD: {
                                var object = Object.create(spriteObject);
                                object.sourceX = tilesheetX;
                                object.sourceY = tilesheetY;
                                object.sourceHeight = TILE_SIZE * 0.25;
                                object.sourceWidth = TILE_SIZE * 0.25;
                                object.height = TILE_SIZE * 0.25;
                                object.width = TILE_SIZE * 0.25;
                                object.x = column * TILE_SIZE;
                                object.y = row * TILE_SIZE;
                                object.id = currentTile;
                                pickUps.push(object);
                                break;
                            }

                            case SAFE_ZONE: {
                                safeZone = Object.create(spriteObject);
                                safeZone.sourceX = tilesheetX;
                                safeZone.sourceY = tilesheetY;
                                safeZone.x = column * TILE_SIZE;
                                safeZone.y = row * TILE_SIZE;
                                safeZone.id = currentTile;
                                break;
                            }

                                //Enemies and Player
                            case PLAYER: {
                                //When the area is redrawn we do not want the player to be also redrawn
                                if (player == null) {
                                    var temp = (PLAYER * 0.1) - 1;
                                    temp *= 0.1;
                                    player = Object.create(playerObject);

                                    //Set player to be facing up to start
                                    player.direction = 1;

                                    player.sourceX = player.direction * TILE_SIZE;
                                    player.sourceY = temp * TILE_SIZE;

                                    player.sourceHeight = TILE_SIZE * 0.5;
                                    player.sourceWidth = TILE_SIZE * 0.5;

                                    player.width = TILE_SIZE * 0.5;
                                    player.height = TILE_SIZE * 0.5;
                                    player.x = column * TILE_SIZE;
                                    player.y = column * TILE_SIZE;

                                    player.speed = player.getMaxSpeed();

                                    //Set health and damage
                                    player.maxHealth = 20;
                                    player.health = player.getMaxHealth();

                                    player.damage = 10;

                                    player.id = PLAYER;
                                };
                            
                                break;
                            };
                            case ENEMY: {
                                var temp = (ENEMY * 0.1) - 1;
                                var enemy = Object.create(enemyObject);

                                enemy.randomDirection();
                                enemy.sourceX = enemy.direction * TILE_SIZE;
                                enemy.sourceY = temp * TILE_SIZE;
                                enemy.width = TILE_SIZE * 0.5;
                                enemy.height = TILE_SIZE * 0.5;

                                enemy.sourceHeight = TILE_SIZE * 0.5;
                                enemy.sourceWidth = TILE_SIZE * 0.5;

                                var eColumn = 0;
                                var eRow = 0;

                                if (isInside) {
                                    do {
                                        eColumn = Math.floor(Math.random() * COLUMNS);
                                        eRow = Math.floor(Math.random() * ROWS);
                                    } while (levelMap.mapArray[eRow][eColumn] != B_FLOOR);
                                } else {
                                    do {
                                        eColumn = Math.floor(Math.random() * COLUMNS);
                                        eRow = Math.floor(Math.random() * ROWS);
                                    } while (levelMap.mapArray[eRow][eColumn] != G_FLOOR);
                                };
                                enemy.x = eColumn * TILE_SIZE;
                                enemy.y = eRow * TILE_SIZE;

                                //Set health and damage
                                enemy.maxHealth = 15;
                                enemy.health = enemy.maxHealth;

                                enemy.id = ENEMY;

                                enemies.push(enemy);
                                break;
                            };

                        }
                    }
                }
            }
        };
    }

    function buildUI() {

        iconOffsetX = COLUMNS * SIZE + offSetX + 10;

        //Winter Clothing
        i_WinterClothing = Object.create(spriteObject);
        i_WinterClothing.sourceX = (Math.floor((I_DWINTER % tileSheetRows) - 1) * TILE_SIZE);
        i_WinterClothing.sourceY = Math.floor((I_DWINTER / tileSheetColumns) - 1) * TILE_SIZE;
       
        i_WinterClothing.x = iconOffsetX;
        i_WinterClothing.y = uiCtx.canvas.height * 0.45;

        //Chemical Suit
        i_ChemicalSuit = Object.create(spriteObject);
        i_ChemicalSuit.sourceX = Math.floor((I_DCHEM % tileSheetRows) - 1) * TILE_SIZE;
        i_ChemicalSuit.sourceY = Math.floor((I_DCHEM / tileSheetColumns) - 1) * TILE_SIZE;

        i_ChemicalSuit.x = iconOffsetX;
        i_ChemicalSuit.y = uiCtx.canvas.height * 0.55;

        //Armour
        i_Armour = Object.create(spriteObject);
        i_Armour.sourceX = Math.floor((I_DARMOUR % tileSheetRows) - 1) * TILE_SIZE;
        i_Armour.sourceY = Math.floor((I_DARMOUR / tileSheetColumns) - 1) * TILE_SIZE;

        i_Armour.x = iconOffsetX;
        i_Armour.y = uiCtx.canvas.height * 0.65;

        //Food and Medkit canvases
        i_MedkitCanvas = document.createElement("canvas");
        i_MedkitCanvas.setAttribute("width", TILE_SIZE);
        i_MedkitCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(i_MedkitCanvas);
        i_MedkitCtx = i_MedkitCanvas.getContext("2d");
        i_MedkitCtx.canvas.width = TILE_SIZE;
        i_MedkitCtx.canvas.height = TILE_SIZE;

        i_FoodCanvas = document.createElement("canvas");
        i_FoodCanvas.setAttribute("width", TILE_SIZE);
        i_FoodCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(i_FoodCanvas);
        i_FoodCtx = i_FoodCanvas.getContext("2d");
        i_FoodCtx.canvas.width = TILE_SIZE;
        i_FoodCtx.canvas.height = TILE_SIZE;

        //Medkit
        i_Medkit = Object.create(spriteObject);
        i_Medkit.sourceX = Math.floor((I_DMEDKIT % tileSheetRows) - 1) * TILE_SIZE;
        i_Medkit.sourceY = Math.floor((I_DMEDKIT / tileSheetColumns) - 1) * TILE_SIZE;

        

        i_Medkit.x = iconOffsetX;
        i_Medkit.y = uiCtx.canvas.height * 0.35;

        
        i_MedkitCanvas.style.top = i_Medkit.y + "px";
        i_MedkitCanvas.style.left = i_Medkit.x + "px";

        //Food
        i_Food = Object.create(spriteObject);
        i_Food.sourceX = Math.floor((I_DFOOD % tileSheetRows) - 1) * TILE_SIZE;
        i_Food.sourceY = Math.floor((I_DFOOD / tileSheetColumns) - 1) * TILE_SIZE;


        i_Food.x = iconOffsetX + 2 * SIZE;
        i_Food.y = uiCtx.canvas.height * 0.35;

        i_FoodCanvas.style.top = i_Food.y + "px";
        i_FoodCanvas.style.left = i_Food.x + "px";

        //Listeners
        i_MedkitCanvas.addEventListener("click", medkitHandler,false);
        i_FoodCanvas.addEventListener("click", foodHandler,false);

        //Touch Controls
        //First build the canvases
        //Move Canvas
        moveCanvas = document.createElement("canvas");
        moveCanvas.setAttribute("width", TILE_SIZE);
        moveCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(moveCanvas);
        moveCtx = moveCanvas.getContext("2d");
        moveCtx.canvas.width = uiCtx.canvas.width * 0.2;
        moveCtx.canvas.height = uiCtx.canvas.height * 0.2;

        moveCanvas.style.top = uiCtx.canvas.height - moveCanvas.height + "px";
        moveCanvas.style.left = TILE_SIZE * 0.05 + "px";

        fireCanvas = document.createElement("canvas");
        fireCanvas.setAttribute("width", TILE_SIZE);
        fireCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(fireCanvas);
        fireCtx = fireCanvas.getContext("2d");
        fireCtx.canvas.width = uiCtx.canvas.width * 0.2;
        fireCtx.canvas.height = uiCtx.canvas.height * 0.2;

        fireCanvas.style.top = uiCtx.canvas.height - fireCanvas.height + "px";
        fireCanvas.style.left = uiCtx.canvas.width - fireCanvas.width + "px";

        fireCanvas.addEventListener("click", fireTouchHandler,false);
        moveCanvas.addEventListener("mousedown", moveTouchHandler,false);



    };

    function buildSettlementUI() {
        //Upgrade Canvases

        //Settlement Canvas
        settlementCanvas = document.createElement("canvas");
        settlementCanvas.setAttribute("width", COLUMNS * SIZE);
        settlementCanvas.setAttribute("height", ROWS * SIZE);
        playGameDiv.appendChild(settlementCanvas);
        settlementCtx = settlementCanvas.getContext("2d");
        settlementCtx.canvas.width = COLUMNS * SIZE;
        settlementCtx.canvas.height = ROWS * SIZE;

        settlementCanvas.style.top = offSetY + "px";
        settlementCanvas.style.left = offSetX + "px";

        //Gun Canvas
        gunCanvas = document.createElement("canvas");
        gunCanvas.setAttribute("width", TILE_SIZE);
        gunCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(gunCanvas);
        gunCtx = gunCanvas.getContext("2d");
        gunCtx.canvas.width = TILE_SIZE;
        gunCtx.canvas.height = TILE_SIZE;

       

        //Chemical Suit
        chemCanvas = document.createElement("canvas");
        chemCanvas.setAttribute("width", TILE_SIZE);
        chemCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(chemCanvas);
        chemCtx = chemCanvas.getContext("2d");
        chemCtx.canvas.width = TILE_SIZE;
        chemCtx.canvas.height = TILE_SIZE;

        //Winter Clothing
        winterCanvas = document.createElement("canvas");
        winterCanvas.setAttribute("width", TILE_SIZE);
        winterCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(winterCanvas);
        winterCtx = winterCanvas.getContext("2d");
        winterCtx.canvas.width = TILE_SIZE;
        winterCtx.canvas.height = TILE_SIZE;

        

        //Armour
        armourCanvas = document.createElement("canvas");
        armourCanvas.setAttribute("width", TILE_SIZE);
        armourCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(armourCanvas);
        armourCtx = armourCanvas.getContext("2d");
        armourCtx.canvas.width = TILE_SIZE;
        armourCtx.canvas.height = TILE_SIZE;

        //Back button
        backCanvas = document.createElement("canvas");
        backCanvas.setAttribute("width", 4*TILE_SIZE);
        backCanvas.setAttribute("height", TILE_SIZE);
        playGameDiv.appendChild(backCanvas);
        backCtx = backCanvas.getContext("2d");
        backCtx.canvas.width = 4 * TILE_SIZE;
        backCtx.canvas.height = TILE_SIZE;

        backCanvas.style.top = window.innerHeight * 0.73+ "px";
        backCanvas.style.left = settlementIconOffsetX + 2 * SIZE + "px";

        //Winter Clothing
        s_WinterClothing = Object.create(spriteObject);
        s_WinterClothing.sourceX = (Math.floor((I_WINTER % tileSheetRows) - 1) * TILE_SIZE);
        s_WinterClothing.sourceY = Math.floor((I_WINTER / tileSheetColumns) - 1) * TILE_SIZE;

        //Chemical Suit
        s_ChemicalSuit = Object.create(spriteObject);
        s_ChemicalSuit.sourceX = Math.floor((I_CHEM % tileSheetRows) - 1) * TILE_SIZE;
        s_ChemicalSuit.sourceY = Math.floor((I_CHEM / tileSheetColumns) - 1) * TILE_SIZE;

        //Armour
        s_Armour = Object.create(spriteObject);
        s_Armour.sourceX = Math.floor((I_ARMOUR % tileSheetRows) - 1) * TILE_SIZE;
        s_Armour.sourceY = Math.floor((I_ARMOUR / tileSheetColumns) - 1) * TILE_SIZE;

        //Gun
        s_Gun = Object.create(spriteObject);
        s_Gun.sourceX = Math.floor((I_GUN % tileSheetRows) - 1) * TILE_SIZE;
        s_Gun.sourceY = Math.floor((I_GUN / tileSheetColumns) - 1) * TILE_SIZE;

        s_Gun.y = window.innerHeight * 0.38;
        s_Gun.x = settlementIconOffsetX;
        s_ChemicalSuit.y = window.innerHeight * 0.48;
        s_ChemicalSuit.x = settlementIconOffsetX;
        s_WinterClothing.y = window.innerHeight * 0.58;
        s_WinterClothing.x = settlementIconOffsetX;
        s_Armour.y = window.innerHeight * 0.68;
        s_Armour.x = settlementIconOffsetX;


        //Position them
        gunCanvas.style.top = s_Gun.y + "px";
        gunCanvas.style.left = s_Gun.x + "px";
        chemCanvas.style.top = s_ChemicalSuit.y + "px";
        chemCanvas.style.left = s_ChemicalSuit.x + "px";
        winterCanvas.style.top = s_WinterClothing.y + "px";
        winterCanvas.style.left = s_WinterClothing.x + "px";
        armourCanvas.style.top = s_Armour.y + "px";
        armourCanvas.style.left = s_Armour.x + "px";
    };
    //******************************************************************************************************

    //UPDATES
    //******************************************************************************************************
    function playerUpdate() {
        //Down
        if (moveDown && !moveUp) {
            player.vy = player.speed;
            player.sourceX = C_DOWN * TILE_SIZE;
            player.direction = 0;
        }
        //Up
        if (moveUp && !moveDown) {
            player.vy = -player.speed;
            player.sourceX = C_UP * TILE_SIZE;
            player.direction = 1;
        }
        //Left
        if (moveLeft && !moveRight) {
            player.vx = -player.speed;
            player.sourceX = C_LEFT * TILE_SIZE;
            player.direction = 2;
        }
        //Right
        if (moveRight && !moveLeft) {
            player.vx = player.speed;
            player.sourceX = C_RIGHT * TILE_SIZE;
            player.direction = 3;
        }
        //45
        if (moveUp && moveRight) {
            player.sourceX = C_45 * TILE_SIZE;
            player.direction = 4;
        };
        //270
        if (moveUp && moveLeft) {
            player.sourceX = C_270 * TILE_SIZE;
            player.direction = 7;
        };
        //135
        if (moveDown && moveRight) {
            player.sourceX = C_135 * TILE_SIZE;
            player.direction = 5;
        };
        //225
        if (moveDown && moveLeft) {
            player.sourceX = C_225 * TILE_SIZE;
            player.direction = 6;
        };

        //Set the player's velocity to zero if none of the keys are being pressed
        if (!moveUp && !moveDown) {
            player.vy = 0;
        }
        if (!moveLeft && !moveRight) {
            player.vx = 0;
        }

        player.x += player.vx;
        player.y += player.vy;
    };

    function bulletUpdate() {
        for (var b = 0; b < bullets.length; b++) {
           bullets[b].x += bullets[b].vx;
           bullets[b].y += bullets[b].vy;
        };
    };

    function enemyUpdate() {
        for (var e = 0; e < enemies.length; e++) {
            enemies[e].huntPlayer(terrain, SIZE, player);
            enemies[e].update();
            enemies[e].x += enemies[e].vx;
            enemies[e].y += enemies[e].vy;

            if (enemies[e].isAttacking) {
                monsterAttack.currentTime = 0;
                monsterAttack.play();
                monsterAttack.volume = 0.1;

                playerDamage.currentTime = 0;
                playerDamage.play();
                playerDamage.volume = 0.1;

                enemies[e].isAttacking = false;
            };
        };
    };

    function iconUpdate() {

        //Update the image (selected, deselected)

        //Winter clothing
        if (player.winterSuit) {
            i_WinterClothing.sourceX = Math.floor((I_WINTER % tileSheetRows) - 1) * TILE_SIZE;
        }

        //Chemical Suit
        if (player.chemicalSuit) {
            i_ChemicalSuit.sourceX = Math.floor((I_CHEM % tileSheetRows) - 1) * TILE_SIZE;
        };

        //Armour
        if (player.armour) {
            i_Armour.sourceX = Math.floor((I_ARMOUR % tileSheetRows) - 1) * TILE_SIZE;
        };

        //Food
        if (player.food != 0) {
            i_Food.sourceX = Math.floor((I_FOOD % tileSheetRows) - 1) * TILE_SIZE;
            i_Food.sourceY = Math.floor((I_FOOD / tileSheetColumns) - 1) * TILE_SIZE;
        } else {
            i_Food.sourceX = Math.floor((I_DFOOD % tileSheetRows) - 1) * TILE_SIZE;
            i_Food.sourceY = Math.floor((I_DFOOD / tileSheetColumns) - 1) * TILE_SIZE;
        };

        //Medkit
        if (player.medKits != 0) {
            i_Medkit.sourceX = Math.floor((I_MEDKIT % tileSheetRows) - 1) * TILE_SIZE;
        } else {
            i_Medkit.sourceX = Math.floor((I_DMEDKIT % tileSheetRows) - 1) * TILE_SIZE;
        };

        //Draw the icons
        uiCtx.save();
        uiCtx.font = "12px Arial";
        uiCtx.fillStyle = "black";
        //Icons
        //Winter Clothing
        uiCtx.drawImage(
                image,
                i_WinterClothing.sourceX, i_WinterClothing.sourceY,
                i_WinterClothing.sourceWidth, i_WinterClothing.sourceHeight,
                i_WinterClothing.x, i_WinterClothing.y,
                i_WinterClothing.width, i_WinterClothing.height
            );
        //Chemical suit
        uiCtx.drawImage(
                image,
                i_ChemicalSuit.sourceX, i_ChemicalSuit.sourceY,
                i_ChemicalSuit.sourceWidth, i_ChemicalSuit.sourceHeight,
                i_ChemicalSuit.x, i_ChemicalSuit.y,
                i_ChemicalSuit.width, i_ChemicalSuit.height
            );
        //Armour
        uiCtx.drawImage(
                image,
                i_Armour.sourceX, i_Armour.sourceY,
                i_Armour.sourceWidth, i_Armour.sourceHeight,
                i_Armour.x, i_Armour.y,
                i_Armour.width, i_Armour.height
            );


        //Med Kit
        i_MedkitCtx.clearRect(0, 0, i_MedkitCtx.canvas.width, i_MedkitCtx.canvas.height);
        i_MedkitCtx.save();


        i_MedkitCtx.font = "12px Arial";
        i_MedkitCtx.fillStyle = "black";

        //Draw the image
        i_MedkitCtx.drawImage(
                image,
                i_Medkit.sourceX, i_Medkit.sourceY,
                i_Medkit.sourceWidth, i_Medkit.sourceHeight,
                0, 0,
                i_Medkit.width, i_Medkit.height
            ); 
        i_MedkitCtx.fillText(player.medKits, (i_Medkit.width * 0.7), (i_Medkit.height * 0.9));
        i_MedkitCtx.restore();

        //Food
        i_FoodCtx.clearRect(0, 0, i_FoodCtx.canvas.width, i_FoodCtx.canvas.height);
        i_FoodCtx.save();

        i_FoodCtx.font = "12px Arial";
        i_FoodCtx.fillStyle = "black";

        //Draw the image
        i_FoodCtx.drawImage(
                image,
                i_Food.sourceX, i_Food.sourceY,
                i_Food.sourceWidth, i_Food.sourceHeight,
                0, 0,
                i_Food.width, i_Food.height
            );
        i_FoodCtx.fillText(player.food, (i_Food.width * 0.7), (i_Food.height * 0.9));
        i_FoodCtx.restore();

        uiCtx.restore();
    };

    function barsUpdate() {
        //Length of bars
        var barLength = 200;
        var barHeight = 20;

        //Health Bar
        uiCtx.save();
        uiCtx.font = "bold 15px Arial";
        uiCtx.fillStyle = "black";
        uiCtx.fillText("Health (" + player.health + "/" + player.getMaxHealth() + "): ", uiTextOffsetX, uiCtx.canvas.height * 0.815);
        uiCtx.fillText("Hunger (" + player.hunger + "/" + player.getMaxHunger() + "): ", uiTextOffsetX, uiCtx.canvas.height * 0.865);
        uiCtx.fillText("Temperature (" + player.cold + "/" + player.getMaxCold() + "): ", uiTextOffsetX, uiCtx.canvas.height * 0.915);
        uiCtx.restore();

        uiCtx.save();

        //Outer bar
        uiCtx.beginPath();
        uiCtx.rect(uiBarOffsetX, uiCtx.canvas.height * 0.8, barLength, barHeight);
        uiCtx.fillStyle = 'white';
        uiCtx.fill();
        uiCtx.lineWidth = 2;
        uiCtx.strokeStyle = 'black';
        uiCtx.stroke();

        //Inner Bar
        uiCtx.fillStyle = "red";
        uiCtx.lineWidth = 2;

        var healthLength = Math.floor((player.health / player.maxHealth) * barLength);
        uiCtx.fillRect(uiBarOffsetX, uiCtx.canvas.height * 0.8, healthLength, barHeight);

        uiCtx.restore();

        //Cold Bar
        uiCtx.save();

        //Inner bar
        uiCtx.beginPath();
        uiCtx.rect(uiBarOffsetX, uiCtx.canvas.height * 0.9, barLength, barHeight);
        uiCtx.fillStyle = 'white';
        uiCtx.fill();
        uiCtx.lineWidth = 2;
        uiCtx.strokeStyle = 'black';
        uiCtx.stroke();

        //Outer Bar

        uiCtx.fillStyle = "blue";
        uiCtx.lineWidth = 2;

        var coldLength = Math.floor((player.cold / player.maxCold) * barLength);
        uiCtx.fillRect(uiBarOffsetX, uiCtx.canvas.height * 0.9, coldLength, barHeight);

        uiCtx.restore();

        //Hunger Bar
        uiCtx.save();

        //Inner Bar
        uiCtx.beginPath();
        uiCtx.rect(uiBarOffsetX, uiCtx.canvas.height * 0.85, barLength, barHeight);
        uiCtx.fillStyle = 'white';
        uiCtx.fill();
        uiCtx.lineWidth = 2;
        uiCtx.strokeStyle = 'black';
        uiCtx.stroke();

        //Outer Bar
        uiCtx.fillStyle = "orange";
        uiCtx.lineWidth = 2;

        var hungerLength = Math.floor((player.hunger / player.maxHunger) * barLength);
        uiCtx.fillRect(uiBarOffsetX, uiCtx.canvas.height * 0.85, hungerLength, barHeight);

        uiCtx.restore();
    };

    function scoreUpdate() {
        //Score
        uiCtx.save();

        scoreOffsetX = COLUMNS*SIZE + offSetX+5;

        uiCtx.beginPath();
        uiCtx.rect(scoreOffsetX, offSetY, uiCtx.canvas.width * 0.1, uiCtx.canvas.width * 0.05);
        uiCtx.fillStyle = 'white';
        uiCtx.fill();
        uiCtx.lineWidth = 2;
        uiCtx.strokeStyle = 'black';
        uiCtx.stroke();

        uiCtx.fillStyle = "black";
        uiCtx.font = "bold 15px arial";
        uiCtx.fillText("Money: $" + player.money, scoreOffsetX+5, offSetY * 1.15);
        uiCtx.fillText("Score: " + player.score, scoreOffsetX+5, offSetY * 1.25);
        uiCtx.fillText("Relics Collected: " + player.relicsCollected() + "/" + objective, scoreOffsetX+5, offSetY * 1.35);
        uiCtx.restore();
    };

    function controlsUpdate() {
        moveCtx.clearRect(0,0,moveCtx.canvas.width,moveCtx.canvas.height)
        moveCtx.save();
        moveCtx.fillStyle = "orange";
        moveCtx.fillRect(0, 0, moveCanvas.width, moveCanvas.height);
        moveCtx.fill();
        moveCtx.restore();

        fireCtx.clearRect(0, 0, fireCtx.canvas.width, fireCtx.canvas.height)
        fireCtx.save();
        fireCtx.fillStyle = "orange";
        fireCtx.fillRect(0, 0, fireCanvas.width, fireCanvas.height);
        fireCtx.fill();
        fireCtx.restore();
    };

    function endGame() {
        //Kill the arrays
        enemies = [];
        dead = [];
        pickUps = [];
        doors = [];
        terrain = [];
        sprites = [];
        bullets = [];
        //Kill the safe zone
        safeZone = null;

        //Kill the player
        //var playerScore = player.score;
        player = null;

        //End the intervals
        clearInterval(starvationTimer);
        clearInterval(freezingTimer);
        clearInterval(chemicalTimer);

        //Reset game
        gameStarted = false;
        //This variable will help skip ahead in the loading bit
        gameRestart = true;

        //clear all the canvases
        //Wipe the upgrade icons
        chemCtx.clearRect(0, 0, chemCtx.canvas.width, chemCtx.canvas.height);
        winterCtx.clearRect(0, 0, winterCtx.canvas.width, winterCtx.canvas.height);
        gunCtx.clearRect(0, 0, gunCtx.canvas.width, gunCtx.canvas.height);
        armourCtx.clearRect(0, 0, armourCtx.canvas.width, armourCtx.canvas.height);
        //Settlement Canvases
        settlementCtx.clearRect(0, 0, settlementCtx.canvas.width, settlementCtx.canvas.height);
        backCtx.clearRect(0, 0, backCtx.canvas.width, backCtx.canvas.height);
        //Game Canvas
        gameCtx.clearRect(0, 0, gameCtx.canvas.width, gameCtx.canvas.height);
        //UI Canvas
        uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);
        //Wipe the controls
        moveCtx.clearRect(0, 0, moveCtx.canvas.width, moveCtx.canvas.height);
        fireCtx.clearRect(0, 0, fireCtx.canvas.width, fireCtx.canvas.height);
        //Medkit and Food icons
        i_MedkitCtx.clearRect(0, 0, i_MedkitCtx.canvas.width, i_MedkitCtx.canvas.height);
        i_FoodCtx.clearRect(0, 0, i_FoodCtx.canvas.width, i_FoodCtx.canvas.height);
        //Clear the environment context
        environmentCtx.clearRect(0, 0, environmentCtx.canvas.width, environmentCtx.canvas.height); 


        playGameDiv.style.display = "none";
        mainMenu.style.display = "inline";

        

        //Kill the listeners
        armourCanvas.removeEventListener("click", armourUpgrade, false);
        chemCanvas.removeEventListener("click", chemUpgrade, false);
        winterCanvas.removeEventListener("click", winterUpgrade, false);
        gunCanvas.removeEventListener("click", gunUpgrade, false);
        backCanvas.removeEventListener("click", backHandler, false);
        i_MedkitCanvas.removeEventListener("click", medkitHandler, false);
        i_FoodCanvas.removeEventListener("click", foodHandler, false);
        fireCanvas.removeEventListener("click", fireTouchHandler, false);
        moveCanvas.removeEventListener("mousedown", moveTouchHandler, false);


        //Rebuild the world and building maps
        for (var row = 0; row < worldMap.length; row++) {
            for (var column = 0; column < worldMap[0].length; column++) {
                var temp = worldMap[row][column].id;
                worldMap[row][column] = null;
                worldMap[row][column] = temp;
            };
        };

        for (var row = 0; row < buildingMap.length; row++) {
            for (var column = 0; column < buildingMap[0].length; column++) {
                var temp = buildingMap[row][column].id;

                if (buildingMap[row][column].id == BUILDING) {
                    var tempMap = buildingMap[row][column].innerMap;

                    for (var row2 = 0; row2 < tempMap.length; row2++) {
                        for (var column2 = 0; column2 < tempMap[0].length; column2++) {
                            var temp2 = tempMap[row2][column2].id;
                            tempMap[row2][column2] = null;
                            tempMap[row2][column2] = temp2;
                        };
                    };

                };

                buildingMap[row][column] = null;
                buildingMap[row][column] = temp;
            };
        };

        cancelAnimationFrame(updateId);

        gameState = MENU;
    };

    //******************************************************************************************************

    //Collisions
    //*****************************************************************************************************
    function playerCollisions() {
        //Player + Terrain
        for (var i = 0; i < terrain.length; i++) {
            rectangleCollision(player, terrain[i]);
        };

        //player and pickups
        for (var p = 0; p < pickUps.length; p++) {
            if (bulletCollision(pickUps[p], player)) {
                switch (pickUps[p].id) {
                    case COMMON:
                        player.commonRelics++;

                        curMap.objectArray[pickUps[p].getColumn()][pickUps[p].getRow()] = EMPTY;
                        pickUps.splice(p, 1);
                        break;
                    case UNCOMMON:
                        player.uncommonRelics++;
                        curMap.objectArray[pickUps[p].getColumn()][pickUps[p].getRow()] = EMPTY;
                        pickUps.splice(p, 1);
                        break;
                    case RARE:
                        player.rareRelics++;
                        curMap.objectArray[pickUps[p].getColumn()][pickUps[p].getRow()] = EMPTY;
                        pickUps.splice(p, 1);
                        break;
                    case FOOD:
                        player.food++;
                        curMap.objectArray[pickUps[p].getColumn()][pickUps[p].getRow()] = EMPTY;
                        pickUps.splice(p, 1);
                        break;
                    case MEDKIT:
                        if (player.medKits < player.maxMedKits) {
                            player.medKits++;
                            curMap.objectArray[pickUps[p].getColumn()][pickUps[p].getRow()] = EMPTY;
                            pickUps.splice(p, 1);
                        };

                        break;
                };
            };
        };

        //player and doors
        for (var d = 0; d < doors.length; d++) {
            if (bulletCollision(doors[d], player)) {
                if (!isInside) {
                    if (!changeMaps(0, buildingMap)) {
                        rectangleCollision(player, doors[d]);
                    };
                }
                else if(isInside) {
                    if (!changeMaps(0, worldMap)) {
                        rectangleCollision(player, doors[d]);
                    };
                };
            };
        };

        //Player and stage boundaries
        //If the player walks off the edge, the game checks to see if they can move in that direction or not, if so then the map changes, if not they are stopped
        if (player.x < 0) {
            if (!changeMaps(LEFT,curWorldMap)) {
                //Reset x
                player.x = 0;
            };
        };
        if (player.x + player.width > gameCtx.canvas.width) {
            if (!changeMaps(RIGHT,curWorldMap)) {
                //reset x
                player.x = gameCtx.canvas.width - player.width;
            };
        };
        if (player.y < 0) {
            if (!changeMaps(UP,curWorldMap)) {
                //reset y
                player.y = 0;
            };
        };
        if (player.y + player.height > gameCtx.canvas.height) {
            if (!changeMaps(DOWN,curWorldMap)) {
                //reset y
                player.y = gameCtx.canvas.height - player.height;
            };
        };


        //Player and Safe Zone
        if (safeZone != null) {
            if (player.relicsCollected() >= objective) {
                if (bulletCollision(safeZone, player)) {
                    gameState = SETTLEMENT;
                };
            } else {
                rectangleCollision(player, safeZone);
            };
        };

        //Player + Enemy
        for (var e = 0; e < enemies.length; e++) {
            if (circleCollision(enemies[e], player)) {
                enemies[e].attack(player);
                if (!isInside) {
                    enemies[e].findNewDirection(curMap.mapArray, G_FLOOR, SIZE, ROWS, COLUMNS);
                } else {
                    enemies[e].findNewDirection(curMap.mapArray, B_FLOOR, SIZE, ROWS, COLUMNS);
                };
            };
        };
    };

    function enemyCollisions() {
        //Enemy + Terrain
        for (var j = 0; j < enemies.length; j++) {

            for (var i = 0; i < terrain.length; i++) {
                if (rectangleCollision(enemies[j], terrain[i])) {
                    if (!isInside) {
                        enemies[j].findNewDirection(curMap.mapArray, G_FLOOR, SIZE,ROWS,COLUMNS);
                    } else {
                        enemies[j].findNewDirection(curMap.mapArray, B_FLOOR, SIZE, ROWS, COLUMNS);
                    };
                };
            };
        };
        //Enemies and doors
        for (var e = 0; e < enemies.length; e++) {
            for (var d = 0; d < doors.length; d++) {
                if (rectangleCollision(enemies[e],doors[d])) {
                    //Inside versus outside tiles
                    if (!isInside) {
                        enemies[e].findNewDirection(curMap.mapArray, G_FLOOR, SIZE, ROWS, COLUMNS);
                    } else {
                        enemies[e].findNewDirection(curMap.mapArray, B_FLOOR, SIZE, ROWS, COLUMNS);
                    };
                };
            };
        };

        //Enemies and enemies
        for (var ep = 0; ep < enemies.length; ep++) {
            for (var es = 0; es < enemies.length; es++) {
                if (enemies[ep] != enemies[es]) {
                    if (circleCollision(enemies[ep], enemies[es])) {
                        //Inside versus outside tiles
                        if (!isInside) {
                            enemies[ep].findNewDirection(curMap.mapArray, G_FLOOR, SIZE, ROWS, COLUMNS);
                            enemies[es].findNewDirection(curMap.mapArray, G_FLOOR, SIZE, ROWS, COLUMNS);
                        } else {
                            enemies[ep].findNewDirection(curMap.mapArray, B_FLOOR, SIZE, ROWS, COLUMNS);
                            enemies[es].findNewDirection(curMap.mapArray, B_FLOOR, SIZE, ROWS, COLUMNS);
                        };
                    };
                };
            };
        };

        //Enemy and stage boundaries
        for (var e = 0; e < enemies.length; e++) {

            if (enemies[e].x < 0) {
                //reset x
                enemies[e].x = 0;
                //Reverse direction
                enemies[e].randomDirection();


            };
            if (enemies[e].x + enemies[e].width > gameCtx.canvas.width) {
                //reset x
                enemies[e].x = gameCtx.canvas.width - enemies[e].width;
                //Reverse direction
                enemies[e].randomDirection();

            };
            if (enemies[e].y < 0) {
                //reset y
                enemies[e].y = 0;
                //Reverse direction
                enemies[e].randomDirection();
            };
            if (enemies[e].y + enemies[e].height > gameCtx.canvas.height) {
                //reset y
                enemies[e].y = gameCtx.canvas.height - enemies[e].height;
                //Reverse direction
                enemies[e].randomDirection();
            };
        };
    };

    function bulletCollisions() {
        //Bullets + Terrain
        for (var b = 0; b < bullets.length; b++) {
            for (var t = 0; t < terrain.length; t++) {
                if (bullets[b] != null) {
                    if (bulletCollision(bullets[b], terrain[t])) {
                        bullets.splice(b, 1);

                        hit.currentTime = 0;
                        hit.play();
                        hit.volume = 0.1;
                    };
                };
            };
        };

        //Bullets + door
        for (var b = 0; b < bullets.length; b++) {
            for (var d = 0; d < doors.length; d++) {
                if (bullets[b] != null) {
                    if (bulletCollision(bullets[b], doors[d])) {
                        bullets.splice(b, 1);

                        hit.currentTime = 0;
                        hit.play();
                        hit.volume = 0.1;
                    };
                };
            };
        };

        //Bullets + Enemy
        for (var b = 0; b < bullets.length; b++) {
            for (var e = 0; e < enemies.length; e++) {
                if (bullets[b] != null && enemies[e] != null) {
                    if (bulletCollision(bullets[b], enemies[e])) {
                        console.log("Before " + enemies[e].health);
                        bullets.splice(b, 1);
                        enemies[e].takeDamage(player.damage);

                        monsterDamage.currentTime = 0;
                        monsterDamage.play();
                        monsterDamage.volume = 0.1;

                        if (enemies[e].isDead()) {

                            var random = Math.floor(1 + Math.random() * ((2 - 1) + 1));

                            switch (random) {
                                case 1:
                                    monsterDeath1.currentTime = 0;
                                    monsterDeath1.play();
                                    monsterDeath1.volume = 0.1;
                                    break;
                                case 2:
                                    monsterDeath2.currentTime = 0;
                                    monsterDeath2.play();
                                    monsterDeath2.volume = 0.1;
                                    break;
                            };


                            enemies[e].sourceX = C_DEAD * TILE_SIZE;
                            dead.push(enemies[e]);
                            deathTimer = setInterval(deathHandler, 100);
                            enemies.splice(e, 1);
                        };

                    };
                };
            };
        };
    };
    //*****************************************************************************************************

    document.addEventListener("DOMContentLoaded", init, false);

    app.start();
})();

