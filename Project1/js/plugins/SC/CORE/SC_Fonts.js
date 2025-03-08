Game_System.prototype.hudFontFace = function() {
    return "rmmz-hudfont, mplus-1m-regular.woff"
};
Game_System.prototype.dialFontFace = function() {
    return "rmmz-dialfont, ci-gamedev.ttf";
};


SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Fonts",
    version             : "0.2.1",
    icon                : "\u{1F520}",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);