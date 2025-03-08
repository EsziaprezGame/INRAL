class Bitmap_Composite {
    /**
     * @param {Array} layers - Liste initiale des couches { key, bitmapSrc, bitmapFilename, zIndex }
     * @param {number} w - Largeur du bitmap final
     * @param {number} h - Hauteur du bitmap final
     * @param {Object} defaultBitmapData - { bitmapSrc, bitmapFilename }
     */
    constructor(layers = [], w = 48, h = 48, defaultBitmapData = null) {
      this._width = w;
      this._height = h;
      this._layers = [];
      this._defaultBitmap = defaultBitmapData
        ? ImageManager.loadBitmap(defaultBitmapData.bitmapSrc, defaultBitmapData.bitmapFilename)
        : null;
      this.resetLayers(layers);
    }
  
    /**
     * Ajoute ou remplace une couche par son key.
     * @param {Object} layer - { key, bitmapSrc, bitmapFilename, zIndex }
     */
    addLayer(layer) {
      this.removeLayer(layer.key);
      layer.bitmap = ImageManager.loadBitmap(layer.bitmapSrc, layer.bitmapFilename);
      this._layers.push(layer);
    }
  
    /**
     * Supprime une couche par son key.
     * @param {string} key
     */
    removeLayer(key) {
      this._layers = this._layers.filter(layer => layer.key !== key);
    }
  
    /**
     * Récupère la liste actuelle des couches.
     * @returns {Array}
     */
    getLayers() {
      return [...this._layers];
    }
  
    /**
     * Remplace toutes les couches par une nouvelle liste.
     * @param {Array} newLayers
     */
    resetLayers(newLayers) {
      this._layers = [];
      for (const layer of newLayers) {
        this.addLayer(layer);
      }
    }
  
    /**
     * Vérifie si toutes les couches sont prêtes.
     * @returns {Promise}
     */
    async waitForLayersReady() {
      const allBitmaps = this._layers.map(layer => layer.bitmap);
      const checkReady = () => allBitmaps.every(bmp => bmp.isReady());
  
      if (checkReady()) return;
  
      await Promise.all(
        allBitmaps.map(
          bmp =>
            new Promise(resolve => {
              const check = () => (bmp.isReady() ? resolve() : setTimeout(check, 50));
              check();
            })
        )
      );
    }
  
    /**
     * Génère le bitmap composite final.
     * @returns {Promise<Bitmap>} - Le bitmap final composé ou le bitmap par défaut.
     */
    async getCompositeBitmap() {
        await this.waitForLayersReady();
    
        // Vérifie si toutes les couches sont prêtes
        const allReady = this._layers.every(layer => layer.bitmap && layer.bitmap.isReady());
        const baseBitmap = new Bitmap(this._width, this._height);
    
        if (!allReady) {
            return this._defaultBitmap || baseBitmap;
        }
    
        
    
        // Tri par zIndex croissant
        const sortedLayers = [...this._layers].sort((a, b) => a.zIndex - b.zIndex);
    
        for (const layer of sortedLayers) {
            const bmp = layer.bitmap;
            baseBitmap.blt(bmp, 0, 0, bmp.width, bmp.height, 0, 0);
        }
    
        return baseBitmap;
    }
  }
  SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_BitmapComposite",
    icon                : "\u{1F5BC}\u{FE0F}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);