
Input.keyMapper[49] = "1top";  // Touche 1 (&)
Input.keyMapper[50] = "2top";  // Touche 2 (é)
Input.keyMapper[51] = "3top";  // Touche 3 (")
Input.keyMapper[52] = "4top";  // Touche 4 (')
Input.keyMapper[84] = "t"; // 84 =  T

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Input",
    version             : "0.2.1",
    icon                : "\u{1F3AE}",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);