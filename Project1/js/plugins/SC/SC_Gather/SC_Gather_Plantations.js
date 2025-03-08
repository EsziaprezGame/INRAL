class Game_Plantation {
    constructor(id = null) {
        this._id = id;
        this._tick = Math.randomInt($gameInLudeDate.getTotalMinPerDay() * 10);
        this._charChange = false;
        this._indexChange = false;
        this.initMembers();
        this.setup($dataPlantations[this._id]);
        
    }
    initMembers() {
        this._name = "";
        this._seedId = null;
        this._stepId = 0;
        this._grow = 0;
        this._hydration = 0;
        this._fertilizer = 0;
        this._dryness = 0;
        this._sickness = 0;
        this._supportTemp
        this._gathers = [];
    }
    setup(data){
        this._name      = data.name;
        this._seedId    = data.seedId;
        this._stepId    = data.stepId;
    }
    seedData(){
        return $dataSeeds[this._seedId];
    }
    stepsData() {
        return $dataSeedSteps[this.seedData().stepsId].steps;
    }
    isSeasonal(){
        return this.seedData().isSeasonal;
    }
    getSupportHighTemp(){
        return (this.currentStep().supportTemp)? this.currentStep().supportTemp[1] : 25;
    }
    getSupportLowTemp(){
        return (this.currentStep().supportTemp)? this.currentStep().supportTemp[0] : 5;
    }
    currentStep() {
        return this.stepsData()[this._stepId];
    }
    visualData(){
        return $dataSeedChars[this.currentStep().characterId];
    }

    distantUpdate(){

    }
    update() {
        this.updateRain();
        this.updateTeamperature();
        if(this._tick > $gameInLudeDate.getTickPerMin() * $gameInLudeDate.getTotalMinPerDay()){
            if (this.isDead() || !this.hasSeed())return;
            this.consumeHydration();
            this.consumeFertilizer();
            this.advanceGrowth();
            this.updateGathers();
            this.checkEvolution();
            this._tick = 0;
        }else{
            this._tick++;
        }
    }
    updateRain(){
        if($gameWeather._type == "rain" && this._hydration < $dataPlantSystem.maxIrrigation)
            this.irrigate(Math.randomInt($gameWeather._intensity) + 1);
    }
    updateTeamperature(){
        if(this._tick % 24 === 0){
            let temp = $gameWeather.getTemperature();
            if(temp > this.getSupportHighTemp() && Math.randomInt(40) < temp)
                this.consumeHydration();
            if(temp < this.getSupportLowTemp())
                this._sickness++;
        }
    }
    consumeHydration() {
        const step = this.currentStep();

        
        if (this._hydration >= step._needHydra) {
            this._hydration -= step._needHydra;
            this._dryness = 0;
        } else {
            this._dryness++;
            if (this._dryness > step.supportDryness && this._hydration == 0){
                this._sickness++;
            }
            this._hydration = 0;
        }
    }
    consumeFertilizer() {
        if (this._fertilizer > 0) {
            let cons = Math.min(this._fertilizer, $dataPlantSystem.maxFertilizerCons);
            this._grow += cons;
            this._fertilizer -= cons;
            this._sickness -= Math.randomInt(1);
        }
    }
    advanceGrowth() {
        const step = this.currentStep();
        if($gameInLudeDate.isNightTime() && $gameMoon.currentPhaseIndex() === 4)
            this._grow += Math.randomInt(1);
        this._grow += step.growSpeed;
    }
    updateGathers() {
        let grow = false;
        this.currentStep().gatherIds.forEach((gatherId,index)=>{
            let gather = $dataGathers[gatherId];
            if(!grow){
                let stock = this._gathers[index] || {num:0, srcIndex:index};

                if(stock.num < gather.maxNum && this._grow > gather.needToGrow){
                        this._grow -=  gather.needToGrow;
                        stock = Math.min(stock + gather.growSpeed,gather.maxNum);
                        this.getGatherGrowNextStep(gather);
                }
            }
        }, this)
    }
    checkEvolution() {
        if(this._sickness > 10){
            this.die();
            return;
        }else{
            this._sickness -= Math.randomInt(1);
        }
        const step = this.currentStep();
        if (this._grow >= $dataPlantSystem.maxGrow && step.nextStep) {
            this._stepId = this.getGrowNextStepId();
            this._grow = 0;
        }
    }
    die() {
        this._grow = 0;
        this._hydration = 0;
        this._fertilizer = 0;
        this._dryness = 0;
        if(!this.isDieGather())
            this._stepId = this.getDieStep();
        
        this._gathers = [];
        this._charChange = false;
        this._indexChange = false;
    }
    isDieGather(){
        let isDie = false;
        let stepId;

        this._gathers.forEach((stock)=>{
            let gatherId = this.currentStep().gatherIds[stock.srcIndex];
            let gather = $dataGathers[gatherId]

            if(stock.num > 0  && !isDie){
                stock.num--;
                isDie = true;
                stepId = this.getGatherSomeDieStepId(gather);
            }
            if(stock.num <= 0 && isDie){
                stock.num = 0;
                stepId = this.getGatherDieStepId(gather);
            }
        }, this);

        if(isDie) this._stepId = stepId;
        return isDie
    }
    getGrowNextStepId(step){
        return this.getSeasonalValue(step.nextStep);
    }
    getDieStep(){
        return this.getSeasonalValue(this.currentStep().dieNextStep);
    }
    getGatherGrowNextStep(gather){
        this.getSeasonalValue(gather.nextStepGrow);
    }
    getGatherSomeDieStepId(gather){
        return this.getSeasonalValue(gather.nextStepSomeDie);
    }
    getGatherDieStepId(gather){
        return this.getSeasonalValue(gather.nextStepDie);
    }
    getSeasonalValue(value){
        if(!this.isSeasonal())
            return value;
        else
            return value[$gameInLudeDate.getSeasonId()];
    }
    applyCharacterToEvent(event) {
        if (!event) return;
        let characterData = this.visualData();
        let index = this.getCharIndex(characterData.index);
        if(this._charChange != characterData || this._indexChange != index){
            let filename = characterData.name;
            event.setImage(filename, index);
            event._directionFix = false;
            event.setDirection(characterData.dir);
            event.setStepAnime(characterData.stepAnim);
            event.setWalkAnime(false);
            event._directionFix = true;
            event.refresh();
            $gameMap.requestRefresh();
            
            this._charChange = characterData;
            this._indexChange = index;
        }
    }
    getCharIndex(index){
        if(this.isDead()){
            return index;
        }else if(this._hydration > 0){
            return index + 4;
        }else if(this._sickness > 5){
            return index + 1;
        }
        return index;
    }
    hasSeed() {
        return this._seedId !== null;
    }
    isDead() {
        return this._stepId === 0 || this._stepId === this.stepsData().length - 1;
    }
    
    load(data) {
        Object.assign(this, data);
    }
    save() {
        return {
            _id         : this._id,
            _seedId     : this._seedId,
            _stepId     : this._stepId,
            _grow       : this._grow,
            _hydration  : this._hydration,
            _fertilizer : this._fertilizer,
            _dryness    : this._dryness,
            _gathers    : this._gathers
        };_
    }

    gather(actor){

    }
    irrigate(value){
        this._hydration = Math.min(this._hydration + value, $dataPlantSystem.maxIrrigation)  
    }
    fertilize(value){
        this._fertilizer = Math.floor.min(this._fertilizer + value, 10)
    }
    
    setMapKey(key){
        if(!this._mapKey){
            this._mapKey = key;
        }
    }
    mapKey(){
        return this._mapKey;
    }
}
class Game_Plantations {
    constructor() {
        this._plantations = [];
    }
    plant(plantId) {
        if (!this._plantations[plantId]) {
            this._plantations[plantId] = new Game_Plantation(plantId);
        }
        return this._plantations[plantId];
    }
    updateAll() {
        this._plantations.forEach(plantation=>{
            
            if(plantation.mapKey()[0] == $gameMap.mapId()){
                plantation.update();
            }else{
                plantation.distantUpdate();
            }
        })
        this.loadMapPlants();
    }
    loadMapPlants(){
        $dataMap.events.forEach((event)=>{
            if(event){
                event.meta = event.meta || DataManager.extractEventMetaFromFirstComment(event);
                if(event.meta.plantation){
                    let plant = this.plant(event.meta.plantation);
                    plant.setMapKey([$gameMap.mapId(), event.id])
                    plant.applyCharacterToEvent($gameMap.event(event.id));
                }
            }
        })
    }
    load(data) {
        data.forEach((plantData) => {
            const plantation = new Game_Plantation();
            plantation.load(plantData);
            this._plantations.set(plantation.id, plantation);
        }, this);
    }
    save() {
        return Array.from(this._plantations.values()).map(p => p.save());
    }
}
SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Gather_Plantation",
    icon                : "\u{1F331}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_TimSys_Date", "SC_WeatherSys_Weather"],
    loadDataFiles       : [
        {filename:"Plantations",instName:"$dataPlantations"},
        {filename:"Seeds",      instName:"$dataSeeds"},
        {filename:"SeedSteps", instName:"$dataSeedSteps"},
        {filename:"SeedCharacters", instName:"$dataSeedChars"},
        {filename:"Gathers", instName:"$dataGathers"},
        {filename:"PlantationSystem", instName:"$dataPlantSystem"}

    ],
    createObj           : {autoCreate  : true, classProto: Game_Plantations, instName: '$gamePlantations'},
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);