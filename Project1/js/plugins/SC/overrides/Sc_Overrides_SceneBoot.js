SC._scnBoot_startNormalGame = Scene_Boot.prototype.startNormalGame;
Scene_Boot.prototype.startNormalGame = function(){
    SC._scnBoot_startNormalGame.call(this);
    $debugTool.log("============================= EXECTUTION ==============================");
};

/*
SC.clone_ScnBoot_strt           = Scene_Boot.prototype.start;
SC.clone_ScnBoot_loadSysImgs    = Scene_Boot.loadSystemImages;

Scene_Boot.prototype.start = function() {
	console.group("EXECUTION");SCMlog("\u{1F3B4} SCENE:" + this.constructor.name.toUpperCase(), true, false);
	if(!DEBUG_OPTIONS.debug && DEBUG_OPTIONS.foolScreen){
        Graphics._requestFullScreen();
	}
    this._loadOptions = false;
    if(!DEBUG_OPTIONS.skip_title){
		if(!DEBUG_OPTIONS.skip_preload){
			SceneManager.goto(Simcraft_Preload);
			return;
		}else{
			AudioManager.stopMe();
			DataManager.setupNewGame();
			SceneManager.goto(Scene_Title);
			Window_TitleCommand.initCommandPosition();
			return;
		}
    }else{
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()){
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        }else{
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Map);
        }
        this.updateDocumentTitle();
    }
};*/

// function Scene_Boot() {
//     this.initialize(...arguments);
// }

// Scene_Boot.prototype = Object.create(Scene_Base.prototype);
// Scene_Boot.prototype.constructor = Scene_Boot;

// Scene_Boot.prototype.initialize = function() {
//     Scene_Base.prototype.initialize.call(this);
//     this._databaseLoaded = false;
// };

// Scene_Boot.prototype.create = function() {
//     Scene_Base.prototype.create.call(this);
//     DataManager.loadDatabase();
//     StorageManager.updateForageKeys();
// };

// Scene_Boot.prototype.isReady = function() {
//     if (!this._databaseLoaded) {
//         if (
//             DataManager.isDatabaseLoaded() &&
//             StorageManager.forageKeysUpdated()
//         ) {
//             this._databaseLoaded = true;
//             this.onDatabaseLoaded();
//         }
//         return false;
//     }
//     return Scene_Base.prototype.isReady.call(this) && this.isPlayerDataLoaded();
// };

// Scene_Boot.prototype.onDatabaseLoaded = function() {
//     this.setEncryptionInfo();
//     this.loadSystemImages();
//     this.loadPlayerData();
//     this.loadGameFonts();
// };

// Scene_Boot.prototype.setEncryptionInfo = function() {
//     const hasImages = $dataSystem.hasEncryptedImages;
//     const hasAudio = $dataSystem.hasEncryptedAudio;
//     const key = $dataSystem.encryptionKey;
//     Utils.setEncryptionInfo(hasImages, hasAudio, key);
// };

// Scene_Boot.prototype.loadSystemImages = function() {
//     ColorManager.loadWindowskin();
//     ImageManager.loadSystem("IconSet");
// };

// Scene_Boot.prototype.loadPlayerData = function() {
//     DataManager.loadGlobalInfo();
//     ConfigManager.load();
// };

// Scene_Boot.prototype.loadGameFonts = function() {
//     const advanced = $dataSystem.advanced;
//     FontManager.load("rmmz-mainfont", advanced.mainFontFilename);
//     FontManager.load("rmmz-numberfont", advanced.numberFontFilename);
// };

// Scene_Boot.prototype.isPlayerDataLoaded = function() {
//     return DataManager.isGlobalInfoLoaded() && ConfigManager.isLoaded();
// };

// Scene_Boot.prototype.start = function() {
//     Scene_Base.prototype.start.call(this);
//     SoundManager.preloadImportantSounds();
//     if (DataManager.isBattleTest()) {
//         DataManager.setupBattleTest();
//         SceneManager.goto(Scene_Battle);
//     } else if (DataManager.isEventTest()) {
//         DataManager.setupEventTest();
//         SceneManager.goto(Scene_Map);
//     } else if (DataManager.isTitleSkip()) {
//         this.checkPlayerLocation();
//         DataManager.setupNewGame();
//         SceneManager.goto(Scene_Map);
//     } else {
//         this.startNormalGame();
//     }
//     this.resizeScreen();
//     this.updateDocumentTitle();
// };

// Scene_Boot.prototype.startNormalGame = function() {
//     this.checkPlayerLocation();
//     DataManager.setupNewGame();
//     Window_TitleCommand.initCommandPosition();
//     SceneManager.goto(Scene_Splash);
// };

// Scene_Boot.prototype.resizeScreen = function() {
//     const screenWidth = $dataSystem.advanced.screenWidth;
//     const screenHeight = $dataSystem.advanced.screenHeight;
//     Graphics.resize(screenWidth, screenHeight);
//     Graphics.defaultScale = this.screenScale();
//     this.adjustBoxSize();
//     this.adjustWindow();
// };

// Scene_Boot.prototype.adjustBoxSize = function() {
//     const uiAreaWidth = $dataSystem.advanced.uiAreaWidth;
//     const uiAreaHeight = $dataSystem.advanced.uiAreaHeight;
//     const boxMargin = 4;
//     Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
//     Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
// };

// Scene_Boot.prototype.adjustWindow = function() {
//     if (Utils.isNwjs()) {
//         const scale = this.screenScale();
//         const xDelta = Graphics.width * scale - window.innerWidth;
//         const yDelta = Graphics.height * scale - window.innerHeight;
//         window.moveBy(-xDelta / 2, -yDelta / 2);
//         window.resizeBy(xDelta, yDelta);
//     }
// };

// Scene_Boot.prototype.screenScale = function() {
//     if ("screenScale" in $dataSystem.advanced) {
//         return $dataSystem.advanced.screenScale;
//     } else {
//         return 1;
//     }
// };

// Scene_Boot.prototype.updateDocumentTitle = function() {
//     document.title = $dataSystem.gameTitle;
// };

// Scene_Boot.prototype.checkPlayerLocation = function() {
//     if ($dataSystem.startMapId === 0) {
//         throw new Error("Player's starting position is not set");
//     }
// };