const app = {
      name: 'Masters of boomb!',
      author: 'Héctor Antón',
      version: '1.0',
      description: 'Juego tipo bomberman, donde el jugador derratara enemigos y se abrirá paso a base de bombazos',
      license: undefined,
      canvasDom: undefined,
      ctx: undefined,
      canvasSize: {
            width: undefined,
            height: undefined
      },
      deltaTime: 20,
      menu: undefined,
      game: undefined,
      isPlaying: undefined,

      init(canvasId) {
            //Se prepara el Canvas
            this.canvasDom = document.getElementById(canvasId)
            this.ctx = this.canvasDom.getContext('2d')
            this.setDimensions()

            //MENU
            this.menu = new Menu(this.ctx, this.canvasSize)

            //Crea el nivel de juego
            this.game = new Game(this.ctx, this.canvasSize)

            this.isPlaying = false

            //Intervalo Update
            this.intervalId = setInterval(() => {
                  this.update()
            }, this.deltaTime)

            this.setListeners()
      },

      update() {
            //Se limpia la pantalla
            this.clearScreen()
            this.isPlaying ? this.game.update(this.deltaTime) : this.menu.update(this.deltaTime)


      },

      setDimensions() {
            //Propiedades de Game
            this.canvasSize.width = 975
            this.canvasSize.height = 845
            //Atributos nodo canvas
            this.canvasDom.width = this.canvasSize.width
            this.canvasDom.height = this.canvasSize.height
      },
      clearScreen() {
            this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
      },


      setListeners() {
            document.addEventListener("keydown", e => {
                  switch (e.keyCode) {
                        //ENTER
                        case 13:
                              if (!this.isPlaying) {
                                    this.isPlaying = true
                                    this.game.initialize()
                              } else {
                                    if (!this.game.isPlaying) {
                                          this.isPlaying = false
                                    }
                              }
                              break
                  }
            });
      },

      startGame() {
            this.isPlaying = true
            this.game.initialize()
      }


}