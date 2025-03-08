let $gameClans, $gameFactions;

const $dataFactions = [
    null,
    { id: 1, name: "Royaume de Sfergrad", description: "Le puissant royaume lycan de Sfergrad.", leaderClanId: 1 },
    { id: 2, name: "Guilde des Marchands Saurionne", description: "Une guilde commerçante omniprésente.", leaderClanId: 6 }
];

const $dataClans = [
    null,
    { id: 1, name: "Clan Gwilth", description: "Famille royale de Sfergrad.", leaderId: 1, factionId: 1, actorIds: [1, 2, 3, 4] },
    { id: 2, name: "Clan des Serfs", description: "Travailleurs du royaume.", leaderId: 5, factionId: 1, actorIds: [5, 6, 7, 8] },
    { id: 3, name: "Clan des Nobles", description: "Noblesse de Sfergrad.", leaderId: 9, factionId: 1, actorIds: [9, 10, 11] },
    { id: 4, name: "Clan des Bourgeois", description: "Artisans et marchands locaux.", leaderId: 12, factionId: 1, actorIds: [12, 13, 14] },
    { id: 5, name: "Clan des Soldats", description: "Forces armées loyales.", leaderId: 15, factionId: 1, actorIds: [15, 16, 17, 18] },
    { id: 6, name: "Clan L", description: "Marchands Saurions.", leaderId: 19, factionId: 2, actorIds: [19, 20, 21] }
];

const $dataRelations = [
    null,
    {
        5: { status: 1, e: 20, l: 50, s: 10 } // Relation entre actorId 1 et actorId 5
    },
    {
        1: { status: 1, e: 20, l: 50, s: 10 } // Relation entre actorId 2 et actorId 1
    }
];


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
        }, this);
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
// ======================
// RelationStatus
// ======================
class Game_RelationStatus{
    constructor(relation){
        this.initMembers();
        this.setup(relation);
    }
    initMembers(){
        this._key = ""
    }
}
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

// ======================
// Extension Game_Actor
// ======================

const scClone = {};
scClone.GameActor_init = Game_Actor.prototype.initialize;

Game_Actor.prototype.initialize = function(actorId) {
    scClone.GameActor_init.call(this, actorId);
    this.setupRelationSystem(actorId);
};

Game_Actor.prototype.setupRelationSystem = function(actorId) {
    this._clanId = ($dataRelations[actorId] && $dataRelations[actorId][0]?.clanId) || 1; // Clan neutre par défaut
    this._relations = new Game_Relationships(actorId);
};

// ======================
// Initialisation globale
// ======================

$gameFactions = new Game_Factions();
$gameClans = new Game_Clans();

// ======================
// UTILS
// ======================

function averageRelation(fromActors, toActors) {
    if (!Array.isArray(fromActors)) fromActors = [fromActors];
    if (!Array.isArray(toActors)) toActors = [toActors];

    let total = { e: 0, l: 0, s: 0 };
    let count = 0;

    fromActors.forEach(fromActor => {
        toActors.forEach(toActor => {
            const relation = fromActor._relations.relation(toActor._actorId).stats;
            total.e += relation.e;
            total.l += relation.l;
            total.s += relation.s;
            count++;
        });
    });

    if (count === 0) return { e: 0, l: 0, s: 0 };

    return {
        e: total.e / count,
        l: total.l / count,
        s: total.s / count
    };
}