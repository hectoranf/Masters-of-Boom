class Explosion {
      constructor(ctx, width, height, posX, posY, frameTime, imgName) {
            this.ctx = ctx
            this.width = width
            this.height = height
            this.posX = posX
            this.posY = posY
            this.img = new Sprite(this.ctx, frameTime, imgName, 4, this.width, this.height)
      }

      draw(timer) {
            this.img.draw(timer, this.posX, this.posY)
      }
}