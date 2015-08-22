var menuState = {
    
    create: function () {
        //Menu code here
        
        //Start key press
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.start, this);
    },
    
    start: function () {
        game.state.start('play');
    }
};