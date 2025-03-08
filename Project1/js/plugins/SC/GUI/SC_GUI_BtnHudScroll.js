class GUI_BtnHudScroll extends GUI_BtnHudBase {
    initialize(hud, x, y) {
        super.initialize(hud, {x:x, y:y, w:20, h:20});
        this.loadButtonImage();
        this.frameWidth = 20;
        this.frameHeight = 20;
        this.setFrame(0, 0, this.frameWidth, this.frameHeight);
        this._lastSpeedMode = -1; // checker change
        this.updateFrame();
    }
    update(){
        super.update();
        this.visible = this._hud.visible;
    }
    loadButtonImage() {
        this.bitmap = ImageManager.loadBitmap("img/GUI/HudDate/", "scroll");
    }
    setupInteraction() {
        this.setClickHandler(() => this.toggleScrollSpeed());
    }
    toggleScrollSpeed() {
        if(!this.visible)return;
        if($gameInLudeDate._scrollSpeedMode >= 3)
            $gameInLudeDate._scrollSpeedMode = 1;
        else
            $gameInLudeDate._scrollSpeedMode = Math.min($gameInLudeDate._scrollSpeedMode + 1, 3);
        this.updateFrame();
    }
    increaseScrollSpeed() {
        $gameInLudeDate._scrollSpeedMode = Math.min($gameInLudeDate._scrollSpeedMode + 1, 4);
        this.updateFrame()
    }

    decreaseScrollSpeed() {
        $gameInLudeDate._scrollSpeedMode = Math.max($gameInLudeDate._scrollSpeedMode - 1, 0);
        this.updateFrame()
    }
    updateFrame() {
        const index = $gameInLudeDate._scrollSpeedMode + 1;
        this.setFrame(index * this.frameWidth, 0, this.frameWidth, this.frameHeight);
    }
}