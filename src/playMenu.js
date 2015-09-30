var playMenuState = {
    
    create: function () {
        this.build();
    },
    
    play: function () {
        game.state.start( 'play' );
    },
    
    build: function () {
        var desc = "Play state is not finished.";
        
        var textValues = {
            font: '12px Arial',
            fill: LABEL_WHITE,
            wordWrap: true,
            wordWrapWidth: w/2
        };
        
        var label1 = game.add.text( game.world.centerX, game.world.centerY, desc, textValues );
    }
};