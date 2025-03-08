class Game_Fauna {
    constructor(faunaId) {
        this._id = faunaId;
        this._data = $dataFaunas[faunaId] || {};
        
        this.initMembers();
        this.setupActor();
        this.setupEnemy();
    }
    initMembers() {
        this._tick = 0;
        this._mapKey = null;
        this._actor = null;
        this._enemy = null;
    }
    setupActor() {
        if (this._data.actorId) {
            this._actor = new Game_Actor(this._data.actorId);
        }
    }
    setupEnemy() {
        if (this._data.enemyId) {
            this._enemy = new Game_Enemy(this._data.enemyId);
        }
    }
    setMapKey(mapKey) {
        this._mapKey = mapKey;
    }
    mapKey() {
        return this._mapKey;
    }
    update() {
        if(this._tick > $gameInLudeDate.getTickPerMin()){
            this.processBehavior();
            this._tick = 0;
        }else{
            this._tick++;
        }
        
    }
    distantUpdate() {
        /** Mise à jour allégée pour les entités hors carte */
    }
    applyCharacterToEvent(event) {
        if (!event) return;
        event.setImage(this._actor.characterName(), this._actor.characterIndex());
    }
    processBehavior() {
        if (Math.random() < 0.05) {
            this.moveRandomly();
        }
    }
    moveRandomly() {
        const direction = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
        const event = $gameMap.event(this._mapKey[1]);
        if (event) event.moveStraight(direction);
    }
    isDead() {
        return this._actor.hp <= 0;
    }
}

class Game_Faunas {
    constructor() {
        this._faunas = [];
    }

    fauna(faunaId) {
        if (!this._faunas[faunaId]) {
            this._faunas[faunaId] = new Game_Fauna(faunaId);
        }
        return this._faunas[faunaId];
    }
    updateAll() {
        this._faunas.forEach(fauna => {
            if (fauna.mapKey()[0] === $gameMap.mapId()) {
                fauna.update();
            } else {
                fauna.distantUpdate();
            }
        });
        this.loadMapFaunas();
    }
    loadMapFaunas() {
        if (!$dataMap || !$dataMap.events) return;

        $dataMap.events.forEach((event) => {
            if (event) {
                event.meta = event.fauna || DataManager.extractEventMetaFromFirstComment(event);
                if (event.meta.fauna) {
                    let fauna = this.fauna(event.meta.fauna);
                    fauna.setMapKey([$gameMap.mapId(), event.id]);
                    fauna.applyCharacterToEvent($gameMap.event(event.id));
                }
            }
        });
    }
}
SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_FaunaSys_Faunas",
    icon                : "\u{1F98C}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_TimSys_Date"],
    loadDataFiles       : [
        {filename:"Faunas",instName:"$dataFaunas"}
    ],
    createObj           : {autoCreate  : true, classProto: Game_Faunas, instName: '$gameFaunas'},
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);