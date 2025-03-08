class Game_Moon {
    constructor() {
      this.cycleLength = 28; // Durée totale du cycle lunaire (en jours)
      this.phaseList = [
        'Nouvelle Lune',
        'Premier Croissant',
        'Premier Quartier',
        'Gibbeuse Croissante',
        'Pleine Lune',
        'Gibbeuse Décroissante',
        'Dernier Quartier',
        'Dernier Croissant'
      ];
      this.phaseDuration = this.cycleLength / this.phaseList.length; // Durée d'une phase
    }
  
    // Jour actuel dans le cycle lunaire
    currentCycleDay() {
      const totalDays = Math.floor($gameInLudeDate.timestamp / (24 * 60 * 60)); // Timestamp converti en jours
      return totalDays % this.cycleLength;
    }
  
    // Index de la phase lunaire actuelle
    currentPhaseIndex() {
      return Math.floor(this.currentCycleDay() / this.phaseDuration);
    }
    getHudIndex(){
        if($gameInLudeDate.isNightTime())
            return this.currentPhaseIndex()
        else
            return 8;
    }
    // Nom de la phase actuelle
    currentPhase() {
      return this.phaseList[this.currentPhaseIndex()];
    }
  
    // Debug ou interface
    displayPhase() {
      console.log(
        `Jour lunaire : ${this.currentCycleDay()} - Phase : ${this.currentPhase()} (Index : ${this.currentPhaseIndex()})`
      );
    }
  }

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_MoonSys_Moon",
    icon                : "\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_TimSys_Date"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : true, classProto: Game_Moon, instName: '$gameMoon'},
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);