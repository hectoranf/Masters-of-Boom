class Game {
      constructor(ctx, canvasSize) {
            this.ctx = ctx
            this.canvasSize = canvasSize

            this.tileSize = 55

            this.isPlaying = false
            this.playerWins = false
            this.gameOver = false
            this.victoryImg = {
                  img: new Image(),
                  width: undefined,
                  height: undefined,
                  posX: undefined,
                  posY: undefined
            }
            this.gameOverImg = {
                  img: new Image(),
                  width: undefined,
                  height: undefined,
                  posX: undefined,
                  posY: undefined
            }
            this.initEndingImg()

            this.lifeDOM = document.querySelector('#player-lifes')

            //ESCENARIO
            this.scenary = new Scenary(this.ctx, this.tileSize)
            //PLAYER
            this.player = new Player(this.ctx, this.tileSize, 1, 1)
            //lastKeyPressed se usa para poner bombas mientras se mueve el jugador. No le frena
            this.lastKeyPressed = undefined
            //ENEMIGOS
            this.enemies = []

            this.setListeners()
      }



      initialize() {
            this.scenary = new Scenary(this.ctx, this.tileSize)
            this.player = new Player(this.ctx, this.tileSize, 1, 1)
            this.lastKeyPressed = undefined
            this.enemies = []
            this.initEnemies()
            this.isPlaying = true
            this.playerWins = false
            this.gameOver = false
            this.lifeDOM.style.color = 'rgba(63, 142, 245, 1)'
            this.lifeDOM.style.background = 'rgba(255, 255, 255, .7)'
      }

      update(deltaTime) {
            if (this.isPlaying) {
                  this.scenary.update()
                  this.updateEnemies(deltaTime)
                  this.player.update(deltaTime)
                  this.checkPlayerCollisions()
                  this.checkExplosions()
                  this.checkEndGame()
                  this.lifeDOM.innerHTML = `LIFES:${this.player.lifes}`
            } else if (this.gameOver) {
                  this.drawGameOver()
            } else {
                  this.drawVictory()
            }
      }

      initEnemies() {
            let coordY = 0
            let coordX = 0
            this.scenary.scenaryMap.forEach(row => {
                  row.forEach(elm => {
                        elm === '1' ? this.enemies.push(new Enemy(this.ctx, coordX, coordY, this.tileSize, elm)) :
                              elm === '2' ? this.enemies.push(new Enemy(this.ctx, coordX, coordY, this.tileSize, elm, 4, 9)) : null
                        coordX++
                  })
                  coordY++
                  coordX = 0
            })
      }


      updateEnemies(deltaTime) {
            this.enemies.forEach(elm => {
                  //Mueve y pinta
                  elm.update(deltaTime)
                  //Calcula rutas
                  if (elm.isDestinyReached) this.calculateNextDestiny(elm)
                  this.checkEnemyCollisions(elm)
                  this.enemies = this.enemies.filter(elm => !elm.isDefeated)
            })
      }

      //Gestiona cómo se comporta el enemigo con el entorno
      checkEnemyCollisions(enemy) {
            //Colision con el jugador
            if (this.player.vulnerable && !enemy.isHitten) {
                  this.checkCollision(enemy.posX, enemy.posY, enemy.width, enemy.height,
                        this.player.posX, this.player.posY, this.player.width, this.player.height) ? this.player.getDamage() : null
            }

            //Colision con bombas
            if (!enemy.isHitten) {
                  this.player.bombs.forEach(bomb => {
                        if (bomb.isExploding) {
                              bomb.explosions.forEach(explosion => {
                                    this.checkCollision(explosion.posX, explosion.posY, explosion.width, explosion.height,
                                          enemy.posX, enemy.posY, enemy.width, enemy.height) ? enemy.setDamage() : null
                              })
                        } else {
                              if (this.checkCollision(enemy.posX, enemy.posY, enemy.width, enemy.height,
                                    bomb.posX, bomb.posY, bomb.width, bomb.height)) {

                                    switch (enemy.direction) {
                                          case 'UP':
                                                enemy.direction = 'DOWN'
                                                enemy.destinyPos.y = this.scenary.scenaryTiles[enemy.coord.y + 1][enemy.coord.x].posY
                                                enemy.coord.y++
                                                enemy.isDestinyReached = false
                                                break
                                          case 'DOWN':
                                                enemy.direction = 'UP'
                                                enemy.destinyPos.y = this.scenary.scenaryTiles[enemy.coord.y - 1][enemy.coord.x].posY
                                                enemy.coord.y--
                                                enemy.isDestinyReached = false
                                                break
                                          case 'RIGHT':
                                                enemy.direction = 'LEFT'
                                                enemy.destinyPos.x = this.scenary.scenaryTiles[enemy.coord.y][enemy.coord.x - 1].posX
                                                enemy.coord.x--
                                                enemy.isDestinyReached = false
                                                break
                                          case 'LEFT':
                                                enemy.direction = 'RIGHT'
                                                enemy.destinyPos.x = this.scenary.scenaryTiles[enemy.coord.y][enemy.coord.x + 1].posX
                                                enemy.coord.x++
                                                enemy.isDestinyReached = false
                                                break
                                    }
                              }
                        }
                  })
            }
      }

      //Calcula el siguiente movimiento del enemigo
      calculateNextDestiny(enemy) {
            //  Math.floor(Math.random()*3.9)
            switch (enemy.direction) {
                  case 'UP':
                  case 0:
                        //Si no hay obstaculos en el camino no cambia de ruta. Si en frente tiene un obstaculo calcula aleatoriamente otra dirección
                        if (this.scenary.scenaryTiles[enemy.coord.y - 1][enemy.coord.x].isBlocking) {
                              enemy.direction = Math.floor(Math.random() * 3.9)
                              this.calculateNextDestiny(enemy)
                        } else {//No hay obstaculos en su dirección
                              enemy.direction = 'UP'
                              enemy.destinyPos.y = this.scenary.scenaryTiles[enemy.coord.y - 1][enemy.coord.x].posY
                              enemy.coord.y--
                              enemy.isDestinyReached = false
                        }
                        break
                  case 'DOWN':
                  case 1:
                        if (this.scenary.scenaryTiles[enemy.coord.y + 1][enemy.coord.x].isBlocking) {
                              enemy.direction = Math.floor(Math.random() * 3.9)
                              this.calculateNextDestiny(enemy)
                        } else {
                              enemy.direction = 'DOWN'
                              enemy.destinyPos.y = this.scenary.scenaryTiles[enemy.coord.y + 1][enemy.coord.x].posY
                              enemy.coord.y++
                              enemy.isDestinyReached = false
                        }
                        break
                  case 'RIGHT':
                  case 2:
                        if (this.scenary.scenaryTiles[enemy.coord.y][enemy.coord.x + 1].isBlocking) {
                              enemy.direction = Math.floor(Math.random() * 3.9)
                              this.calculateNextDestiny(enemy)
                        } else {
                              enemy.direction = 'RIGHT'
                              enemy.destinyPos.x = this.scenary.scenaryTiles[enemy.coord.y][enemy.coord.x + 1].posX
                              enemy.coord.x++
                              enemy.isDestinyReached = false
                        }
                        break
                  case 'LEFT':
                  case 3:
                        if (this.scenary.scenaryTiles[enemy.coord.y][enemy.coord.x - 1].isBlocking) {
                              enemy.direction = Math.floor(Math.random() * 3.9)
                              this.calculateNextDestiny(enemy)
                        } else {
                              enemy.direction = 'LEFT'
                              enemy.destinyPos.x = this.scenary.scenaryTiles[enemy.coord.y][enemy.coord.x - 1].posX
                              enemy.coord.x--
                              enemy.isDestinyReached = false
                        }
                        break
            }
      }


      //Movimiento del jugador
      setListeners() {
            document.addEventListener("keydown", e => {

                  switch (e.keyCode) {
                        //ARRIBA
                        case 38:
                              if (this.player.direction != 'BLOCKED-UP') {
                                    this.lastKeyPressed = 38
                                    this.player.changeDirection('UP')
                              }
                              break
                        //ABAJO
                        case 40:
                              if (this.player.direction != 'BLOCKED-DOWN') {
                                    this.lastKeyPressed = 40
                                    this.player.changeDirection('DOWN')
                              }
                              break
                        //IZQUIERDA
                        case 37:
                              if (this.player.direction != 'BLOCKED-LEFT') {
                                    this.lastKeyPressed = 37
                                    this.player.changeDirection('LEFT')
                              }
                              break
                        //DERECHA
                        case 39:
                              if (this.player.direction != 'BLOCKED-RIGHT') {
                                    this.lastKeyPressed = 39
                                    this.player.changeDirection('RIGHT')
                              }
                              break
                        //ESPACIO
                        case 32:
                              this.player.putBomb()
                              break
                  }
            });

            document.addEventListener("keyup", e => {
                  if (this.lastKeyPressed === e.keyCode) {
                        this.lastKeyPressed = undefined
                        this.player.direction.indexOf('BLOCKED') === -1 ? this.player.changeDirection('') : null
                  }
            })
      }

      //Colision del jugador con el escenario
      checkPlayerCollisions() {
            //Se comprueba la colision solo con las celdas alrededor del jugador
            for (let i = this.player.tileCoord.row - 1; i <= this.player.tileCoord.row + 1; i++) {
                  for (let j = this.player.tileCoord.col - 1; j <= this.player.tileCoord.col + 1; j++) {
                        //Condiciónes de colisión
                        if (this.scenary.scenaryTiles[i][j].isBlocking) {

                              if (this.checkCollision(this.scenary.scenaryTiles[i][j].posX, this.scenary.scenaryTiles[i][j].posY,
                                    this.scenary.scenaryTiles[i][j].size, this.scenary.scenaryTiles[i][j].size,
                                    this.player.posX, this.player.posY, this.player.width, this.player.height)) {
                                    //Gestión del movimiento y posicion del jugador en caso de colisión
                                    switch (this.player.direction) {
                                          case 'UP':
                                                this.player.direction = 'BLOCKED-UP'
                                                this.player.translate(this.player.posX, this.scenary.scenaryTiles[i][j].posY + this.scenary.scenaryTiles[i][j].size)
                                                break
                                          case 'DOWN':
                                                this.player.direction = 'BLOCKED-DOWN'
                                                this.player.translate(this.player.posX, this.scenary.scenaryTiles[i][j].posY - this.player.height)
                                                break
                                          case 'LEFT':
                                                this.player.direction = 'BLOCKED-LEFT'
                                                this.player.translate(this.scenary.scenaryTiles[i][j].posX + this.scenary.scenaryTiles[i][j].size, this.player.posY)
                                                break
                                          case 'RIGHT':
                                                this.player.direction = 'BLOCKED-RIGHT'
                                                this.player.translate(this.scenary.scenaryTiles[i][j].posX - this.player.width, this.player.posY)
                                                break
                                    }
                              }
                        }
                  }
            }
      }

      //Comprueba la explosión en de los tiles adyacentes en cruz (arriba, abajo, izquierda y derecha)
      checkExplosions() {
            this.player.bombs.forEach(elm => {
                  if (elm.isExploded) {
                        if (elm.coord.x + 1 < this.scenary.scenaryMap[elm.coord.y].length) {
                              this.scenary.scenaryMap[elm.coord.y][elm.coord.x + 1] === 'B' ? this.scenary.scenaryTiles[elm.coord.y][elm.coord.x + 1].isBreaking = true : null
                        }
                        if (elm.coord.x - 1 >= 0) {
                              this.scenary.scenaryMap[elm.coord.y][elm.coord.x - 1] === 'B' ? this.scenary.scenaryTiles[elm.coord.y][elm.coord.x - 1].isBreaking = true : null
                        }
                        if (elm.coord.y + 1 < this.scenary.scenaryMap.length) {
                              this.scenary.scenaryMap[elm.coord.y + 1][elm.coord.x] === 'B' ? this.scenary.scenaryTiles[elm.coord.y + 1][elm.coord.x].isBreaking = true : null
                        }
                        if (elm.coord.y - 1 >= 0) {
                              this.scenary.scenaryMap[elm.coord.y - 1][elm.coord.x] === 'B' ? this.scenary.scenaryTiles[elm.coord.y - 1][elm.coord.x].isBreaking = true : null
                        }
                        elm.isDone = true
                  }
            })
      }

      //Comprueba si dos elmentos colisionan
      checkCollision(x1, y1, width1, height1, x2, y2, width2, height2) {
            if (x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2) return true
            return false
      }

      checkEndGame() {
            this.isPlaying = false
            this.player.isDefeated ? this.gameOver = true : this.enemies.length === 0 ? this.playerWins = true : this.isPlaying = true
            if (!this.isPlaying) {
                  this.lifeDOM.style.color = 'rgba(63, 142, 245, 0)'
                  this.lifeDOM.style.background = 'rgba(255, 255, 255, 0)'
            }
      }

      drawBackground() {
            this.ctx.fillStyle = '#3FA9F5'
            this.ctx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height)
      }

      initEndingImg() {
            this.victoryImg.img.src = './images/Victory.png'
            this.victoryImg.width = this.canvasSize.width
            this.victoryImg.height = this.victoryImg.width * 0.3
            this.victoryImg.posX = (this.canvasSize.width - this.victoryImg.width) / 2
            this.victoryImg.posY = 130

            this.gameOverImg.img.src = './images/Gameover.png'
            this.gameOverImg.width = this.canvasSize.width
            this.gameOverImg.height = this.gameOverImg.width * 0.3
            this.gameOverImg.posX = (this.canvasSize.width - this.gameOverImg.width) / 2
            this.gameOverImg.posY = 130
      }

      drawGameOver() {
            this.drawBackground()
            this.ctx.fillStyle = 'snow'
            this.ctx.textAlign = 'center'
            this.ctx.font = `bold 35px Courier New`
            this.ctx.drawImage(this.gameOverImg.img, this.gameOverImg.posX, this.gameOverImg.posY, this.gameOverImg.width, this.gameOverImg.height)

            this.ctx.fillText('- Press <ENTER> to go back to MENU -', this.canvasSize.width / 2, 420)
      }

      drawVictory() {
            this.drawBackground()
            this.ctx.fillStyle = 'snow'
            this.ctx.textAlign = 'center'
            this.ctx.font = `bold 35px Courier New`
            this.ctx.drawImage(this.victoryImg.img, this.victoryImg.posX, this.victoryImg.posY, this.victoryImg.width, this.victoryImg.height)

            this.ctx.fillText('- Press <ENTER> to go back to MENU -', this.canvasSize.width / 2, 420)
      }


}