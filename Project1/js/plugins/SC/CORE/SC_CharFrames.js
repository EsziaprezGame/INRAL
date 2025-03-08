/*:
 * @target MZ
 * @plugindesc Ajuste les characters dont le nom commence par "4" pour utiliser 4 frames au lieu de 3.
 * @author ChatGPT
 * @help
 * Ce plugin modifie la gestion des animations des personnages
 * pour qu'ils utilisent 4 frames au lieu de 3 si leur fichier commence par "4".
 * 
 * Aucun paramètre de configuration n'est nécessaire.
 */

(() => {
    Sprite_Character.prototype.patternWidth = function() {
        const characterName = this._character.characterName();
        let wNum = 12;
        if (characterName.startsWith("4")) wNum = 16;
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        } else if (this._isBigCharacter) {
            return this.bitmap.width / 3;
        } else {
            return this.bitmap.width / wNum;
        }
    };
    
    Sprite_Character.prototype.patternHeight = function() {
        if (this._tileId > 0) {
            return $gameMap.tileHeight();
        } else if (this._isBigCharacter) {
            return this.bitmap.height / 4;
        } else {
            return this.bitmap.height / 8;
        }
    };

    const _Sprite_Character_characterFrame = Sprite_Character.prototype.characterFrame;
    Sprite_Character.prototype.characterFrame = function() {
        const characterName = this._character.characterName();
        if (characterName.startsWith("4")) {
            const pw = this.patternWidth();
            const ph = this.patternHeight();
            const sx = (this._character.pattern() % 4) * pw;
            const sy = (this._character.characterBlockY() + (this._character.characterBlockY() === 1 ? 1 : 0)) * ph;
            this.setFrame(sx, sy, pw, ph);
        } else {
            _Sprite_Character_characterFrame.call(this);
        }
    };
    
    const _Game_CharacterBase_pattern = Game_CharacterBase.prototype.pattern;
    Game_CharacterBase.prototype.pattern = function() {
        const characterName = this.characterName();
        if (characterName.startsWith("4")) {
            return this._pattern % 4;
        } else {
            return _Game_CharacterBase_pattern.call(this);
        }
    };
})();
