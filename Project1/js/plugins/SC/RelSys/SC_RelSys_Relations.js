// ======================
// Relations
// ======================

class Game_Relation {
    constructor(data) {
        this.setup(data);
    }

    setup(data) {
        this.stats = {
            status: new Game_RelationStatus(this), // 0 = indéfini / inconnu
            e: data.e || 0,           // entente / mésentente-colere
            l: data.l || 0,           // loyauté / déloyauté-influence
            s: data.s || 0            // soumission / insoumission-rebellion
        };
    }
}

class Game_Relationships {
    constructor(actorId) {
        this._actorId = actorId;
        this._data = [];
    }

    relation(interlocId) {
        if (!interlocId) {
            alert('Game_Relationships - error interlocId');
            return null;
        }
        if (!this._data[interlocId]) {
            if ($dataRelations[this._actorId] && $dataRelations[this._actorId][interlocId]) {
                this._data[interlocId] = new Game_Relation($dataRelations[this._actorId][interlocId]);
            } else {
                this._data[interlocId] = new Game_Relation(this.getDefaultRelation());
            }
        }
        return this._data[interlocId];
    }

    getDefaultRelation() {
        return {
            status: 0,
            e: 0,
            l: 0,
            s: 0
        };
    }
}