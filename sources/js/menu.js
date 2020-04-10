class Menu {
      constructor(ctx, canvasSize) {
            this.ctx = ctx
            this.canvasSize = canvasSize

            this.gameTitle = {
                  img: new Image(),
                  width: undefined,
                  height: undefined,
                  posX: undefined,
                  posY: undefined
            }
            this.initImages()

            this.text = '- Press <ENTER> to start -'
            this.fontSize = 48

            this.timer = 0
      }

      initImages() {
            this.gameTitle.img.src = './images/menu/LogoMastersSombra.png'
            this.gameTitle.width = this.canvasSize.width / 1.5
            this.gameTitle.height = this.gameTitle.width * 0.625
            this.gameTitle.posX = (this.canvasSize.width - this.gameTitle.width) / 2
            this.gameTitle.posY = 60
      }

      update() {
            this.fontSize = 42 + Math.sin(this.timer) * 2
            this.draw()
            this.timer += 0.05
      }

      draw() {
            this.ctx.fillStyle = '#3FA9F5'
            this.ctx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height)
            this.ctx.drawImage(this.gameTitle.img, this.gameTitle.posX, this.gameTitle.posY, this.gameTitle.width, this.gameTitle.height)

            this.ctx.fillStyle = 'snow'
            this.ctx.textAlign = 'center'
            this.ctx.font = `bold ${this.fontSize}px Courier New`

            this.ctx.fillText(this.text, this.canvasSize.width / 2, 450)
      }
}