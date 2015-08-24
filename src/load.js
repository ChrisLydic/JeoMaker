var loadState = {
    
    preload: function () {
        //Add progress bar to screen
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        
        //Load assets
        game.load.image('button', '../assets/empty.png');
        game.load.image('red', '../assets/avatars/red.png');
    },
    
    create: function () {
        //Go to the menu state
        game.state.start('menu');
    }
};