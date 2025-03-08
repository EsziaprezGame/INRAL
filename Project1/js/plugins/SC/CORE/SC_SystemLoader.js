class System_Loader{
    constructor(){
        this._pluginsList = {};
        this.selfLoad();
    }
    selfLoad(){
        const pluginInfo = {
            name                : "SC_SystemLoader",
            version             : "0.2.1",
            icon                : "\u{2699}\u{FE0F}",
            author              : AUTHOR,
            license             : LICENCE,
            dependencies        : [],
            loadDataFiles       : [],
            createObj           : {autoCreate  : false},
            autoSave            : true
        }
        this.checkPlugin(pluginInfo);
    }
    checkPlugin(plugin){
        let allDependenciesOk = true;

        plugin.dependencies.forEach((requiredDependency)=>{
            if(!this._pluginsList[requiredDependency]){
                $debugTool.drawDependencyError(plugin, requiredDependency);
                allDependenciesOk = false;
            }
        }, this);

        if(allDependenciesOk){
            this._pluginsList[plugin.name] = plugin;
            $debugTool.drawPluginLoaded(plugin);
        }
        return allDependenciesOk;
    };
}
$simcraftLoader = new System_Loader();