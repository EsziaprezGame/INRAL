
// ======================
// Factions
// ======================

class Game_Faction {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._description = data.description;
        this._leaderClanId = data.leaderClanId || 0;
        this._membersCache = null;
    }

    get clans() {
        return $gameClans.all().filter(clan => clan.factionId === this._id);
    }

    addClans(...params) {
        const clanIds = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
        clanIds.forEach(clanId => {
            const clan = $gameClans.clan(clanId);
            if (clan) clan.factionId = this._id;
        });
        this.refreshMembers();
    }

    get leaderClan() {
        return $gameClans.clan(this._leaderClanId) || null;
    }

    leaderActor() {
        return this.leaderClan ? this.leaderClan.leader : null;
    }

    getAllMembers() {
        if (!this._membersCache) {
            this._membersCache = [];
            this.clans.forEach(clan => {
                this._membersCache = this._membersCache.concat(clan.getAllMembers());
            }, this);
        }
        return this._membersCache;
    }

    refreshMembers() {
        this._membersCache = null;
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

class Game_Factions {
    constructor() {
        this._data = [];
    }

    faction(factionId) {
        if (!factionId) alert('Game_Factions - error factionId');
        if (!this._data[factionId]) {
            if ($dataFactions[factionId]) {
                this._data[factionId] = new Game_Faction($dataFactions[factionId]);
            } else {
                alert(`Game_Factions - error: dataFactions[${factionId}] does not exist`);
            }
        }
        return this._data[factionId];
    }

    all() {
        return this._data.filter(f => f);
    }
}