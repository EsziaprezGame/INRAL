//LOADING DATA PROCESS
SC._DataMana_loaDat				    = DataManager.loadDatabase;
DataManager.loadDatabase			= function() {
	SC._DataMana_loaDat.call(this);
	this.loadScData();
};
DataManager.loadScData				= function() {
    SC.pluginsList.push({
        name:'$dataGameVars',
        src: 'GameVars.json',
        needObj:false,
        needSave:false
    });
    SC.pluginsList.forEach(element=>{
        if(element.src){
            if(!window[element.name])
                this.loadSCDataFile(element.name, element.src);
        }
    }, this);
};
DataManager.loadSCDataFile			= function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/SC/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
	
    xhr.onload = function() {
        if (xhr.status < 400) {
           window[name] = JSON.parse(xhr.responseText);
		   DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
};

//TEST LOADING
SC._DataMana_isDatLoa				= DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded			    = function() {
    this.checkError();
    SC.pluginsList.forEach(element=>{
        if (!window[element.name])
            return false;
    });
    return SC._DataMana_isDatLoa.call(this);
};

//CREATE OBJECT PROCESS
SC._DataMana_creatGmObj		        = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    SC._DataMana_creatGmObj.call(this);

    SC.pluginsList.forEach(element=>{
        if(element.needObj){
            window[element.objName] = new element.obj();
        }
    });
};