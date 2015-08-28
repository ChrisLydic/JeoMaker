//Initialize Phaser
var w = window.innerWidth;
var h = window.innerHeight;
var game = new Phaser.Game(w, h, Phaser.AUTO, 'gameDiv');

//Resize game, called from a game state when the game is resized
/*var winRes = function() {
    w = window.innerWidth;
    h = window.innerHeight;
    calcBoxDim()
    
    if (game.renderType === Phaser.WEBGL) {
        game.renderer.resize(w, h);
    } else if (game.renderType === Phaser.CANVAS) {
        //code doesn't work
        game.width = w;
        game.height = h;
        game.stage.bounds.width = w;
        game.stage.bounds.height = h;
    }
};*/

//Global variables can be accessed across all states
//game.global = {
//    'score': 0,
//    'name': 'val'
//};

//Make an invisible button
var RectButton = function (x, y, width, height, down, over, out) {
    var btn = new Phaser.Rectangle(x, y, width, height);
    
    var handlePointerDown = function(pointer){
        if ( btn.contains(pointer.x, pointer.y) ) {
            down();
        }
    };
    
    game.input.onDown.add(handlePointerDown);
    
    this.isOver = function (pointer) {
        if ( btn.contains(pointer.x, pointer.y) ) {
            over();
        } else {
            out();
        }
    }
};

RectButton.prototype.constructor = RectButton;

//A partial function allows passing a function as an argument with arguments inside it: use partial(funcName, arg1, arg2, ...)
var partial = function (func) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}









//Get Dimensions
var PADDING = 10;
var MENU_BAR_HEIGHT = 70;
var heightBox, widthBox;
var calcBoxDim = function () {
    heightBox = (h - (MENU_BAR_HEIGHT + (PADDING * 7))) / 6;
    widthBox = (w - (PADDING * 7)) / 6;
};
calcBoxDim()

//Answer/Question Object
var AQ = function() {
    this.a = '';
    this.q = '';
};

AQ.prototype.constructor = AQ;

AQ.prototype.update = function(a, q) {
    this.a = a;
    this.q = q;
};

//Board Object
var Board = function(isDouble) {
    this.isDouble = isDouble;
    this.topics = ['', '', '', '', '', ''];
    this.board = [];
    
    for (var i=0; i<5; i++) {
        this.board[i] = [new AQ(), new AQ(), new AQ(), new AQ(), new AQ(), new AQ()];
    }
    
    if (this.isDouble) {
        this.money = ['$400', '$800', '$1200', '$1600', '$2000'];
    } else {
        this.money = ['$200', '$400', '$600', '$800', '$1000'];
    }
};

Board.prototype.constructor = Board;

//Jeo Object contains all data needed to make a JeoMaker game
var Jeo = function(isDouble) {
    this.isDouble = isDouble;
    this.b1 = new Board(false);
    if (this.isDouble) {
        this.b2 = new Board(true);
    }
};

Jeo.prototype.constructor = Jeo;

Jeo.prototype.setFinalQ = function(q, a) {
    this.finalQ = new AQ();
    this.finalQ.update(q, a);
};
Jeo.prototype.updateFinalQ = function(q, a) {
    this.finalQ.update(q, a);
};

//Player Object
var Player = function(name, avatar) {
    this.name = name;
    this.avatar = avatar;
    this.score = 0;
};

Player.prototype.constructor = Player;

Player.prototype.changeScore = function(amt){
    score += amt;
};
Player.prototype.edit = function(name, avatar){
    this.name = name;
    this.avatar = avatar;
};

//LabelButton Object
var LabelButton = function(label, font, textColor, align, wordWrap, game, x, y, key, callback, callbackContext) {
    Phaser.Button.call(this, game, x, y, key, callback, callbackContext);

    //Create and style label
    this.anchor.setTo( 0.5, 0.5 );
    this.label = new Phaser.Text(game, 0, 0, label, { 'font': font, 'fill': textColor, 'align': align, 'wordWrap': wordWrap, 'wordWrapWidth': widthBox });
 
    //puts the label in the center of the button
    this.label.anchor.setTo( 0.5, 0.5 );
 
    this.addChild(this.label);
    this.setLabel( label );
 
    //adds button to game
    game.add.existing( this );
};
 
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;

LabelButton.prototype.setLabel = function( label ) {
   this.label.setText(label);
};

//Add all states and start bootState
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('makeMenu', makeMenuState);
game.state.add('playMenu', playMenuState);
game.state.add('make', makeState);
game.state.add('play', playState);

game.state.start('boot');