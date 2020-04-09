class Sprite {
      constructor(ctx, animTime, imgName, framesPerAnimation, width, height, numberOfAnimations = 1, indexAnimation = 0) {
            this.ctx = ctx

            //Propiedades para la gestión del frame
            this.animTime = animTime
            this.numberOfFrames = framesPerAnimation
            this.currentFrame = 0

            //Dimensiones de lo que se dibuja
            this.width = width
            this.height = height

            //Propiedades de la porción que se dibuja de la imagen. Se inicializan cuando se carga la imagen
            this.frame = {
                  width: undefined,
                  height: undefined,
                  posX: undefined,
                  posY: undefined
            }

            //SpriteSheet
            this.img = new Image()
            this.img.src = (`./images/${imgName}`)
            this.img.onload = () => this.setFrameProperties(numberOfAnimations, indexAnimation)
      }

      //Se da valores a la spropiedades del objeto this.frame
      setFrameProperties(numberOfAnimations, indexAnimation) {
            this.frame.width = this.img.width / this.numberOfFrames
            this.frame.height = this.img.height / numberOfAnimations
            this.frame.posX = 0
            this.frame.posY = this.frame.height * indexAnimation
      }

      //Se reinicia la animación
      reset() {
            this.currentFrame = 0
      }

      //Se dibuja el frame correspondiente
      draw(timer, posX, posY) {
            this.updateSprite(timer)
            this.ctx.drawImage(this.img,
                  this.frame.width * this.currentFrame,
                  this.frame.posY,
                  this.frame.width,
                  this.frame.height,
                  posX,
                  posY,
                  this.width,
                  this.height
            )
      }

      //Se gestiona el frame que debe dibujarse
      updateSprite(timer) {
            timer % this.animTime === 0 ? this.currentFrame++ : null
            this.currentFrame === this.numberOfFrames ? this.currentFrame = 0 : null
      }

}