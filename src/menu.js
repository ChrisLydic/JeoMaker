var menuState = {
    
    create: function () {
        this.makeMenu();
    },
    
    startMake: function () {
        game.state.start( 'makeMenu' );
    },
    
    play: function () {
        game.state.start( 'playMenu' );
    },
    
    about: function () {
        game.world.removeAll();
    },
    
    makeMenu: function () {
        var logoText = game.add.text( game.world.centerX, game.world.centerY - 85, 'JeoMaker', {
            font: '60px Arial',
            fill: '#FFFFFF'
        } );
        
        logoText.anchor.setTo(0.5, 0.5);
        
        var font = '30px Arial';
        
        var buttonStart1 = new LabelButton( 'Create a New Game', font,
                LABEL_WHITE, 'center', false, game, game.world.centerX,
                game.world.centerY - 10, 'button', this.startMake, this );
        
        var buttonStart2 = new LabelButton( 'Play', font, LABEL_WHITE, 'center',
                false, game, game.world.centerX, game.world.centerY + 40,
                'button', this.play, this );
        
        //var buttonStart3 = new LabelButton( 'Help', font, LABEL_WHITE, 'center',
        //        false, game, game.world.centerX, game.world.centerY + 90,
        //        'button', this.about, this );
    }
};