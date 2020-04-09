class Player {

      constructor(ctx, tileSize, tileX, tileY) {
            this.ctx = ctx
            this.tileSize = tileSize
            this.timer = 0

            //Collider 
            this.width = this.tileSize * 0.6
            this.height = this.width
            this.posX = tileX * this.tileSize + (this.tileSize - this.width) / 2
            this.posY = tileY * this.tileSize + (this.tileSize - this.height) / 2

            //Coordenadas en el escenario
            this.tileCoord = {
                  row: tileX,
                  col: tileY
            }

            //La imagen del player
            this.imgProperties = {
                  width: this.tileSize,
                  height: this.tileSize * 1.25,
                  posX: this.posX - (this.tileSize - this.width) / 2,
                  posY: this.posY - this.tileSize * 0.65
            }

            this.direction = ''
            this.speed = 4

            //IMAGEN DEL JUGADOR

            this.animations = [
                  new Sprite(this.ctx, 120, 'player/player.png', 4, this.imgProperties.width, this.imgProperties.height, 4, 0),
                  new Sprite(this.ctx, 120, 'player/player.png', 4, this.imgProperties.width, this.imgProperties.height, 4, 1),
                  new Sprite(this.ctx, 120, 'player/player.png', 4, this.imgProperties.width, this.imgProperties.height, 4, 2),
                  new Sprite(this.ctx, 120, 'player/player.png', 4, this.imgProperties.width, this.imgProperties.height, 4, 3),
                  new Sprite(this.ctx, 140, 'player/PlayerFull.png', 8, this.imgProperties.width, this.imgProperties.height, 3, 2)
            ]
            this.currentAnimationIndex = 0

            //BOMBAS
            this.bombs = []
            this.maxBombs = 1

            this.lifes = 3
            this.vulnerable = true
            this.isVisible = true
            this.isDefeated = false
      }

      update(deltaTime) {
            this.updateTimer(deltaTime)

            this.updateBombs(deltaTime)
            if (this.lifes > 0) this.move(this.timer)
            else if (this.timer <= 1100) this.animations[this.currentAnimationIndex].draw(this.timer, this.imgProperties.posX, this.imgProperties.posY)
            else this.isDefeated = true
            //this.drawCollider()
      }

      updateTimer(deltaTime) {
            this.timer + deltaTime >= 10000 ? this.timer = 0 : this.timer += deltaTime
      }

      drawCollider() {
            //pintando el collider
            this.ctx.fillStyle = 'tomato'
            this.ctx.fillRect(this.posX, this.posY, this.width, this.height)
      }

      changeDirection(direction) {
            this.direction = direction
      }

      //Cambia posición y dibuja
      move(timer) {
            //Desplaza según la dirección
            switch (this.direction) {
                  case 'UP':
                        this.posY -= this.speed
                        this.imgProperties.posY -= this.speed
                        this.updateCoords()
                        this.currentAnimationIndex = 1
                        break
                  case 'DOWN':
                        this.posY += this.speed
                        this.imgProperties.posY += this.speed
                        this.updateCoords()
                        this.currentAnimationIndex = 0
                        break
                  case 'RIGHT':
                        this.posX += this.speed
                        this.imgProperties.posX += this.speed
                        this.updateCoords()
                        this.currentAnimationIndex = 2
                        break
                  case 'LEFT':
                        this.posX -= this.speed
                        this.imgProperties.posX -= this.speed
                        this.updateCoords()
                        this.currentAnimationIndex = 3
                        break
                  default:
                        this.animations[this.currentAnimationIndex].reset()
                        timer = 1
                        break
            }
            if (this.isVisible) this.animations[this.currentAnimationIndex].draw(timer, this.imgProperties.posX, this.imgProperties.posY)
            if (!this.vulnerable) this.isVisible = !this.isVisible
      }

      //Calcula el tile en el que está el player
      updateCoords() {
            this.tileCoord.row = Math.round((this.posY - this.tileSize * 0.35) / this.tileSize)
            this.tileCoord.col = Math.round(this.posX / this.tileSize)
      }

      //se usa en las colisiones para evitar que el jugador entre en un collider
      translate(newPosX, newPosY) {
            this.posX = newPosX
            this.imgProperties.posX = newPosX - (this.tileSize - this.width) / 2
            this.posY = newPosY
            this.imgProperties.posY = newPosY - this.tileSize * 0.65
      }

      getDamage() {

            if (this.lifes > 1) {
                  this.vulnerable = false
                  this.lifes--
                  setTimeout(() => {
                        this.vulnerable = true
                        this.isVisible = true
                  }, 3000)
            } else if (this.lifes > 0) {
                  this.lifes = 0
                  this.timer = 0
                  this.currentAnimationIndex = 4
            }
      }

      //Crea una bomba nueva
      putBomb() {
            if (this.bombs.length < this.maxBombs) {
                  this.bombs.push(new Bomb(this.ctx, this.tileCoord.col, this.tileCoord.row, this.tileSize))
            }
      }

      //Maneja el estado de las bombas
      updateBombs(deltaTime) {
            this.bombs.forEach(elm => elm.update(deltaTime))
            this.bombs = this.bombs.filter(elm => !elm.isDone)
      }



}