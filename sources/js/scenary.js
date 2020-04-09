class Scenary {
      constructor(ctx, tileSize) {
            this.ctx = ctx

            this.scenaryMap = [
                  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
                  ['S', '_', '_', '_', 'B', 'B', '_', '_', 'B', 'B', 'B', '2', '_', 'B', 'S'],
                  ['S', '_', 'S', '_', 'S', 'B', 'S', 'B', 'S', '_', 'S', '_', 'S', '_', 'S'],
                  ['S', '_', '_', '_', 'B', '_', '_', '_', '_', 'B', 'B', '_', '_', 'B', 'S'],
                  ['S', '_', 'S', 'B', 'S', 'B', 'S', '_', 'S', 'B', 'S', 'B', 'S', '_', 'S'],
                  ['S', '_', 'B', '_', '_', 'B', '_', '_', '_', 'B', '_', 'B', 'B', 'B', 'S'],
                  ['S', 'B', 'S', 'B', 'S', '_', 'S', '1', 'S', 'B', 'S', '_', 'S', 'B', 'S'],
                  ['S', 'B', '_', '_', 'B', 'B', '_', '_', '_', '_', '_', 'B', 'B', 'B', 'S'],
                  ['S', 'B', 'S', '_', 'S', '_', 'S', '_', 'S', '_', 'S', '_', 'S', 'B', 'S'],
                  ['S', '_', 'B', '_', 'B', 'B', 'B', 'B', 'B', '_', 'B', '_', '_', 'B', 'S'],
                  ['S', '_', 'S', '_', 'S', 'B', 'S', '_', 'S', '_', 'S', 'B', 'S', '_', 'S'],
                  ['S', '_', '1', '_', 'B', 'B', 'B', 'B', 'B', 'B', 'B', '_', '_', '1', 'S'],
                  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S']]

            this.scenaryTiles = [[], [], [], [], [], [], [], [], [], [], [], [], [], []]
            this.tileSize = tileSize
            this.createScenaryTiles()

      }

      //Crea el array de imágenes
      createScenaryTiles() {
            let indexRow = 0
            let indexCol = 0
            //Se rellena el array scenaryTiles con la imagen correspendiente
            this.scenaryMap.forEach(row => {
                  indexCol = 0
                  row.forEach(elm => {
                        switch (elm) {
                              //Pared irrompible
                              case 'S':
                                    this.scenaryTiles[indexRow].push(new Wall(this.ctx, this.tileSize, this.tileSize * indexCol, this.tileSize * indexRow))
                                    break
                              //Pared rompible
                              case 'B':
                                    this.scenaryTiles[indexRow].push(new BreakableWall(this.ctx, this.tileSize, this.tileSize * indexCol, this.tileSize * indexRow))
                                    break
                              case '':
                                    break
                              //Suelos
                              default:
                                    this.scenaryTiles[indexRow].push(new Tile(this.ctx, this.tileSize, this.tileSize * indexCol, this.tileSize * indexRow))
                                    break
                        }
                        indexCol++
                  })
                  indexRow++
            })
      }

      //ACtualiza el estado y pinta las tiles del escenario
      update() {
            this.scenaryTiles.forEach(row => {
                  row.forEach(elm => elm.update())
            })
      }




}
