class Enemy {
      constructor(ctx, coordX, coordY, size, enemyType, numberAliveSprite = 4, numberDefeatedSprite = 7) {
            this.ctx = ctx

            this.coord = {
                  x: coordX,
                  y: coordY
            }
            this.width = size
            this.height = size
            this.posX = this.width * this.coord.x
            this.posY = this.height * this.coord.y
            this.speed = 3

            this.type = enemyType

            this.numberAliveSprite = numberAliveSprite
            this.numberDefeatedSprite = numberDefeatedSprite

            this.sprites = [new Sprite(this.ctx, 100, `enemy/${this.type}/alive.png`, this.numberAliveSprite, this.width, this.height),
            new Sprite(this.ctx, 160, `enemy/${this.type}/defeated.png`, this.numberDefeatedSprite, this.width, this.height)]
            this.currentSprite = 0

            this.timer = 0

            //Movement logic
            this.direction = 'RIGHT'
            this.destinyPos = {
                  x: this.posX,
                  y: this.posY
            }
            this.isDestinyReached = true

            this.isHitten = false
            this.isDefeated = false
      }

      update(deltaTime) {
            this.draw()
            this.move()
            this.timer >= 3000 ? this.timer = 0 : this.timer += deltaTime
      }

      draw() {
            !this.isDefeated ? this.sprites[this.currentSprite].draw(this.timer, this.posX, this.posY) : null
            this.isHitten ? this.timer >= ((this.numberDefeatedSprite - 1) * 160) - 20 ? this.isDefeated = true : null : null
      }

      //Cambia la posición del enemigo
      move() {
            if (!this.isDestinyReached) {
                  switch (this.direction) {
                        case 'UP':
                              this.posY -= this.speed
                              if (this.comparePosition(this.posY, this.destinyPos.y, false)) {
                                    this.isDestinyReached = true
                                    this.posY = this.destinyPos.y
                              }
                              break
                        case 'DOWN':
                              this.posY += this.speed
                              if (this.comparePosition(this.posY, this.destinyPos.y, true)) {
                                    this.isDestinyReached = true
                                    this.posY = this.destinyPos.y
                              }
                              break
                        case 'RIGHT':
                              this.posX += this.speed
                              if (this.comparePosition(this.posX, this.destinyPos.x, true)) {
                                    this.isDestinyReached = true
                                    this.posX = this.destinyPos.x
                              }
                              break
                        case 'LEFT':
                              this.posX -= this.speed
                              if (this.comparePosition(this.posX, this.destinyPos.x, false)) {
                                    this.isDestinyReached = true
                                    this.posX = this.destinyPos.x
                              }
                              break
                  }
            }
      }

      //Compara la posicion del enemigo con la de destino
      comparePosition(selfPos, destinyPos, isPositiveOrientation) {
            // isPositiveOrientation ? (selfPos >= destinyPos ? return true : return false) : (selfPos <= destinyPos ? return true : return false)
            if (isPositiveOrientation) {
                  if (selfPos >= destinyPos) return true
            } else {
                  if (selfPos <= destinyPos) return true
            }
            return false
      }

      //Cambia la posición del destino del enemigo
      setNewDestiny(posX, posY) {
            this.destinyPos.x = posX
            this.destinyPos.y = posY
      }

      //Es alcanzado por una bomba
      setDamage() {
            this.isHitten = true
            this.currentSprite = 1
            this.direction = ''
            this.timer = 0
      }

}