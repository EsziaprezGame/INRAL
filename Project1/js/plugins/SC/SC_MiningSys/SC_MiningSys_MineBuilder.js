class Game_MineBuilder {
  constructor(mapId) {
    this.mapId = mapId;
    this.wallTileId = 2048; // Premier tile A4 pour les murs
    this.roofTileId = 2048; // Premier tile A4 pour les toits
  }

  isMountainTile(x, y) {
    return $gameMap.isValid(x, y) && $gameMap.terrainTag(x, y) === 10;
  }

  updateAround(x, y, radius = 1) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if ($gameMap.isValid(nx, ny)) {
          if (this.isMountainTile(nx, ny)) {
            this.rebuildTile(nx, ny);
          } else {
            this.clearWalls(nx, ny); // Nettoyage si ce n'est plus montagne
          }
        }
      }
    }
  }

  rebuildTile(x, y) {
    this.clearWalls(x, y);

    const directions = [
      { dx: 0, dy: -1 }, // Haut
      { dx: 1, dy: 0 },  // Droite
      { dx: 0, dy: 1 },  // Bas
      { dx: -1, dy: 0 }  // Gauche
    ];

    directions.forEach(({ dx, dy }) => {
      const nx = x + dx;
      const ny = y + dy;
      if ($gameMap.isValid(nx, ny) && !this.isMountainTile(nx, ny)) {
        this.placeWall(nx, ny, this.getWallTileId(dx, dy));
      }
    }, this);

    this.placeRoof(x, y);
  }

  clearWalls(x, y) {
    this.setTile(x, y, 1, 0); // Clear mur (layer 1)
    this.setTile(x, y, 2, 0); // Clear toit (layer 2)
  }

  placeWall(x, y, tileId) {
    this.setTile(x, y, 1, tileId);
  }

  placeRoof(x, y) {
    this.setTile(x, y, 2, this.roofTileId);
  }

  getWallTileId(dx, dy) {
    return this.wallTileId; // Même tile pour tous les murs
  }

  mining(x, y) {
    this.setTile(x, y, 0, 300); // Remplace le sol miné (à adapter selon ton tileset)
    this.clearWalls(x, y);      // Nettoie murs et toit sur la case minée
    this.updateAround(x, y, 2); // Met à jour autour (rayon 2)
  }

  setTile(x, y, layer, tileId) {
    if (!$gameMap._map || !$gameMap.isValid(x, y)) return;

    const width = $gameMap.width();
    const height = $gameMap.height();
    const index = (y * width) + x;
    $gameMap._map.data[(layer * width * height) + index] = tileId;
    $gameMap.requestRefresh();
  }
}
