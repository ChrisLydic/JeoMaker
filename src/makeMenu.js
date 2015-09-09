var makeMenuState = {
    
    create: function () {
        this.build();
        
    },
    
    makeStart: function(isDouble) {
        currBoard = new Jeo(isDouble);
        game.state.start('make');
    },
    
    build: function () {
        var buttonOne = new LabelButton('One Round', '30px Arial', '#FFFFFF', 'center', false, game, game.world.centerX, game.world.centerY - 50, 'button', partial(this.makeStart, false), this);
        var labelOne = game.add.text(game.world.centerX, game.world.centerY, 'Description', { font: '12px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: w/2 });
        var buttonDouble = new LabelButton('Double', '30px Arial', '#FFFFFF', 'center', false, game, game.world.centerX, game.world.centerY - 10, 'button', partial(this.makeStart, true), this);
        var labelOne = game.add.text(game.world.centerX, game.world.centerY, 'Description', { font: '12px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: w/2 });
    }
};