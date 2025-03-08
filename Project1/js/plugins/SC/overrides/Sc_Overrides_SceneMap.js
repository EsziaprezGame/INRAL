// === SC_GUI_SceneMapOverrides.js ===
const _Scene_Map_create = Scene_Map.prototype.create;
Scene_Map.prototype.create = function() {
  _Scene_Map_create.call(this);
  $scSysManager.onSceneMapCreate(this);
};

const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
  _Scene_Map_createAllWindows.call(this);
  $scSysManager.onMapCreateAllWindows(this);
};

const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
  _Scene_Map_update.call(this);
  $scSysManager.onMapUpdate(this);
};

const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
Scene_Map.prototype.processMapTouch = function () {
  if ($scSysManager.isHudTouched()) return; // Bloque le déplacement
  _Scene_Map_processMapTouch.call(this);
};

const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
  _Scene_Map_onMapLoaded.call(this);
  $scSysManager.onSceneMapMapLoaded();
};



Scene_Map.prototype.isOutsideMap = function() {
  return $dataMap && $dataMap.meta && $dataMap.meta.outside === "true";
};





Scene_Map.prototype.mining = function() {
    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;
    mineBuilder.mining(playerX, playerY);
    console.log(`Mining à ${playerX}, ${playerY}`);
};
