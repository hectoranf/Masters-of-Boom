class Tile {
      constructor(ctx, size, posX, posY) {
            this.ctx = ctx

            //Datos de la imagen
            this.size = size
            this.posX = posX
            this.posY = posY
            this.tile = undefined
            this.initTile()

            //Propiedades de tiles
            this.isBlocking = false
      }

      initTile() {
            this.tile = new Image()
            this.tile.src = './images/floor.png'
      }

      update() {
            this.draw()
      }

      //Dibuja el tile
      draw() {
            this.ctx.drawImage(this.tile, this.posX, this.posY, this.size, this.size)
      }
}