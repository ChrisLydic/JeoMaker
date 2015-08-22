//Initialize Phaser
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'gameDiv');

//Global variables can be accessed across all states
game.global = {
    score: 0,
    name: 'val'
};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');