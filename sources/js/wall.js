class Wall extends Tile {
      constructor(ctx, size, posX, posY) {
            super(ctx, size, posX, posY)
            //Se aplica la imagen de pared
            this.initTile()
            //Propiedades de paredes
            this.isBlocking = true
      }

      initTile() {
            this.tile = new Image()
            this.tile.src = './images/solidWall.png'
      }



}