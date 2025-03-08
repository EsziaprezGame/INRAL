// SC_WeatherSys_Game_Weather.js

class Game_Weather {
    constructor() {
        this.clear();
    }

    clear() {
        this._type = "clear";
        this._tick = 0;
        this._intensity = 0;
        this._duration = 0;
        this._maxDuration = 0;
        this._temperature = this.calculateTargetTemperature();
        this._effects = {};
    }

    set(type, intensity = 1, duration = 60) {
        this._type = type;
        this._intensity = intensity;
        this._duration = duration;
        this._maxDuration = duration;
        this._effects = this.defineEffects(type, intensity);
        this.applyToScreen();
    }

    update() {
        if(this._tick >= $gameInLudeDate.getTickPerMin() * 11){
            let currentSeason = $gameInLudeDate.getSeasonIndex()
            if (this._type === "rain") {
                this.updateRainTrend(currentSeason);
                if (this._intensity <= 0) {
                    this.clear();
                }
            } else if (this._type === "clear") {
                this.checkRainStart(currentSeason);
            }
            if (this._duration > 0) {
                this._duration--;
            }
            this._temperature = Math.floor((this.calculateTargetTemperature() + this._temperature)/2);
            this._tick = 0;
        }else{
            this._tick++;
        }
    }
    getHudIconId(){
        switch(this._type){
            case "rain":
                return this._intensity;
            default:
                return 0;
        }
    }
    getTemperature(){
        return this._temperature;
    }
    checkRainStart(currentSeason) {
        const chance = this.weatherData().rain[currentSeason].triggerChance;
        if (Math.random() * 100 < chance) {
            this.set("rain", 1, this.randomDuration());
        }
    }
    weatherData(){
        return $dataWeather[this.climatZone()];
    }
    climatZone(){
        if($dataMap){
            return $dataMap.meta.climatZone || 0;
        }else{
            return 0;
        }
    }
    updateRainTrend(currentSeason) {
        const data = this.weatherData().rain[currentSeason];
        let roll = Math.random() * 100;

        if (roll < data.intensifyChance) {
            this._intensity = Math.min(this._intensity + 1, 9);
        }else{
            roll = Math.random() * 100;
            if (roll < data.calmChance) 
                this._intensity = Math.max(this._intensity - 1, 0);
        }
        
        this.applyToScreen();
    }

    applyToScreen() {
        const power = this._intensity / 9; // Puissance RMMZ entre 0.0 et 1.0
        const type = this._type === "clear" ? "none" : this._type;
        if(!$gameParty.inBattle())
            $gameScreen.changeWeather(type, power, 0); // 0 = changement immédiat
    }

    randomDuration() {
        return Math.floor(Math.random() * 180) + 60;
    }

    defineEffects(type, intensity) {
        if (type === "rain") {
            return {
                visibility: -10 * intensity,
                movementPenalty: -5 * intensity,
            };
        }
        return {};
    }
    getWeather() {
        return { type: this._type, intensity: this._intensity };
    }
    calculateTargetTemperature() {
        let baseTemp = this.weatherData().baseTemperature[$gameInLudeDate.getSeasonIndex()];

        // Influence météo
        if (this._type === "rain") baseTemp -= 4 + this._intensity;
        if (this._type === "clear") baseTemp += 2;
        if ($gameInLudeDate.isNightTime()) baseTemp -= 2;
        if ($gameInLudeDate.getPartOfDayIndex() === 7) baseTemp -= Math.randomInt(2) + 2;
        if ($dataMap && $dataMap.meta.outside) baseTemp -= Math.randomInt(2);
        baseTemp += Math.randomInt(3);
        baseTemp -= Math.randomInt(3);

        // Autres ajustements possibles ici (ex : biome avec climatZone)
        return baseTemp.clamp(0, 40);
    }

}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_WeatherSys_Weather",
    icon                : "\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_TimSys_Date"],
    loadDataFiles       : [{filename:"Weather",instName:"$dataWeather"}],
    createObj           : {autoCreate  : true, classProto: Game_Weather, instName: '$gameWeather'},
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);