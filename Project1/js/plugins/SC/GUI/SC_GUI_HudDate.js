class GUI_HudDate extends GUI_HudBase {
    constructor(rect) {
        super(rect);
        this._currentDate = ""; // Pour suivre les changements

        this.refresh();
    }
    updateHud() {
        const newTimestamp = $gameInLudeDate.timestamp;
        if (newTimestamp !== this._currentTimestamp) {
            this._currentTimestamp = newTimestamp;
            this.refresh();
        }
    }
    refresh() {
        this.clearHud();
        this.resetFontSettings();
        this.drawHud();
    }
    drawHud() {
        this.drawCenteredText($gameInLudeDate.getHudWording(), 226);
        this.drawDayPhase();
        this.drawClock();
        this.resetFontSettings();
        this.drawHrTxt();
        if ($gameInLudeDate.isNightTime())
            this.drawMoon();
        this.drawSeason();
        this.drawWeather();
        if ((this._pt_hr && this._pt_min))
            this.drawDayPhaseTxt()
    }
    drawHrTxt() {
        this.contents.fontSize = 32;
        this.drawCenteredText($gameInLudeDate.getHrWording(), 210);
    }
    drawDayPhase() {
        let x = 40,
            y = 100,
            pIndex = $gameInLudeDate.getPartOfDayIndex();

        this.drawIconText("dayPhase", 74, 74, pIndex, null, x, y);
    }
    drawDayPhaseTxt() {

        let pName = $gameInLudeDate.getPartOfDayName().toUpperCase();
        this.contents.fontSize = 20;
        this.contents.textColor = "rgba(255,255,255,0.5)";
        this.contents.outlineColor = "rgba(0,0,0,0.3)";

        this.drawCenteredText(pName, 200);
    }
    drawClock() {
        let x = 6, y = 64;
        this.drawHudImg("clockLayer", x, y);
        if (!this._pt_hr || !this._pt_min) {
            this.drawPoints(x + 13, y + 13);
        } else {
            this.updatePointsRotation();
            this.drawClockHand("ul", x + 76, y + 76);
        }

    }
    drawPoints(x, y) {
        this.drawClockHand("pt_hr", x, y);
        this.drawClockHand("pt_min", x, y);
    }
    updatePointsRotation() {

        const hour = $gameInLudeDate.getHr();
        const minute = $gameInLudeDate.getMin();

        // Taux pour rotation (entre 0 et 1)
        const hourRate = (((hour % 12) + minute / 60) / 12) - 0.25;
        const minuteRate = (minute / 60) - 0.25;

        // Conversion du rate en angle horaire
        // 0 = 12h, 0.25 = 3h, 0.5 = 6h, 0.75 = 9h
        this._pt_min.rotation = (minuteRate * Math.PI * 2) - Math.PI / 2;
        this._pt_hr.rotation = (hourRate * Math.PI * 2) - Math.PI / 2;
    }
    drawClockHand(filename, x, y) {
        const bitmap = ImageManager.loadBitmap(this.imgFolderPath(), filename);

        bitmap.addLoadListener(() => {
            this['_' + filename] = new Sprite(bitmap);

            // Centrage du pivot pour que l'aiguille tourne autour de son centre
            this['_' + filename].anchor.set(0.5, 0.5);

            // Position du pivot au bon endroit
            this['_' + filename].x = x + bitmap.width / 2;
            this['_' + filename].y = y + bitmap.height / 2;



            this.addChild(this['_' + filename]);
        });
    }
    
    drawMoon() {
        let seasonIndex = $gameInLudeDate.getSeasonIndex();
        let color = ColorManager.seasonColor(seasonIndex);
        let colorO = ColorManager.seasonOutlineColor(seasonIndex);
        let txt = $gameMoon.currentPhase();
        let y = 20;
        let x = 65;
        this.drawIconText('moon', 24, 24, $gameMoon.getHudIndex(), txt, x, y, color, colorO);
    }
    drawSeason() {
        let x = this.contents.width - 50;
        let y = 20;
        let seasonIndex = $gameInLudeDate.getSeasonIndex();
        let seasonName = $gameInLudeDate.getSeasonName().toUpperCase();
        let color = ColorManager.seasonColor(seasonIndex);
        let outlinColor = ColorManager.seasonOutlineColor(seasonIndex);

        this.drawIconText("seasons", 34, 34, seasonIndex, seasonName, x, y, color, outlinColor);
    }
    drawWeather() {
        let x = 16;
        let y = 20;
        let wIndex = $gameWeather.getHudIconId();
        let temperature = $gameWeather.getTemperature() + 'º';
        let color = ColorManager.seasonColor(1);

        this.drawIconText("meteo", 24, 24, wIndex, temperature, x, y, color);

    }
    clearHud() {
        super.clearHud()
    }

}
SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_GUI_HudDate",
    icon                : "\u{1F532}\u{27A4}\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : [
        "SC_SystemLoader",
        "SC_TimSys_Date",
        "SC_LightSys_LightManager",
        "SC_MoonSys_Moon",
        "SC_WeatherSys_Weather"
    ],
    loadDataFiles       : [],
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);