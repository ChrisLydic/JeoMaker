var makeMenuState = {
    
    create: function () {
        this.build();
        //for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        //    console.log( localStorage.getItem( localStorage.key( i ) ) );
        //}
    },
    
    makeStart: function(isDouble) {
        if (localStorage.getItem('Jeo1') !== null){
            console.log(localStorage.getItem('Jeo1'));
            currBoard = localStorage.getItem('Jeo1');
        } else {
            currBoard = new Jeo(isDouble);
        }
        game.state.start('make');
    },
    
    build: function () {
        var buttonOne = new LabelButton('One Round', '30px Arial', '#FFFFFF', 'center', false, game, game.world.centerX, game.world.centerY - 50, 'button', partial(this.makeStart, false), this);
        var labelOne = game.add.text(game.world.centerX, game.world.centerY, 'Description', { font: '12px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: w/2 });
        var buttonDouble = new LabelButton('Double', '30px Arial', '#FFFFFF', 'center', false, game, game.world.centerX, game.world.centerY - 10, 'button', partial(this.makeStart, true), this);
        var labelOne = game.add.text(game.world.centerX, game.world.centerY, 'Description', { font: '12px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: w/2 });
    }
};