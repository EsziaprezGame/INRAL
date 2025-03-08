ColorManager.hudTxtBase = function(){
    return "rgba(0, 0, 0)";
};
ColorManager.seasonColor = function(seasonIndex){
    return [
        "rgba(10, 60, 0)",
        "rgba(150, 65, 0)",
        "rgba(55, 30, 7)",
        "rgba(25, 60, 80)"
    ][seasonIndex];
};
ColorManager.seasonOutlineColor = function(seasonIndex){
    return [
        "rgba(170, 235, 195)",
        "rgba(255, 195, 160)",
        "rgba(255, 170, 50)",
        "rgba(195, 245, 255)"
    ][seasonIndex];
};


SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_ColorManagerAddOns",
    version             : "0.2.1",
    icon                : "\u{1F3A8}",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);