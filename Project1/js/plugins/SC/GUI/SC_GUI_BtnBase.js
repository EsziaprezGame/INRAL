class GUI_BtnHudBase extends Sprite {
    constructor(hud, x, y) {
        super();
        this._hud = hud;
        this.x = x;
        this.y = y;
        this._clicked = false;
        this._isOpen = this._hud.visible;
        this.loadButtonImage();
        this.setupInteraction();
    }

    imgFolderName() {
        return this._hud.constructor.name.replace("GUI_", "");
    }

    imgFolderPath() {
        return `img/GUI/${this.imgFolderName()}/`;
    }

    loadButtonImage() {
        const state = this._hud.visible ? "btn_on" : "btn_off";
        this.bitmap = ImageManager.loadBitmap(this.imgFolderPath(), state);
    }

    setupInteraction() {
        this.setClickHandler(() => this.toggleHud());
    }

    setClickHandler(callback) {
        this._clickHandler = callback;
    }

    onClick() {
        if (this._clickHandler) this._clickHandler();
        this.playClickEffect();
    }

    update() {
        super.update();
        if (this.isClickTriggered()) {
            this.onClick();
        }
        this.updateButtonState();
    }

    updateButtonState() {
        const isOpen = this._hud.visible;
        if (isOpen !== this._isOpen) {
            this._isOpen = isOpen;
            this.loadButtonImage();
            this.playToggleSound();
        }
    }

    isClickTriggered() {
        return TouchInput.isTriggered() &&
            this.isTouchInside();
    }

    isTouchInside() {
        const x = this.x;
        const y = this.y;
        const w = this.bitmap ? this.bitmap.width : 0;
        const h = this.bitmap ? this.bitmap.height : 0;
        return TouchInput.x >= x && TouchInput.x < x + w &&
            TouchInput.y >= y && TouchInput.y < y + h;
    }

    toggleHud() {
        this._hud.visible = !this._hud.visible;
    }

    playClickEffect() {
        this.scale.set(0.9, 0.9);
        setTimeout(() => this.scale.set(1, 1), 100);
        AudioManager.playSe({ name: "Cursor1", volume: 80, pitch: 100, pan: 0 });
    }

    playToggleSound() {
        const soundName = this._hud.visible ? "Open1" : "Close1";
        AudioManager.playSe({ name: soundName, volume: 80, pitch: 100, pan: 0 });
    }
}
