/** Debug Tools
/*:en
 * @plugindesc (v0.01) Utils & Tools to making and Debug your project
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC 4.0
 * @help
 * Utils:
 * ► Skip title: if true skip the title scene at the start of the game
 * ► Env: put "dev" if you want to get some usefull infos on the console
 * ► Debug: set true if you want to see all the debug log infos on console
 * 
 * 
 */

const SC = {};
SC._temp = {};

class DebugTool{
    constructor(){
        this.drawConsoleHeader();
        this._objCreated = {};
        this._groupCreated = {};
    }
    get debugLog(){
        return DEBUG_OPTIONS.debug && DEBUG_OPTIONS.env.toUpperCase() == "DEV";
    }
    group(key){
        if(!this._groupCreated)
            this._groupCreated = {};
        if(this.debugLog){
            if(!this._groupCreated[key]){
                console.groupCollapsed(key);
                this._groupCreated[key] = true;
            }else if(DEBUG_OPTIONS.deep){
                console.groupCollapsed("RESTORE \u{2192}"+key);
            }
        }
            
    }
    groupEnd(){
        if(this.debugLog)
            console.groupEnd();
    }
    log(txt){
        if(this.debugLog)
            console.log(txt);
    }
    warn(txt){
        if(this.debugLog)
            console.warn(txt);
    }
    error(txt){
        if(this.debugLog)
            console.error(txt);
        throw new Error(txt);
    }
    drawConsoleHeader(){
        let line = "\uD83C\uDF38\u23F0\uD83C\uDFF0\uD83D\uDCAC\u2694\u2601\u2600\uD83D\uDC09\u26A1\u2728\uD83D\uDC0E".repeat(2);
        let txt =
`  ____    ___       \uD83D\uDD27 SIMCRAFT ENGINE (ENV:"${DEBUG_OPTIONS.env}")
 / ___) /  ___)         Debug:      ${DEBUG_OPTIONS.debug?"\u{2714}\u{FE0F} On":"\u{274C} Off"}
\\___  \\(  (__           Deep Log:   ${DEBUG_OPTIONS.deep?"\u{2714}\u{FE0F} On":"\u{274C} Off"}  
(_____/ \\_____)         Skip Title: ${DEBUG_OPTIONS.skip_title?"\u{2714}\u{FE0F} On":"\u{274C} Off"}`;
        let gameInfos = `${AUTHOR} ${OFFICIAL_SITE} ${LICENCE} ${ENGINE_NAME}(version:${ENGINE_VERSION})`;

        if(this.debugLog)
            console.log.apply(console,[`%c${line}\n${txt}\n\n${line}\n\n${gameInfos}`,'padding:5px 18px; color:white']);

        this.group("PRELOADING");
        this.log(`\u{1F50D}\u{1F41E} DEBUG_TOOLS \u{2192} Loaded`);
    }
    drawDatafileError(instName, filename){
        let txt =
`\u{1F4C4} ERROR: ${instName} database not created !!!
         => 'data/SC/${filename}.json'  file not loaded !\n`;
        
        this.error(txt);
    }
    drawDatafileLoaded(instName, path){
        let txt;
        if(instName == "$dataMap"){
            txt =
`         \u{2794}\u{1F4C4}🌐 ${instName} \u{2192} '${path}' "${$gameMap.displayName() || "Location not named"}" loaded\n`;
        }else{
            txt =
`\u{1F4C4} ${instName} \u{2192} '${path}' loaded\n`;
        }
        
        
        this.log(txt);
    }
    drawDependencyError(plugin, requiredDependency){
        let txt =
`\u{1F4E5} ERROR: ${plugin.name} not loaded !!!
\u{2192} To work correctly ???${requiredDependency}??? plugin must be loaded before !`;

        this.error(txt);
    }

    drawPluginLoaded(plugin){
        let txt = `\u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Loaded\n`;

        if(DEBUG_OPTIONS.deep)(
            plugin.loadDataFiles.forEach(datafile=>{
                txt += `         \u{2192} using \u{1F4C4}${datafile.instName} from 'data/SC/${datafile.filename}.json' datafile\n`;
                
            })
        )
        this.log(txt);
    }
    drawInstanceCreated(plugin){
        let txt = 
`${plugin.icon} ${plugin.name.toUpperCase()} \u{2192} ${plugin.createObj.instName} instance created`;
        this.log(txt);
    }
    drawBaseInstanceCreated(instName, className){
        let txt;
        if(!this._objCreated)
            this._objCreated = {};
        if(!this._objCreated[className]){
            txt = 
`\u{1F3F0} RMMZ ${className.toUpperCase()} \u{2192} ${instName} instance created`;
            this._objCreated[className] = 1;
        }else if(this._objCreated[className] === 1){
            txt = 
`\u{1F3F0} RMMZ ${className.toUpperCase()} \u{2192} ${instName} instance recreated`;
            this._objCreated[className] = 2;
        }
        if(this._objCreated[className] < 2)
            this.log(txt);
    }
    logInitScene(name){

        if(DEBUG_OPTIONS.deep || name == "Scene_Map"){
            let txt = `\u{1F3AC} SCENE ${name.toUpperCase()} \u{2192} initialized`;
            this.log(txt);
            
        }
    }
}
const $debugTool = new DebugTool();