//load.js
//Load game assets, display progess bar
var loadState = {
    
    preload: function () {
        //Add progress bar to screen
        var progressBar = game.add.sprite( game.world.centerX, game.world.centerY, 'progressBar' );
        progressBar.anchor.setTo( 0.5, 0.5 );
        game.load.setPreloadSprite( progressBar );
        
        //load assets
        game.load.image( 'button', '../assets/empty.png' );
        game.load.spritesheet( 'increment', '../assets/increment.png', 25, 25 );
        game.load.spritesheet( 'decrement', '../assets/decrement.png', 25, 25 );
        game.load.spritesheet( 'incrementPlayers', '../assets/incrementPlayers.png', 50, 26 );
    },
    
    create: function () {
        //Go to the menu state
        game.state.start( 'menu' );
    }
};