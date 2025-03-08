/**
 * Dummy de la classe Game_CustomStat pour les tests.
 */
class Game_CustomStat {
    constructor(name, shortName, description, initialLevel = 0, levelPerPoint = 1) {
        this.name = name;
        this.shortName = shortName;
        this.description = description;
        this.initialLevel = initialLevel;
        this.currentLevel = initialLevel;
        this.levelPerPoint = levelPerPoint;
    }

    addLevel(value) {
        this.currentLevel += value;
        console.log(`${this.name} augmenté de ${value}, niveau actuel : ${this.currentLevel}`);
    }
}

/**
 * Initialisation des stats personnalisées pour chaque acteur.
 */
const _Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    _Game_Actor_setup.call(this, actorId);
    this._customStatPoints = 5; // Nombre de points à distribuer pour le test
    this._customStatsPlus = {
        agi: new Game_CustomStat("Agilité", "agi", "Détermine la vitesse du personnage.", 10, 1),
        str: new Game_CustomStat("Force", "str", "Détermine la puissance physique.", 15, 2),
        def: new Game_CustomStat("Défense", "def", "Réduit les dégâts physiques.", 12, 1),
        mag: new Game_CustomStat("Magie", "mag", "Augmente la puissance magique.", 14, 1)
    };
};