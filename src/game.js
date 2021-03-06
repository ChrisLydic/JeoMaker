//game.js
//Contains global variables, functions, and classes
//Initializes the game and starts the boot state

//Initialize Phaser, get size of window
var w = window.innerWidth;
var h = window.innerHeight;
var game = new Phaser.Game( w, h, Phaser.AUTO, 'gameDiv' );

//Resize game, called from a game state when the game is resized
//Has problems when using canvas
//To be implemented...
/*var winRes = function() {
    w = window.innerWidth;
    h = window.innerHeight;
    calcBoxDim()
    
    if ( game.renderType === Phaser.WEBGL ) {
        game.renderer.resize( w, h );
    } else if ( game.renderType === Phaser.CANVAS ) {
        //code doesn't work
        game.width = w;
        game.height = h;
        game.stage.bounds.width = w;
        game.stage.bounds.height = h;
    }
};*/

//The Jeo object that is currently loaded
//Initialized in the makeMenu or playMenu states
var currBoard;

//The player objects that are currently loaded
//Data is added/removed in playMenu state only
var currPlayers = [];

//Cap on number of players
var MAX_PLAYERS = 7;

//Cap on score size (based on max possible score)
var MAX_SCORE_WIDTH = 113;

//Colors for buttons and text
var LIGHT_BLUE = 0x0099FF;
var BLUE = 0x0055FF;
var DARK_BLUE = 0x0000CC;
var PURPLE = 0x4433CC;
var WHITE = 0xFFFFFF;
var LABEL_WHITE = "#FFFFFF";
var LABEL_YELLOW = "#FFCC33";
var LABEL_BLUE = "#CCFFFF";

//Get dimensions of game
//Used for drawing the graphics
var PADDING = 20;
var MENU_BAR_HEIGHT = 70;
var heightBox, widthBox;
var calcBoxDim = function () {
    heightBox = ( h - ( MENU_BAR_HEIGHT + ( PADDING * 7 ) ) ) / 6;
    widthBox = ( w - ( PADDING * 7 ) ) / 6;
};
calcBoxDim();

//Function that allows passing a function as an argument with arguments inside
//ex: partial( function, arg1 )
var partial = function ( func ) {
    var args = Array.prototype.slice.call( arguments, 1 ); 
    return function () {
        var allArguments = args.concat( Array.prototype.slice.call( arguments ) );
        return func.apply( this, allArguments );
    };
};

//Function that makes a simple object from a Jeo class object
//For data storage
var objectify = function ( gameData ) {
    var data;
    
    if ( gameData.isDouble ) {
        var a1 = [];
        var q1 = [];
        var a2 = [];
        var q2 = [];
        
        for ( var i = 0; i < 5; i++ ) {
            for ( var j = 0; j < 6; j++ ) {
                a1.push( gameData.b1.board[i][j].a );
                q1.push( gameData.b1.board[i][j].q );
            }
        }
        
        for ( var i = 0; i < 5; i++ ) {
            for ( var j = 0; j < 6; j++ ) {
                a2.push( gameData.b2.board[i][j].a );
                q2.push( gameData.b2.board[i][j].q );
            }
        }
        
        data = {
            isDouble: true,
            name: gameData.name,
            
            b1: {
                topics: gameData.b1.topics,
                a: a1,
                q: q1
            },
            
            b2: {
                topics: gameData.b2.topics,
                a: a2,
                q: q2
            },
            
            final: {
                a: gameData.finalQ.a,
                q: gameData.finalQ.q
            }
        };
    } else {
        var a1 = [];
        var q1 = [];
        
        for ( var i = 0; i < 5; i++ ) {
            for ( var j = 0; j < 6; j++ ) {
                a1.push( gameData.b1.board[i][j].a );
                q1.push( gameData.b1.board[i][j].q );
            }
        }
        
        data = {
            isDouble: false,
            name: gameData.name,
            
            b1: {
                topics: gameData.b1.topics,
                a: a1,
                q: q1
            },
            
            final: {
                a: gameData.finalQ.a,
                q: gameData.finalQ.q
            }
        };
    }
    
    return data;
};

//Function to make a Jeo class object from an objectified object
//For data storage
var unobjectify = function ( gameData ) {
    var data = new Jeo( gameData.name, gameData.isDouble );
    
    if ( gameData.isDouble ) {
        data.b1.topics = gameData.b1.topics;
        data.b2.topics = gameData.b2.topics;
        
        data.finalQ.update( gameData.final.a, gameData.final.q );
        
        var count = 0;
        for ( var i = 0; i < 5; i++ ) {
            for ( var j = 0; j < 6; j++ ) {
                data.b1.board[i][j].update( gameData.b1.a[count], gameData.b1.q[count] );
                count++;
            }
        }
        
        count = 0;
        for ( var i = 0; i < 5; i++ ) {
            for ( var j = 0; j < 6; j++ ) {
                data.b2.board[i][j].update( gameData.b2.a[count], gameData.b2.q[count] );
                count++;
            }
        }
        
    } else {
        data.b1.topics = gameData.b1.topics;

        data.finalQ.update( gameData.final.a, gameData.final.q );
        
        var count = 0;
        for ( var i = 0; i < 5; i++ ) {
            for ( var j = 0; j < 6; j++ ) {
                data.b1.board[i][j].update( gameData.b1.a[count], gameData.b1.q[count] );
                count++;
            }
        }
    }
    
    return data;
};


//Answer/Question Class
//Holds the answer and question for a specific tile on the Jeo board
var AQ = function () {
    this.a = 'Answer';
    this.q = 'Question';
    this.isAnswered = false;
};

AQ.prototype.constructor = AQ;

AQ.prototype.update = function ( a, q ) {
    this.a = a;
    this.q = q;
};

AQ.prototype.updateAnswer = function ( newBool ) {
    this.isAnswered = newBool;
};

//Check if class has been changed from initial state
AQ.prototype.isFull = function () {
    if ( this.a === 'Answer' || this.q === 'Question' ) {
        return false;
    } else {
        return true;
    }
};

//Board Class
//Contains information on a single round of Jeopardy
var Board = function ( isDouble ) {
    //Either a normal or double Jeopardy round
    this.isDouble = isDouble;
    
    //The topics for this round
    this.topics = ['Topic', 'Topic', 'Topic', 'Topic', 'Topic', 'Topic'];
    
    //2d array contains the tiles for this round
    this.board = [];
    
    for ( var i = 0; i < 5; i++ ) {
        this.board[i] = [new AQ(), new AQ(), new AQ(), new AQ(), new AQ(), new AQ()];
    }
    
    //Display values for the tiles
    if ( this.isDouble ) {
        this.money = [400, 800, 1200, 1600, 2000];
    } else {
        this.money = [200, 400, 600, 800, 1000];
    }
};

Board.prototype.constructor = Board;

//Check is class has been changed from initial state
Board.prototype.isFull = function () {
    //Check if topics are changed from initial state
    for ( var i = 0; i < this.topics.length; i++ ) {
        if ( this.topics[i] === 'Topic' ) {
            return false;
        }
    }
    
    //Check if AQ objects are changed from initial state
    for ( var i = 0; i < this.board.length; i++ ) {
        for ( var j = 0; j < this.board[i].length; j++ ) {
            if ( !this.board[i][j].isFull() ) {
                return false;
            }
        }
    }
    
    return true;
};

//Set all AQ objects to unanswered
Board.prototype.isFull = function () {
    for ( var i = 0; i < this.board.length; i++ ) {
        for ( var j = 0; j < this.board[i].length; j++ ) {
            this.board[i][j].updateAnswer( false );
        }
    }
}


//Jeo Class
//Contains all data needed to make a JeoMaker game
//Has two board objects if it is a double Jeopardy game, one otherwise
var Jeo = function ( name, isDouble ) {
    this.name = name;
    this.curr = 1; //1 for board 1, 2 for board 2
    this.isDouble = isDouble;
    this.finalQ = new AQ();
    this.b1 = new Board( false );
    if ( this.isDouble ) {
        this.b2 = new Board( true );
    }
};

Jeo.prototype.constructor = Jeo;

Jeo.prototype.updateFinalQ = function ( q, a ) {
    this.finalQ.update( q, a );
};

//If all values in the board objects and AQ objects 
//are changed from initial state, returns true
Jeo.prototype.isFull = function () {
    if ( this.isDouble ) {
        return ( this.finalQ.isFull() && this.b1.isFull() && this.b2.isFull() );
    } else {
        return ( this.finalQ.isFull() && this.b1.isFull() );
    }
};

//Set all AQ objects to unanswered
Jeo.prototype.resetAnswers = function () {
    if ( this.isDouble ) {
        this.b2.resetAnswers();
    }
    this.b1.resetAnswers();
};


//Player Class
//Stores player data
var Player = function ( name, avatar ) {
    this.name = name;
    this.avatar = avatar;
    this.score = 0;
};

Player.prototype.constructor = Player;

Player.prototype.setScore = function ( amt ) {
    this.score += amt;
};

Player.prototype.edit = function ( name, avatar ) {
    this.name = name;
    this.avatar = avatar;
};

//Sort function for players, used to find winner
//This sorts in reverse because the winner should be the first item in the array
playerSort = function ( a, b ) {
    return ( b.score - a.score );
}


//Rectangular Button Class
//Custom buttons that use canvas drawing and Phaser
var RectButton = function ( x, y, width, height, color, onDown ) {
    this.isIn = false; //track whether the mouse is hovering over this button
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.onDown = onDown; //the function ran when the button is clicked
    this.btn = new Phaser.Rectangle( this.x, this.y, this.width, this.height );
    var btnDown = new Phaser.Rectangle( this.x, this.y, this.width, this.height );
    
    this.graphics = game.add.graphics( this.x, this.y );
    
    //Check if this function is called from a state with a layers object
    if ( typeof layers !== undefined ) {
        layers.btnLayer.add( this.graphics );
    }
    
    this.draw( this.color, 1 );
    
    var handlePointerDown = function ( pointer ) {
        if ( btnDown.contains( pointer.x, pointer.y ) ) {
            onDown();
        }
    };
    
    game.input.onDown.add( handlePointerDown );
};

RectButton.prototype.constructor = RectButton;

//Check if the mouse is hovering
RectButton.prototype.isOver = function () {
    if ( this.btn.contains( game.input.mousePointer.x, game.input.mousePointer.y ) &&
            !this.isIn ) {
        this.draw( 0xFFFFFF, 0.2 );
        
        var ticksIn = 0;
        var ctxIn = this;
        
        function frameIn () {
            if ( ticksIn < 4 ) {
                ctxIn.graphics.height -= 2;
                ctxIn.graphics.y += 1;
                
                ctxIn.graphics.width -= 2;
                ctxIn.graphics.x += 1;
                
                ticksIn++;
            } else if ( ticksIn == 8 ) {
                clearInterval(animationIn)
            } else if ( ticksIn < 6 ) {
                ctxIn.graphics.height += 2;
                ctxIn.graphics.y -= 1;
                
                ctxIn.graphics.width += 2;
                ctxIn.graphics.x -= 1;
                
                ticksIn++;
            } else {
                ctxIn.graphics.height -= 2;
                ctxIn.graphics.y += 1;
                
                ctxIn.graphics.width -= 2;
                ctxIn.graphics.x += 1;
                
                ticksIn++;
            }
        }
        ctxIn.graphics.height;
        var animationIn = setInterval( frameIn, 30 );

        this.isIn = true;
        
    } else if ( !this.btn.contains( game.input.mousePointer.x, game.input.mousePointer.y ) &&
            this.isIn ) {
        this.draw( this.color, 1 );
        this.isIn = false;
        
        var ticksOut = 0;
        var ctxOut = this;
        
        function frameOut () {
            if ( ticksOut < 4 ) {
                ctxOut.graphics.height += 2;
                ctxOut.graphics.y -= 1;
                
                ctxOut.graphics.width += 2;
                ctxOut.graphics.x -= 1;
                
                ticksOut++;
            } else if ( ticksOut == 20 ) {
                clearInterval(animationOut)
            } else if ( ticksOut < 9 ) {
                ctxOut.graphics.height += 2;
                ctxOut.graphics.y -= 1;
                
                ctxOut.graphics.width += 2;
                ctxOut.graphics.x -= 1;
                
                ticksOut++;
            } else if ( ticksOut < 14 ) {
                ctxOut.graphics.height -= 2;
                ctxOut.graphics.y += 1;
                
                ctxOut.graphics.width -= 2;
                ctxOut.graphics.x += 1;
                
                ticksOut++;
            } else if ( ticksOut < 17 ) {
                ctxOut.graphics.height += 2;
                ctxOut.graphics.y -= 1;
                
                ctxOut.graphics.width += 2;
                ctxOut.graphics.x -= 1;
                
                ticksOut++;
            } else {
                ctxOut.graphics.height -= 2;
                ctxOut.graphics.y += 1;
                
                ctxOut.graphics.width -= 2;
                ctxOut.graphics.x += 1;
                
                ticksOut++;
            }
        }
        ctxOut.graphics.height;
        var animationOut = setInterval(frameOut, 20)
    }
};

//A rectangle drawing function, using Phaser.Graphics
RectButton.prototype.draw = function ( color, opacity ) {
    this.graphics.beginFill( color, opacity );
    this.graphics.drawRect( 0, 0, this.width, this.height );
    this.graphics.endFill();
};


//Add all states and start bootState
game.state.add( 'boot', bootState );
game.state.add( 'load', loadState );
game.state.add( 'menu', menuState );
game.state.add( 'makeMenu', makeMenuState );
game.state.add( 'playMenu', playMenuState );
game.state.add( 'make', makeState );
game.state.add( 'play', playState );

game.state.start( 'boot' );