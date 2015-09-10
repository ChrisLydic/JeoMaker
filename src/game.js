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

//The jeo object that is currently loaded
//Initialized in the makeMenu or playMenu states //MAKE SURE to handle currently loaded board in these menus
var currBoard;

//Get Dimensions
var PADDING = 20;
var MENU_BAR_HEIGHT = 70;
var heightBox, widthBox;
var calcBoxDim = function () {
    heightBox = (h - (MENU_BAR_HEIGHT + (PADDING * 7))) / 6;
    widthBox = (w - (PADDING * 7)) / 6;
};
calcBoxDim()

//A partial function allows passing a function as an argument with arguments inside it: use partial(funcName, arg1, arg2, ...)
var partial = function (func) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
};

//Answer/Question Object
var AQ = function() {
    this.an = 'Answer';
    this.q = 'Question';
};

AQ.prototype.constructor = AQ;

AQ.prototype.update = function(a, q) {
    this.a = a;
    this.q = q;
};

//Board Object
var Board = function(isDouble) {
    this.isDouble = isDouble;
    this.topics = ['Topic', 'Topic', 'Topic', 'Topic', 'Topic', 'Topic'];
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
    this.curr = "1"; //1 for board 1, 2 for board 2, f for final question
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

//Rectangular button object
var RectButton = function (x, y, width, height, color, down) {
    this.isIn = false;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.down = down;
    this.btn = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
    var btnDown = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
    
    this.graphics = game.add.graphics(0, 0);
    layers.bgLayer.add(this.graphics);
    this.draw(this.color, 1);
    
    var handlePointerDown = function(pointer){
        if ( btnDown.contains(pointer.x, pointer.y) ) {
            down();
        }
    };
    
    game.input.onDown.add(handlePointerDown);
};

RectButton.prototype.constructor = RectButton;

RectButton.prototype.isOver = function () {
        if ( this.btn.contains(game.input.mousePointer.x, game.input.mousePointer.y) && !this.isIn ) {
            this.draw(0xFFFFFF, 0.1);
            this.isIn = true;
        } else if ( !this.btn.contains(game.input.mousePointer.x, game.input.mousePointer.y) && this.isIn ) {
            this.draw(this.color, 1);
            this.isIn = false;
        }
};
RectButton.prototype.draw = function (color, opacity) {
    this.graphics.beginFill(color, opacity);
    this.graphics.drawRect(this.x, this.y, this.width, this.height);
    this.graphics.endFill();
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