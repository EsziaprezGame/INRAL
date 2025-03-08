
// ======================
// Clans
// ======================

class Game_Clan {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._description = data.description;
        this._leaderId = data.leaderId;
        this._factionId = data.factionId;
        this._membersCache = null;
    }

    get faction() {
        return $gameFactions.faction(this._factionId) || null;
    }

    set factionId(factionId) {
        this._factionId = factionId;
        this.refreshMembers();
    }

    get factionId() {
        return this._factionId;
    }

    get leader() {
        return $gameActors.actor(this._leaderId) || null;
    }

    set leader(actorId) {
        this._leaderId = actorId;
    }

    getAllMembers() {
        if (!this._membersCache) {
            const clanData = $dataClans[this._id];
            if (!clanData || !clanData.actorIds) return [];
            this._membersCache = clanData.actorIds.map(id => $gameActors.actor(id)).filter(actor => actor);
        }
        return this._membersCache;
    }

    refreshMembers() {
        this._membersCache = null;
        const faction = this.faction;
        if (faction) faction.refreshMembers();
    }
    relationWithActor(actorId) {
        const members = this.getAllMembers();
        const actor = $gameActors.actor(actorId);
        return averageRelation(members, actor);
    }
    
    relationWithFaction(factionId) {
        const members = this.getAllMembers();
        const targetFaction = $gameFactions.faction(factionId);
        const targetMembers = targetFaction.getAllMembers();
        return averageRelation(members, targetMembers);
    }
    
    relationWithClan(clanId) {
        const members = this.getAllMembers();
        const targetClan = $gameClans.clan(clanId);
        const targetMembers = targetClan.getAllMembers();
        return averageRelation(members, targetMembers);
    }
    
}

class Game_Clans {
    constructor() {
        this._data = [];
    }

    clan(clanId) {
        if (!clanId) alert('Game_Clans - error clanId');
        if (!this._data[clanId]) {
            if ($dataClans[clanId]) {
                this._data[clanId] = new Game_Clan($dataClans[clanId]);
            } else {
                alert(`Game_Clans - error: dataClans[${clanId}] does not exist`);
            }
        }
        return this._data[clanId];
    }

    all() {
        return this._data.filter(c => c);
    }
}