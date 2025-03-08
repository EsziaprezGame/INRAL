class LightManager {
    constructor() {
        this._globalLightLevel = 1;
        this._tintColor = [255, 255, 255, 0];
    }
    update(){
        if($dataMap && $dataMap.meta.outside){
            this.updateOutsideLight();
        }
    }
    updateOutsideLight() {
        this.applySmoothTint();
    }

    applySmoothTint() {
        const hour = $gameInLudeDate.getHr();
        const dataPartsLight = $dataLight.dayParts;
    
        const dayPartIndex = $gameInLudeDate.getPartOfDayIndex();
        const nextDayPartIndex = (dayPartIndex === 7) ? 1 : dayPartIndex + 1;
    
        const currentPart = dataPartsLight[dayPartIndex];
        const nextPart = dataPartsLight[nextDayPartIndex];
    
        const totalDuration = (nextPart.start - currentPart.start + 24) % 24 || 1;
        const elapsed = (hour - currentPart.start + 24) % 24;
        const progress = elapsed / totalDuration;
    
        const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    
        const smoothTint = currentPart.tint.map((value, i) =>
            lerp(value, nextPart.tint[i], progress)
        );
    
        // Ajustement de la luminosité
        let brightnessFactor = this.getBrightFactor();
        const adjustedTint = smoothTint.map((value, i) => {
            if (i < 3) { // R, G, B
                return Math.round(value * brightnessFactor);
            }
            return value; // Alpha inchangé
        });
    
        this._tintColor = adjustedTint;
        this.applyScreenTint(this._tintColor);
    }
    getBrightFactor(){
        let brightnessFactor = 1;
        if($gameWeather._type == "rain") brightnessFactor -= $gameWeather._intensity * 0.02;
        return brightnessFactor;
    }
    
    resetTint() {
        this._tintColor = [255, 255, 255, 0];
        this._globalLightLevel = 1.0;

        this.applyScreenTint(this._tintColor);
    }

    applyScreenTint(tintColor) {
        $gameScreen.startTint(tintColor, $gameInLudeDate.getTickPerMin() *20); // 10 frames = rapide, à ajuster si besoin
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_LightSys_LightManager",
    icon                : "\u{1F4A1}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_TimSys_Date"],
    loadDataFiles       : [{filename:"LightSystem",instName:"$dataLight"}],
    createObj           : {autoCreate  : true, classProto: LightManager, instName:'$lightManager'},
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);