class Bomb {
      constructor(ctx, coordX, coordY, tileSize, power = 1) {
            this.ctx = ctx

            this.power = power

            //Situación en el escenario
            this.coord = {
                  x: coordX,
                  y: coordY
            }

            //Propiedades de la imagen
            this.width = tileSize
            this.height = tileSize
            this.posX = this.coord.x * this.width
            this.posY = this.coord.y * this.height

            //IMAGENES
            this.img = new Sprite(this.ctx, 140, 'bomb/Bomb.png', 4, this.width, this.height)
            this.timer = 0

            //EXPLOSIONES
            this.explosions = []
            //Cuanto t en ardan las explosiones en cambiar los frames
            this.explosionTime = 120
            this.initExplosions()


            //Estados bomba: No explatada, explotando, explotada
            this.isExploding = false
            this.isExploded = false
            this.isDone = false
      }

      //Actualización de la bomba
      update(deltaTime) {
            this.updateTimer(deltaTime)
            if (!this.isExploding) {
                  this.img.draw(this.timer, this.posX, this.posY)
                  this.explote()
            } else {
                  this.drawExplosion()
                  this.timer >= 360 ? this.isExploded = true : null
            }
      }

      //Actualización del tiempo
      updateTimer(deltaTime) {
            this.timer + deltaTime >= 10000 ? this.timer = 0 : this.timer += deltaTime
      }

      //Cambia estado de la bomba
      explote() {
            if (this.timer > 1520) {
                  this.isExploding = true
                  this.timer = 0
            }
      }

      drawExplosion() {
            this.explosions.forEach(elm => { elm.draw(this.timer, elm.posX, elm.posY) })
      }


      initExplosions() {

            //EXPLOSION CENTRAL
            this.explosions.push(new Explosion(this.ctx, this.width, this.height, this.coord.x * this.width, this.coord.y * this.height, this.explosionTime, 'bomb/explosionCentral.png'))

            for (let row = this.coord.y - this.power; row <= this.coord.y + this.power; row++) {
                  for (let col = this.coord.x - this.power; col <= this.coord.x + this.power; col++) {
                        //Si está en la vertical de la bomba
                        if (col === this.coord.x) {
                              //ARRIBA DE LA BOMBA
                              if (row < this.coord.y) {
                                    switch (row) {
                                          //ES UN EXTREMO
                                          case this.coord.y - this.power:
                                                this.explosions.push(new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explosionUp.png'))
                                                break
                                          default:
                                                this.explosions.push(
                                                      new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explosionVertical.png'))
                                                break
                                    }
                              }
                              //DEBAJO DE LA BOMBA
                              else if (row > this.coord.y) {
                                    switch (row) {
                                          //ES UN EXTREMO
                                          case this.coord.y + this.power:

                                                this.explosions.push(
                                                      new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explosionDown.png'))
                                                break
                                          default:
                                                this.explosions.push(
                                                      new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explosionVertical.png'))
                                                break
                                    }
                              }
                        }
                        //Si está en la horizontal de la bomba
                        if (row === this.coord.y) {
                              //IZQUIERDA DE LA BOMBA
                              if (col < this.coord.x) {
                                    switch (col) {
                                          //ES UN EXTREMO
                                          case this.coord.x - this.power:
                                                this.explosions.push(new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explosionLeft.png'))
                                                break
                                          default:
                                                this.explosions.push(new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explosionHorizontal.png'))
                                                break
                                    }
                              }
                              //DERECHA DE LA BOMBA
                              else if (col > this.coord.x) {
                                    switch (col) {
                                          //ES UN EXTREMO
                                          case this.coord.x + this.power:
                                                this.explosions.push(new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explosionRight.png'))
                                                break
                                          default:
                                                this.explosions.push(new Explosion(this.ctx, this.width, this.height, col * this.width, row * this.height, this.explosionTime, 'bomb/explorizontal.png'))
                                                break
                                    }
                              }
                        }
                  }
            }
      }

}
