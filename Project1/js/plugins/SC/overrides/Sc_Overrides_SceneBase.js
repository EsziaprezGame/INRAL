SC._sceneBase_init = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
    SC._sceneBase_init.call(this);
    $debugTool.logInitScene(this.constructor.name);
};