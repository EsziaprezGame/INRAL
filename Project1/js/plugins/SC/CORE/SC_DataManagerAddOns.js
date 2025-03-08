
SC.totalDataFilesToLoad = 0;
SC.totalDataFilesLoaded = 0;

//LOADING DATA PROCESS
SC._DataMana_loaDat				    = DataManager.loadDatabase;
DataManager.loadDatabase			= function() {
    $debugTool.group("DATABASE LOADING");
	SC._DataMana_loaDat.call(this);
	this.loadScData();
};
DataManager.loadScData				= function() {
    for(const pluginKey in $simcraftLoader._pluginsList){
        const plugin = $simcraftLoader._pluginsList[pluginKey];
        if(plugin.loadDataFiles && plugin.loadDataFiles.length > 0){
            SC.totalDataFilesToLoad += plugin.loadDataFiles.length;
            plugin.loadDataFiles.forEach((datafile)=>{
                if(!window[datafile.instName]){
                    let src = `${datafile.filename}`;
                    this.loadSCDataFile(datafile.instName, src);
                }
            }, this);      
        }
    };
};
DataManager.loadSCDataFile = function(name, src) {
    const xhr = new XMLHttpRequest();
    const url = "data/SC/" + src + ".json";
    window[name] = null;
    xhr.open("GET", url);
    xhr.overrideMimeType("application/json");
    xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
    xhr.onerror = () => this.onXhrError(name, src, url);
    xhr.send();
};
DataManager.onXhrLoad = function(xhr, name, src, url) {
    if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        SC.totalDataFilesLoaded++;
        $debugTool.drawDatafileLoaded(name, url);
        this.onLoad(window[name]);
    } else {
        $debugTool.drawDatafileError(name, src);
        this.onXhrError(name, src, url);
    }
};
DataManager.extractEventMetaFromFirstComment = function(event) {

    if (!event) return {};

    const firstPage = event.pages[0];
    if (!firstPage) return {};

    let commentBlock = '';
    let inCommentBlock = false;

    for (const command of firstPage.list) {
        if (command.code === 108) { // Début d'un commentaire
            commentBlock += command.parameters[0] + '\n';
            inCommentBlock = true;
        } else if (command.code === 408 && inCommentBlock) { // Suite du commentaire
            commentBlock += command.parameters[0] + '\n';
        } else if (inCommentBlock) {
            // Fin du bloc de commentaires au premier autre code
            break;
        }
    }

    const meta = {};
    const regex = /<([^:]+):\s*([^>]+)>/g;
    let match;
    while ((match = regex.exec(commentBlock)) !== null) {
        const key = match[1].trim();
        let value = match[2].trim();
        if (!isNaN(value) && value !== '') {
            value = Number(value);
        }
        meta[key] = value;
    }

    return meta;
}

//TEST LOADING
SC._DataMana_isDatLoa				= DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded			    = function() {
    this.checkError();
    let noError = true;
    if (SC.totalDataFilesLoaded > SC.totalDataFilesToLoad) {
        for(const pluginKey in $simcraftLoader._pluginsList){
            const plugin = $simcraftLoader._pluginsList[pluginKey];

            if(plugin.loadDataFiles && plugin.loadDataFiles.length > 0){
                plugin.loadDataFiles.forEach((datafile)=>{
                    if(!window[datafile.instName]){
                        noError = false;
                    }
                });   
            }
        };
    }
    if(SC._DataMana_isDatLoa.call(this) && noError){
        $debugTool.groupEnd();
        return true
    };
    return false
};

//CREATE OBJECT PROCESS
SC._DataMana_creatGmObj		        = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    $debugTool.group("BASE GAME OBJECT CREATION");
    const baseClasslist = [
        { instName:"$gameTemp",         classProto: Game_Temp},
        { instName:"$gameSystem",       classProto: Game_System},
        { instName:"$gameScreen",       classProto: Game_Screen},
        { instName:"$gameTimer",        classProto: Game_Timer},
        { instName:"$gameMessage",      classProto: Game_Message},
        { instName:"$gameSwitches",     classProto: Game_Switches},
        { instName:"$gameVariables",    classProto: Game_Variables},
        { instName:"$gameSelfSwitches", classProto: Game_SelfSwitches},
        { instName:"$gameActors",       classProto: Game_Actors},
        { instName:"$gameParty",        classProto: Game_Party},
        { instName:"$gameTroop",        classProto: Game_Troop},
        { instName:"$gameMap",          classProto: Game_Map},
        { instName:"$gamePlayer",       classProto: Game_Player}
    ];

    baseClasslist.forEach(obj =>{
        window[obj.instName] = new obj.classProto();
        $debugTool.drawBaseInstanceCreated(obj.instName, window[obj.instName].constructor.name);
    });
    
    $debugTool.groupEnd();
    $debugTool.group("SC GAME OBJECT CREATION");

    for(const pluginKey in $simcraftLoader._pluginsList){
        const plugin = $simcraftLoader._pluginsList[pluginKey];
        if(!window[plugin.createObj.instName] && plugin.createObj && plugin.createObj.autoCreate){
            window[plugin.createObj.instName] = new plugin.createObj.classProto();
            $debugTool.drawInstanceCreated(plugin);
        }
    };
    $debugTool.groupEnd();
};

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_DataManagerAddOns",
    version             : "0.2.1",
    icon                : "\u{1F4DA}",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);