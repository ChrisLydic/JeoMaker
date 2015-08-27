var menuState = {
    
    create: function () {
        /*window.onresize = function () {
            winRes();
            game.world.removeAll();
            menuState.makeMenu();
        }*/
        
        //Menu code here
        this.makeMenu();
    },
    
    makeMenu: function () {
        game.state.start('makeMenu');
    },
    
    play: function () {
        game.state.start('playMenu');
    },
    
    credits: function () {
        game.world.removeAll();
    },
    
    makeMenu: function () {
        var logoText = game.add.text(game.world.centerX, game.world.centerY - 85, 'JeoMaker', { font: '60px Arial', fill: '#FFFFFF' });
        logoText.anchor.setTo(0.5, 0.5);
        
        var buttonStart = new LabelButton('Create a New Game', '30px Arial', '#FFFFFF', 'center', false, game, game.world.centerX, game.world.centerY - 10, 'button', this.makeMenu, this, 2, 1, 0, 3);
        var buttonStart1 = new LabelButton('Play', '30px Arial', '#FFFFFF', 'center', false, game, game.world.centerX, game.world.centerY + 40, 'button', this.play, this, 2, 1, 0, 3);
        var buttonStart2 = new LabelButton('Credits', '30px Arial', '#FFFFFF', 'center', false, game, game.world.centerX, game.world.centerY + 90, 'button', this.credits, this, 2, 1, 0, 3);
    }
};