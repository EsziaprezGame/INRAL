/** SimCraft Aftermath 
/*:
 * @target MZ
 * @plugindesc (v0.1) Ajoute une scène après un combat victorieux pour distribuer des points de stats.
 * @author By '0mnipr3z' © 2025 licensed under CC BY-NC 4.0 
 * @help
 * Ce plugin permet d'ouvrir une scène après un combat victorieux, 
 * permettant de distribuer les points de stats des acteurs.
 *  
 * @param StatDistributionScene
 * @text Scène de distribution des stats
 * @desc Active la scène de distribution après un combat victorieux.
 * @type boolean
 * @default true
 *
 * @note Ce plugin est conçu pour fonctionner avec RPG Maker MZ.
 * 
 * @file simcraft_x_visustella_aftermath.js 
 * @copyright Pierre-André '0mnipr3z' Hernandez
 * @license © 2025 licensed under CC BY-NC 4.0 
 */

var Imported = Imported || {};
Imported.CustomStatScene = true;



/**
 * Fenêtre affichant l'acteur en cours de modification et ses points restants.
 * @class Window_CustomStatActor
 * @extends Window_Base
 */
class Window_CustomStatActor extends Window_Base {
    initialize() {
        const width = Graphics.boxWidth;
        const height = this.fittingHeight(1);
        const y = Graphics.boxHeight - height;
        super.initialize(new Rectangle(0, y, width, height));
        this._actor = null;
    }

    /**
     * Définit l'acteur courant et met à jour l'affichage.
     * @param {Game_Actor} actor - L'acteur courant.
     */
    setActor(actor) {
        this._actor = actor;
        this.refresh();
    }

    /**
     * Rafraîchit l'affichage de la fenêtre.
     */
    refresh() {
        this.contents.clear();
        if (!this._actor) return;
        const name = this._actor.name();
        const level = this._actor.level;
        const points = this._actor._customStatPoints;
        const text = `${name} - Niveau ${level} | Points restants : ${points}`;
        this.drawText(text, 0, 0, this.innerWidth, 'center');
    }
}

/**
 * Fenêtre de confirmation pour valider ou annuler les modifications des stats.
 * @class Window_ConfirmCustomStats
 * @extends Window_Command
 */
class Window_ConfirmCustomStats extends Window_Command {
    initialize() {
        const width = 240;
        const height = this.windowHeight();
        const x = (Graphics.boxWidth - width) / 2;
        const y = (Graphics.boxHeight - height) / 2;
        super.initialize(new Rectangle(x, y, width, height));
        //this.openness = 0;
        this.deactivate();
    }

    /**
     * Calcule la hauteur de la fenêtre.
     * @returns {number}
     */
    windowHeight() {
        return this.fittingHeight(2);
    }

    /**
     * Définit les options de la fenêtre.
     */
    makeCommandList() {
        this.addCommand("Valider", "ok");
        this.addCommand("Annuler", "cancel");
    }

    /**
     * Affiche et active la fenêtre.
     */
    showConfirm() {
        this.show();
        this.active = true;
    }

    /**
     * Cache et désactive la fenêtre.
     */
    hideConfirm() {
        this.hide();
        this.deactivate();
    }
}
/**
* Scène permettant la distribution des points de stats personnalisées.
* @class Scene_CustomStat
* @extends Scene_MenuBase
*/
class Scene_CustomStat extends Scene_MenuBase {
    /**
* Initialise la scène et prépare la liste des acteurs ayant des points à distribuer.
*/
    initialize() {
        super.initialize();
        this._actorsQueue = $gameParty.members().filter(actor => actor._customStatPoints > 0);
        this._currentActorIndex = 0;
    }

    /**
* Crée les fenêtres de la scène et initialise l'affichage.
*/
    create() {
        super.create();
        this.createStatWindow();
        this.createConfirmWindow();
        this.createActorWindow();
        this.refreshActor();
        this._statWindow.activate();
    }

    /**
* Crée et ajoute la fenêtre d'affichage des statistiques.
*/
    createStatWindow() {
        this._statWindow = new Window_CustomStat();
        this.addWindow(this._statWindow);
    }

    /**
* Crée et ajoute la fenêtre de confirmation pour valider ou annuler les modifications.
*/
    createConfirmWindow() {
        this._confirmWindow = new Window_ConfirmCustomStats();
        this._confirmWindow.setHandler("ok", this.applyStats.bind(this));
        this._confirmWindow.setHandler("cancel", this.cancelStats.bind(this));
        this.addWindow(this._confirmWindow);
        this._confirmWindow.hide();
    }

    createActorWindow() {
        this._actorWindow = new Window_CustomStatActor();
        this.addWindow(this._actorWindow);
    }

    /**
     * Recharge les données du prochain acteur et initialise les valeurs temporaires des stats.
     */
    refreshActor() {
        if (this._currentActorIndex < this._actorsQueue.length) {
            this._currentActor = this._actorsQueue[this._currentActorIndex];
            this._tempStats = {};
            for (const [key, stat] of Object.entries(this._currentActor._customStatsPlus)) {
                this._tempStats[key] = {
                    name: stat.name,
                    shortName: stat.shortName,
                    description: stat.description,
                    currentLevel: stat.currentLevel
                };
            }
            this._statWindow.setActor(this._currentActor, this._tempStats);
            this._actorWindow.setActor(this._currentActor);
            this._statWindow.activate();
            this._statWindow.show();
            this._confirmWindow.deactivate();
            this._confirmWindow.hide();
        } else {
            SceneManager.pop();
        }
    }

    /**
* Applique les modifications validées aux stats de l'acteur courant.
*/
    applyStats() {
        for (const [key, tempStat] of Object.entries(this._tempStats)) {
            const originalStat = this._currentActor._customStatsPlus[key];
            const valueDiff = tempStat.currentLevel - originalStat.currentLevel;
            if (valueDiff > 0) originalStat.addLevel(valueDiff);
        }
        this._currentActor._customStatPoints = 0;
        this._currentActorIndex++;
        this.refreshActor();
    }

    /**
* Annule les modifications des stats et restaure les valeurs initiales.
*/
    cancelStats() {
        this._tempStats = {};
        for (const [key, stat] of Object.entries(this._currentActor._customStatsPlus)) {
            this._tempStats[key] = {
                name: stat.name,
                shortName: stat.shortName,
                description: stat.description,
                currentLevel: stat.currentLevel
            };
        }
        this._statWindow.setActor(this._currentActor, this._tempStats);
        this._confirmWindow.hide();
    }
}

/**
* Fenêtre affichant les statistiques personnalisées et permettant de les modifier.
* @class Window_CustomStat
* @extends Window_Command
*/
class Window_CustomStat extends Window_Command {
    initialize() {
        const width = Graphics.boxWidth / 2;
        const height = Graphics.boxHeight / 2;
        super.initialize(new Rectangle(0, 0, width, height));
        this._actor = null;
        this._tempStats = {};
    }

    /**
     * Définit l'acteur courant et les statistiques temporaires à afficher.
     * @param {Game_Actor} actor - L'acteur dont on modifie les stats.
     * @param {Object} tempStats - Les valeurs temporaires des stats.
     */
    setActor(actor, tempStats) {
        this._actor = actor;
        this._tempStats = tempStats;
        // Log déplacé dans processOk() pour éviter les erreurs de contexte.
        this.refresh();
    }

    /**
     * Construit la liste des commandes à afficher.
     */
    makeCommandList() {
        if (!this._actor) return;
        for (const [key, stat] of Object.entries(this._tempStats)) {
            this.addCommand(`${stat.name}: ${stat.currentLevel}`, key);
        }
    }


    processOk() {
        console.log('Touche OK pressée');
        const symbol = this.currentSymbol();
        console.log(`Stat sélectionnée : ${symbol}`);
        if (this._actor._customStatPoints > 0) {
            const levelPerPoint = this._actor._customStatsPlus[symbol].levelPerPoint || 1;
            this._tempStats[symbol].currentLevel += levelPerPoint;
            this._actor._customStatPoints--;
            console.log(`Augmentation de ${symbol}, nouveau niveau temporaire : ${this._tempStats[symbol].currentLevel}, points restants : ${this._actor._customStatPoints}`);
            this.refresh();
            this.activate();
            if (this._actor._customStatPoints === 0) {
                SceneManager._scene._confirmWindow.showConfirm();
                this.deactivate();
                this.hide();
            }
        } else {
            this.activate();
        }
    }

    /**
     * Rafraîchit l'affichage des statistiques.
     */
    refresh() {
        super.refresh();
        this.clearCommandList();
        this.makeCommandList();
        this.createContents();
        this.drawAllItems();
    }
}

