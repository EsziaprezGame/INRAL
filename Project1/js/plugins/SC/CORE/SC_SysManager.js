class SysManager {
    constructor() {

    }

    onSceneMapCreate(scene) {
        $gameWeather.update();
        $lightManager.update();
    }

    onMapCreateAllWindows(scene) {
        this.createHudsLayer(scene);
        this.createHuds(scene);
    }
    createHudsLayer(scene) {
        this._hudsLayer = new Sprite();
        scene.addChild(this._hudsLayer);
    };
    createHuds(scene) {
        this._hudDate = this.createHudDate();
        this._hudsLayer.addChild(this._hudDate);

        this._btnHudDate = new GUI_BtnHudDate(this._hudDate, 16, 8);
        this._hudsLayer.addChild(this._btnHudDate);

        this._btnScrollDate = new GUI_BtnHudScroll(this._hudDate, 52, 6);
        this._hudsLayer.addChild(this._btnScrollDate);
    };
    createHudDate() {
        const width = 182;
        const height = 300;
        const x = 0; // Décalé du bord droit
        const y = 28; // Un peu en dessous du haut de l'écran
        const rect = new Rectangle(x, y, width, height);
        return new GUI_HudDate(rect);
    };

    onMapUpdate(scene) {
        this.updateScSys();
        this.updateHuds();
        this.updateScShortcuts();
    }
    updateScSys() {
        $gameInLudeDate.passTick();
        $gameWeather.update();
        $lightManager.update();
        $gamePlantations.updateAll();
        $gameFaunas.updateAll();
    }
    updateHuds() {
        if (this._hudDate) this._hudDate.update();
    }

    isHudTouched = function (scene) {
        const x = TouchInput.x;
        const y = TouchInput.y;
        let res = false;

        this._hudsLayer.children.forEach(hud => {
            if (this.isSpriteTouched(hud, x, y) && hud.visible)
                res = true;
        }, this)
        return res;
    }
    isSpriteTouched(sprite, x, y) {
        if (!sprite) return false;
        const sx = sprite.x;
        const sy = sprite.y;
        if (!sprite.width && !sprite.bitmap) return false;
        const sw = sprite.width || sprite.bitmap.width;
        const sh = sprite.height || sprite.bitmap.height;
        return x >= sx && x < sx + sw && y >= sy && y < sy + sh;
    }

    onSceneMapMapLoaded() {
        $gamePlantations.loadMapPlants();
        $gameFaunas.loadMapFaunas();
        // mineBuilder = new Game_MineBuilder($gameMap.mapId());
        // mineBuilder.updateAround($gamePlayer.x, $gamePlayer.y, 30); // Construction initiale large
    }
    updateScShortcuts = function () {
        if (Input.isTriggered("t")) {
            if (this._btnHudDate) {
                this._btnHudDate.toggleHud();
            }
        }
        if (Input.isTriggered("1top")) {
            $gameInLudeDate.setScrollSpeedMode(1);
            this._btnScrollDate.updateFrame();
        }
        if (Input.isTriggered("2top")) {
            $gameInLudeDate.setScrollSpeedMode(2);
            this._btnScrollDate.updateFrame();
        }
        if (Input.isTriggered("3top")) {
            $gameInLudeDate.setScrollSpeedMode(3);
            this._btnScrollDate.updateFrame();
        }
        if (Input.isTriggered("4top")) {
            $gameInLudeDate.setScrollSpeedMode(4);
            this._btnScrollDate.updateFrame();
        }
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_SysManager",
    icon: "\u{1F4A1}",
    version: "0.2.1",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    loadDataFiles: [],
    createObj: { autoCreate: true, classProto: SysManager, instName: '$scSysManager' },
    autoSave: true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);