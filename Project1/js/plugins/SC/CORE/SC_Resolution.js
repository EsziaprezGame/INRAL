const RESOLUTION =  {x:1280, y:800};
(() => {
    const pluginName = "Resolution";
    const params = PluginManager.parameters(pluginName);
	
	Scene_Boot.prototype.resizeScreen = function() {
		Graphics.resize(RESOLUTION.x, RESOLUTION.y);
		this.adjustBoxSize(RESOLUTION.x, RESOLUTION.y);
		this.adjustWindow();
	};
	Scene_Boot.prototype.adjustBoxSize = function(width, height) {
		Graphics.boxWidth = width;
		Graphics.boxHeight = height;
	};
})();


SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Resolution",
    version             : "0.2.1",
    icon                : "\u{1F5A5}\u{FE0F}",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);