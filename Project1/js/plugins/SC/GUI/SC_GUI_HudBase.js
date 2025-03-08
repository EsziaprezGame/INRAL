class GUI_HudBase extends Window_Base {
  constructor(rect) {
    super(rect);
    this.opacity = 0; // Pas de fond de fenêtre
    this.contentsOpacity = 255;
    this._backgroundSprite = null;
    this.loadBackground();
  }
  imgFolderName() {
    return this.constructor.name.replace("GUI_", "");
  }
  imgFolderPath() {
    return `img/GUI/${this.imgFolderName()}/`;
  }
  //BG--------------------
  loadBackground() {

    let fileName = "bg";
    let bitmap = ImageManager.loadBitmap(this.imgFolderPath(), "bg");
    this.createBackgroundSprite(bitmap);
  }
  createBackgroundSprite(bitmap) {
    if (this._backgroundSprite) this.removeChild(this._backgroundSprite);
    this._backgroundSprite = new Sprite(bitmap);
    this._backgroundSprite.x = 18;
    this._backgroundSprite.y = 18;
    this.addChildToBack(this._backgroundSprite);
  }
  //UPDT------------------
  update() {
    super.update();
    this.updateHud();
  }

  

  updateHud() {
    // Optionnel, à override dans les enfants si besoin
  }
  refresh() {
    this.contents.clear();
    this.drawHud();
  }
  drawHud() {
    // Vide ici, sera redéfini dans les enfants
  }

  // UTILS----------------
  drawHudImg(filename, x, y) {
    let bitmap = ImageManager.loadBitmap(this.imgFolderPath(), filename);
    this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
  };
  drawLabel(value, label, x, y, width) {
    this.changeTextColor(this.systemColor());
    this.drawText(label, x, y, width, "left");
    this.resetTextColor();
    this.drawText(value, x + this.textWidth(label) + 8, y, width, "left");
  }
  drawIconValue(iconIndex, value, x, y) {
    this.drawIcon(iconIndex, x, y);
    this.drawText(value, x + 36, y, 100, "left");
  }
  drawSimpleGauge(current, max, x, y, width, color1, color2) {
    let rate = current / max;
    this.drawGauge(x, y, width, rate, color1, color2);
  }
  drawCenteredText(text, y) {
    let width = this.contents.width;
    this.drawText(text, 0, y, width, "center");
  }
  drawIconText(filename, iconW, iconH, iconIndex, txt, x, y, color = this.contents.textColor, outlinColor = null,fontSize = 20, textTop = false) {
    let bitmap = ImageManager.loadBitmap(this.imgFolderPath(), filename);
    let pw = iconW;
    let ph = iconH;
    let sx = iconIndex * pw;
    let sy = 0;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
    if (txt) {
      this.contents.textColor = color;
      if (outlinColor) {
        this.contents.outlineColor = outlinColor
        this.contents.outlineWidth = 4;
      }
      this.contents.fontSize = fontSize;
      let yTxt = Math.round(y + (ph - ph / 1.8));
      if(textTop) yTxt = Math.round(y - (ph/2) - fontSize);
      this.drawText(txt, x - pw / 2, yTxt, iconW * 2, "center");
    }
  }
  clearHud() {
    this.contents.clear();
  }
  resetFontSettings() {
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.contents.textColor = ColorManager.hudTxtBase();
    this.contents.outlineColor = ColorManager.outlineColor();
    this.contents.outlineWidth = 0;
    this.contents.fontBold = false;
    this.contents.fontItalic = false;
  }
  standardFontFace() {
    return $gameSystem.hudFontFace();
  }
  standardFontSize() {
    return 24;
  }
  openHud(duration = 30) {
    this._closing = false;
    this._opening = true;
    this._fadeDuration = duration;
    this.opacity = 0;
  }

  closeHud(duration = 30) {
    this._opening = false;
    this._closing = true;
    this._fadeDuration = duration;
  }
  showHud() {
    this.visible = true;
  }

  hideHud() {
      this.visible = false;
  }


}
