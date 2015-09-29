var bootState = {
    
    preload: function () {
        game.load.image( 'progressBar', '../assets/progressBar.png' );
    },
    
    create: function () {
        //Initial game settings
        game.stage.backgroundColor = DARK_BLUE;
        
        //Start the load state
        game.state.start( 'load' );
    }
};