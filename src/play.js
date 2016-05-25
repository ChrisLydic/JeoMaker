//play.js
//Runs the play version of the Jeo game, allows player point values to be changed
//   and question/answers to be selected, displayed, and exited
//Also provides access to menus for going to main menu and showing help info
var playState = {
    
    //Options for menus
    Opt: { MAIN: 1, HELP: 2, CANCEL: 3 },
    
    //Track offset of currPlayers, only used if they do not fit on one line
    offset: 0,
    
    //Buttons that need to be put into the update loop are added here
    //Phaser buttons do not go in here
    buttons: [],
    
    //From the currently loaded Jeo object, get the correct board
    //   (normal or double jeopardy)
    create: function () {
        //Get the current board
        switch( currBoard.curr ) {
            case 1:
                this.currRound = currBoard.b1;
                break;
            case 2:
                this.currRound = currBoard.b2;
                break;
            default:
                break;
        }
        
        this.build();
    },
    
    //Check for hovering over buttons
    update: function () {
        //Mouse over and mouse out check for buttons
        for ( var i = 0; i < this.buttons.length; i++ ){
            this.buttons[i].isOver();
        }
    },
    
    //Draw the board on the canvas, add event listeners
    //Also makes the switchBoard, finalQuestion, and menu buttons
    build: function () {
        layers = {
            bgLayer: this.add.group(),
            btnLayer: this.add.group(),
            textLayer: this.add.group()
        };
        
        this.buttons = [];
        
        var btnColor, row, col, x, y, styles, labelText, heightTopics;
        
        var graphics = game.add.graphics( 0, 0 );
        layers.bgLayer.add( graphics );
        
        for ( row = 0; row < 6; row++ ) {
            for ( var col = 0; col < 6; col++ ) {
                posX = ( PADDING * ( col + 1 ) ) + ( widthBox * ( col ) );
                posY = ( PADDING * ( row + 1 ) ) + ( heightBox * ( row ) );
                
                if ( row === 0 ) {
                    btnColor = LIGHT_BLUE;
                    
                    labelText = this.currRound.topics[col];
                    
                    //Adjust font size based on length of text
                    if ( labelText.length < 13 ) {
                        heightTopics = heightBox * 0.3;
                    } else if ( labelText.length < 30 ) {
                        heightTopics = heightBox * 0.25;
                    } else {
                        heightTopics = heightBox * 0.2;
                    }
                    
                    styles = {
                        font: heightTopics + 'px Arial',
                        fill: LABEL_WHITE,
                        align: 'center',
                        wordWrap: true,
                        wordWrapWidth: widthBox
                    };
                    
                    graphics.beginFill( btnColor );
                    graphics.drawRect( posX, posY, widthBox, heightBox );
                    graphics.endFill();
                } else {
                    //If a tile has been answered already, color it purple
                    if ( this.currRound.board[row - 1][col].isAnswered ) {
                        btnColor = PURPLE;
                    } else {
                        btnColor = BLUE;
                    }
                    
                    labelText = '$' + this.currRound.money[row - 1].toString();
                    styles = {
                        font: (heightBox * 0.6) + 'px Arial',
                        fill: LABEL_BLUE
                    };
                    
                    this.buttons.push( new RectButton( posX, posY, widthBox, heightBox,
                        btnColor, partial( this.showAnswer, row - 1, col ) ) );
                }
                
                var label = game.add.text( posX + widthBox/2, posY + heightBox/2,
                        labelText, styles );
                label.anchor.setTo( 0.5,0.5 );
                layers.textLayer.add( label );
            }
        }
        
        //Draw menubar
        graphics.beginFill( LIGHT_BLUE );
        graphics.drawRect( 0, ( PADDING * 7 ) + ( heightBox * 6 ), w, MENU_BAR_HEIGHT );
        graphics.endFill();
        
        //Settings for menubar buttons
        var padBar = PADDING/2;
        var posXBar = 0;
        var posYBar = ( PADDING * 7 ) + ( heightBox * 6 ) + padBar;
        var btnBarHeight = 50;
        var btnBarWidth = 200;
        var btnBarWidthSmall = 100;
        var playerBtnWidth = 50;
        var barStyles = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        
        //Parameter for makePlayers()
        var playerWidth = w;
        
        //Draw menubar buttons
        if ( currBoard.isDouble ) {
            //Switch board button
            posXBar = w - ( ( 2 * btnBarWidth ) + btnBarWidthSmall + ( 3 * padBar ) );
            
            this.buttons.push( new RectButton( posXBar, posYBar, btnBarWidth,
                    btnBarHeight, BLUE, this.switchBoard ) );
            
            //Switch board label
            posXBar += btnBarWidth / 2;
            
            var label3 = game.add.text( posXBar, posYBar + ( btnBarHeight / 2 ),
                    'Switch Board', barStyles );
            
            label3.anchor.setTo( 0.5, 0.5 );
            layers.textLayer.add( label3 );
            
            playerWidth -= btnBarWidth + padBar;
        }
        
        //Final question button
        posXBar = w - ( btnBarWidth + btnBarWidthSmall + ( 2 * padBar ) );
        
        this.buttons.push( new RectButton( posXBar, posYBar, btnBarWidth,
                btnBarHeight, BLUE, this.showFinal ) );
        
        //Final Question Label
        posXBar += btnBarWidth / 2;
        
        var label2 = game.add.text( posXBar, posYBar + ( btnBarHeight / 2 ),
                'Final Q', barStyles );
        
        label2.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label2 );
        
        //Menu button
        posXBar = w - ( btnBarWidthSmall + padBar );
        
        this.buttons.push( new RectButton( posXBar, posYBar, btnBarWidthSmall,
                btnBarHeight, BLUE, this.menu ) );
        
        //Menu label
        posXBar += btnBarWidthSmall / 2;
        
        var label1 = game.add.text( posXBar, posYBar + ( btnBarHeight / 2 ),
                'Menu', barStyles );
        
        label1.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label1 );
        
        playerWidth -= btnBarWidth + btnBarWidthSmall + ( 2 * padBar );
        
        var playerX = 10;
        var playerY = h - 60;
        var baseCashAmount = 200;
        
        //Makes the player data and buttons
        //Dependent on whether or not players can all fit in menu barStyle
        //If not, a button controls which players are currently shown
        if ( this.oneLineFit( playerWidth, 0 ) ) {
            this.makePlayers( playerX, playerY, playerWidth, 0, baseCashAmount );
        } else {
            playerWidth -= padBar + playerBtnWidth;
            this.makePlayers( playerX, playerY, playerWidth, this.offset, baseCashAmount );
        
            playerX = playerWidth;
            button1 = game.add.button( playerX, playerY, 'incrementPlayers',
                    partial( this.incPlayers, playerWidth ), this, 1, 0 );
        }
    },
    
    //Draws a single row of players using drawPlayer()
    makePlayers: function ( x, y, width, offset, amount ) {
        //Setup
        var numPlayers;
        var playerWidths;
        
        //Calculate number of players to draw
        playerWidths = this.countPlayers( width, offset );
        numPlayers = playerWidths.length;
        
        //Draw players in loop
        //If this is for final jeopardy, validate wagers appropriately
        if ( amount == 'finalQ' ) {
            for ( var index = offset; index < ( numPlayers + offset ); index++ ) {
                amount = parseInt( document.getElementById( currPlayers[index].name +
                        String( index ) ).value );
                        
                if ( isNaN( amount ) ) {
                    amount = 0;
                } else if ( amount < 0 ) {
                    amount = 0;
                    console.log( 'Negative values are not allowed in final ' +
                            'jeopardy wager' );
                } else if ( amount > currPlayers[index].score ) {
                    amount = currPlayers[index].score;
                    
                    if ( amount < 0 ) {
                        amount = 0;
                    }
                    
                    console.log( 'Values higher than your current score are not ' +
                            'allowed in final jeopardy wager' );
                }
                
                this.drawPlayer( x, y, index, amount );
                x += playerWidths[index - offset];
            }
        } else if ( amount == 'leaderboard' ) {
            for ( var index = offset; index < ( numPlayers + offset ); index++ ) {
                this.drawPlayerScale( x, y, index, 1 );
                x += playerWidths[index - offset];
            }
        } else {
            for ( var index = offset; index < ( numPlayers + offset ); index++ ) {
                this.drawPlayer( x, y, index, amount );
                x += playerWidths[index - offset];
            }
        }
        
        return numPlayers;
    },
    
    //Draws a single player's info and buttons to adjust their score
    //The amount variable is the increment/decrement amount
    drawPlayer: function ( x, y, index, amount ) {
        //draw player info
        coords = this.drawPlayerScale( x, y, index, 1 );
        x = coords[0];
        y = coords[1];
        var label1 = coords[2];
        var label2 = coords[3];
        var pad = coords[4];
        
        //make buttons
        if ( label1.width > MAX_SCORE_WIDTH ) {
            x += label1.width + pad;
        } else {
            x += MAX_SCORE_WIDTH + pad;
        }

        y -= label1.height;
        
        button1 = game.add.button( x, y, 'increment', this.incText, this, 1, 0 );
        button1.amount = amount;
        button1.index = index;
        button1.label = label2;
        
        y += button1.height;
        
        button2 = game.add.button( x, y, 'decrement', this.decText, this, 1, 0 );
        button2.amount = amount;
        button2.index = index;
        button2.label = label2;
    },
    
    //Draws a single player's info
    //Exists so that scaled player info can be drawn on leaderboard without buttons
    drawPlayerScale: function ( x, y, index, scale ) {
        //setup
        var graphics = game.add.graphics( 0, 0 );
        
        var colorSize = ( 50 * scale );
        var pad = ( 5 * scale );
        
        var nameStyles = {
            font: String( 16 * scale ) + 'px Arial',
            fill: LABEL_WHITE,
        };
        var scoreStyles = {
            font: String( 34 * scale ) + 'px Arial',
            fill: LABEL_WHITE,
        };
        
        //draw player color
        //convert color given by html to format phaser recognizes
        graphics.beginFill( Phaser.Color.hexToRGB( currPlayers[index].avatar ) );
        graphics.drawRect( x, y, colorSize, colorSize );
        graphics.endFill();
        
        //draw player name
        x += colorSize + pad;
        
        var label1 = game.add.text( x, y, currPlayers[index].name, nameStyles );
        
        //draw player score
        y += label1.height;
        
        var label2 = game.add.text( x, y, String( currPlayers[index].score ),
                scoreStyles );
        
        //for drawPlayer()
        return [x, y, label1, label2, pad];
    },
    
    //Finds how many players will fill one 'line' of space when drawn
    //This allows handling of cases where the players need multiple lines
    //   of space to be displayed properly
    countPlayers: function ( width, offset ) {
        var playerWidths = [];
        var playerWidth;
        var staticWidth = 85;
        var playerPad = 30;
        
        //Iterate over each player, finding the max possible width of each player's
        //   display information, and store each line's width
        for ( var count = offset; count < currPlayers.length; count++ ) {
            playerWidth = staticWidth + playerPad;
            
            var label = game.add.text( w, h, currPlayers[count].name,
                    { font: '16px Arial' } );
            
            //Max width is defined by the MAX_SCORE_WIDTH or the width of the
            //   player's name, whichever is larger
            if ( label.width > MAX_SCORE_WIDTH ) {
                playerWidth += label.width;
            } else {
                playerWidth += MAX_SCORE_WIDTH;
            }
            
            label.destroy();
            
            if ( ( width -= playerWidth ) >= 0 ) {
                playerWidths.push( playerWidth );
            } else {
                break;
            }
        }
        
        return playerWidths;
    },
    
    //Checks if a list of players is going to fit on a single 'line' of space
    //   using countPlayers()
    oneLineFit: function ( width, offset ) {
        var players = this.countPlayers( width, offset );
        
        //If the number of players is equal to the length of players,
        //   they can all fit on a single line
        if ( ( currPlayers.length - offset ) == players.length ) {
            return true;
        } else {
            return false;
        }
    },
    
    //For player scores, increments by set amount
    incText: function ( button ) {
        currPlayers[button.index].setScore( button.amount );
        button.label.setText( '' + currPlayers[button.index].score );
    },
    
    //For player scores, decrements by set amount
    decText: function ( button ) {
        currPlayers[button.index].setScore( -(button.amount) );
        button.label.setText( '' + currPlayers[button.index].score );
    },
    
    //Change players currently shown in menu bar
    incPlayers: function ( playerWidth ) {
        var playerWidths = playState.countPlayers( playerWidth, this.offset );
        this.offset += playerWidths.length;
        
        if ( this.offset == currPlayers.length ) {
            this.offset = 0;
        }
        
        this.rebuild();
    },
    
    //Opens the answer for a specific button, where the answer is displayed
    //   along with players and a couple navigation buttons
    //Remember that Jeopardy begins with the answer and then reveals
    //   the question
    showAnswer: function ( x, y ) {
        game.world.removeAll();
        game.input.onDown.removeAll();
        
        playState.buttons = [];
        
        layers = {
            bgLayer: playState.add.group(),
            btnLayer: playState.add.group(),
            textLayer: playState.add.group()
        };
        
        //Get text height
        var playerPad = 25;
        var playerHeight = 50;
        var playerSpace = playerPad;
        
        if ( playState.oneLineFit( w, 0 ) ) {
            playerSpace += playerHeight + playerPad;
        } else {
            var offs = 0;
            var playerWidths;
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                playerWidths = playState.countPlayers( w, offs );
                offs += playerWidths.length;
                playerSpace += playerHeight + playerPad;
            }
            
            playerWidths = playState.countPlayers( w, offs );
            playerSpace += playerHeight + playerPad;
        }
        
        //Draw answer
        var text = playState.currRound.board[x][y].a;

        styles = {
            font: '28px Arial',
            fill: LABEL_WHITE,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: w - 100,
            wordWrapHeight: h - ( 150 + playerSpace ),
        };
        
        var label1 = game.add.text( w / 2, 50, text, styles );
        label1.anchor.setTo( 0.5, 0 );
        layers.textLayer.add( label1 );
        
        //Add players
        var value = playState.currRound.money[x % 5];
        var offset = 0;
        playState.makePlayersAQ( value, playerSpace, offset );
        
        //Button setup
        var pad = 50;
        var btnWidth = 200;
        var btnHeight = 50;
        var halfWidth = w / 2;
        var posX = 0;
        var posY = h - ( btnHeight + pad );
        var posYLabel = posY + ( btnHeight / 2 );
        var barStyles = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        
        //Exit button
        posX = halfWidth - ( pad + btnWidth );
                
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, playState.rebuild ) );
        
        //Exit label
        posX += btnWidth / 2;
        
        var label2 = game.add.text( posX, posYLabel, 'Back', barStyles );
        
        label2.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label2 );
        
        //Question Button
        posX = halfWidth + pad;
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, partial( playState.showQuestion, x, y ) ) );
        
        //Question Label
        posX += btnWidth / 2;
        
        var label3 = game.add.text( posX, posYLabel, 'Question', barStyles );
        
        label3.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label3 );
    },
    
    //Edits the answer's text and buttons to display the question
    //This happens when the question button is clicked in the answer mode
    showQuestion: function ( x, y ) {
        //Change text
        layers.textLayer.getChildAt(0).setText( playState.currRound.board[x][y].q );
        layers.textLayer.getChildAt(2).setText( 'Finish' );
        
        //Remove buttons
        for ( var i = 0; i < layers.btnLayer.children.length; i++ ) {
            layers.btnLayer.children[i].destroy( true );
        }
        game.input.onDown.removeAll()
        playState.buttons = [];
        
        //Button setup
        var pad = 50;
        var btnWidth = 200;
        var btnHeight = 50;
        var halfWidth = w / 2;
        var posX = 0;
        var posY = h - ( btnHeight + pad );
        
        //Back button
        posX = halfWidth - ( pad + btnWidth );
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, partial( playState.showAnswer, x, y ) ) );
        
        //Finish button
        posX = halfWidth + pad;
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, partial( playState.qAnswered, x, y ) ) );
    },
    
    //Opens the final answer, where the answer is displayed along with text input
    //   for wagering amounts and a couple navigation buttons
    //Final jeopardy has players wager some amount of their winnings
    showFinal: function () {
        game.world.removeAll();
        game.input.onDown.removeAll();
        
        playState.buttons = [];
        
        layers = {
            bgLayer: playState.add.group(),
            btnLayer: playState.add.group(),
            textLayer: playState.add.group()
        };
        
        //Button setup
        var pad = 50;
        var btnWidth = 200;
        var btnHeight = 50;
        var halfWidth = w / 2;
        var posX = 0;
        var posY = h - ( btnHeight + pad );
        var posYLabel = posY + ( btnHeight / 2 );
        var barStyles = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        
        //Create player wagering form
        var form = document.getElementById( 'finalForm' );
        var playerDiv = document.getElementById( 'finalPlayers' );
        var btnSpace = btnHeight + ( 2 * pad );
        var playerPercent = ( h - btnSpace ) / h;
        
        playerDiv.innerHTML = '';
        playerDiv.style.width = w;
        
        for ( var i = 0; i < currPlayers.length; i++ ) {
            var tempDiv = document.createElement( 'div' );
            var tempP = document.createElement( 'p' );
            var tempText = document.createElement( 'input' );
            
            tempP.style.lineHeight = '0em';
            tempP.style.paddingRight = '5px';
            tempP.innerHTML = currPlayers[i].name + ':';
            tempP.style.fontSize = '2em';
            
            tempText.type = 'text';
            tempText.placeholder = String( currPlayers[i].score );
            tempText.size = 6;
            tempText.maxLength = 10;
            tempText.style.fontSize = '2em';
            
            //Generate an identifier for each text input, so the data can be
            //   retrieved in showFinalQuestion()
            tempText.id = currPlayers[i].name + String( i );
            
            tempDiv.appendChild( tempP );
            tempDiv.appendChild( tempText );
            tempDiv.style.margin = '20px';
            tempDiv.style.height = '3em';
            tempDiv.style.cssFloat = 'left';
            
            playerDiv.appendChild( tempDiv );
        }
        
        form.style.display = 'flex';
        form.style.height = String( playerPercent * 100 ) + '%';
        
        var playerHeight = playerDiv.offsetHeight;
        var playerSpace = h - ( playerHeight + btnSpace );
        playerDiv.style.marginTop = String( playerSpace ) + 'px';
        
        //Draw answer
        var text = currBoard.finalQ.a;

        styles = {
            font: '28px Arial',
            fill: LABEL_WHITE,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: w - 100,
            wordWrapHeight: h - ( btnSpace + playerHeight ),
        };
        
        var label1 = game.add.text( w / 2, 50, text, styles );
        label1.anchor.setTo( 0.5, 0 );
        layers.textLayer.add( label1 );
        
        //Exit button
        posX = halfWidth - ( pad + btnWidth );
                
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, playState.rebuildFinal ) );
        
        //Exit label
        posX += btnWidth / 2;
        
        var label2 = game.add.text( posX, posYLabel, 'Back', barStyles );
        
        label2.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label2 );
        
        //Question Button
        posX = halfWidth + pad;
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, playState.showFinalQuestion ) );
        
        //Question Label
        posX += btnWidth / 2;
        
        var label3 = game.add.text( posX, posYLabel, 'Question', barStyles );
        
        label3.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label3 );
    },
    
    //Edits the final answer's text and buttons to display the final question
    //This happens when the question button is clicked in the answer mode
    showFinalQuestion: function () {
        //Hide the form for player wagers
        document.getElementById( 'finalForm' ).style.display = 'none';
        
        //Change text
        layers.textLayer.getChildAt(0).setText( currBoard.finalQ.q );
        layers.textLayer.getChildAt(2).setText( 'Finish' );
        
        //Remove buttons
        for ( var i = 0; i < layers.btnLayer.children.length; i++ ) {
            layers.btnLayer.children[i].destroy( true );
        }
        game.input.onDown.removeAll()
        playState.buttons = [];
        
        //Button setup
        var pad = 50;
        var btnWidth = 200;
        var btnHeight = 50;
        var halfWidth = w / 2;
        var posX = 0;
        var posY = h - ( btnHeight + pad );
        
        //Back button
        posX = halfWidth - ( pad + btnWidth );
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, playState.showFinal ) );
        
        //Finish button
        posX = halfWidth + pad;
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, playState.leaderboard ) );
                
        //Get text height
        var playerPad = 25;
        var playerHeight = 50;
        var playerSpace = playerPad;
        
        if ( playState.oneLineFit( w, 0 ) ) {
            playerSpace += playerHeight + playerPad;
        } else {
            var offs = 0;
            var playerWidths;
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                playerWidths = playState.countPlayers( w, offs );
                offs += playerWidths.length;
                playerSpace += playerHeight + playerPad;
            }
            
            playerWidths = playState.countPlayers( w, offs );
            playerSpace += playerHeight + playerPad;
        }
        
        //Add players
        var offset = 0;
        playState.makePlayersAQ( 'finalQ', playerSpace, offset );
    },
    
    //When final jeopardy is over, shows the results
    leaderboard: function () {
        game.world.removeAll();
        game.input.onDown.removeAll();
        
        playState.buttons = [];
        
        layers = {
            bgLayer: playState.add.group(),
            btnLayer: playState.add.group(),
            textLayer: playState.add.group()
        };
        
        //Button setup
        var pad = 50;
        var btnWidth = 200;
        var btnHeight = 50;
        var halfWidth = w / 2;
        var posX = 0;
        var posY = h - ( btnHeight + pad );
        var posYLabel = posY + ( btnHeight / 2 );
        var barStyles = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        
        //View board button
        posX = halfWidth - ( pad + btnWidth );
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, playState.rebuild ) );
                
        //View board label
        posX += btnWidth / 2;
        
        var label2 = game.add.text( posX, posYLabel, 'View Board', barStyles );
        
        label2.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label2 );
        
        //Main menu button
        posX = halfWidth + pad;
        
        playState.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, playState.startMenu ) );
        
        //Main menu label
        posX += btnWidth / 2;
        
        var label3 = game.add.text( posX, posYLabel, 'Main Menu', barStyles );
        
        label3.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label3 );
        
        var scale = 4;
        var playerWidths = playState.countPlayers( w, 0 );
        var winnerWidth = ( scale / 2 ) * playerWidths[0]; //actually 1/2 width
        var x = w/2;
        var y = 70;
        
        var style = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        var label3 = game.add.text( x, y, 'Leaderboard', style );
        label3.anchor.setTo(0.5, 0.5);
        
        y *= 2;
        x -= winnerWidth;
        
        currPlayers.sort( playerSort );
        
        var playerPad = 25;
        var playerHeight = 50;
        var playerSpace = playerPad;
        
        var index = 0;
        playState.drawPlayerScale( x, y, index, scale );
        
        index++;
        
        if ( playState.oneLineFit( w, index ) ) {
            playerSpace += playerHeight + playerPad;
        } else {
            var offs = index;
            var playerWidths;
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                playerWidths = playState.countPlayers( w, offs );
                offs += playerWidths.length;
                playerSpace += playerHeight + playerPad;
            }
            
            playerWidths = playState.countPlayers( w, offs );
            playerSpace += playerHeight + playerPad;
        }
        
        playState.makePlayersAQ( 'leaderboard', playerSpace, index );
    },
    
    //Handles drawing players for answers, questions, final jeopardy, and leaderboard
    makePlayersAQ: function ( value, playerSpace, offs ) {
        var playerPad = 25;
        var playerHeight = 50;
        
        if ( playState.oneLineFit( w, offs ) ) {
            var playerWidthsArr = playState.countPlayers( w, offs );
            var playerWidths = 0;
            
            //Get width the players will take up
            for ( var i = 0; i < playerWidthsArr.length; i++ ){
                playerWidths += playerWidthsArr[i];
            }
            
            //Account for extra padding at the end
            playerWidths -= 30;
            
            var playerX = ( w - playerWidths ) / 2;
            var playerY = h - ( playerSpace + 100 );
            
            playState.makePlayers( playerX, playerY, playerWidths += 30, offs, value );
        } else {
            var playerX = 10;
            var playerY = h - ( playerSpace + 100 );
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                playState.makePlayers( playerX, playerY, w, offs, value );
                
                var playerWidths = playState.countPlayers( w, offs );
                offs += playerWidths.length;
                
                playerY += playerHeight + playerPad;
            }
            
            playState.makePlayers( playerX, playerY, w, offs, value );
        }
    },
    
    //Opens the menu
    menu: function () {
        document.getElementById( 'pMenu' ).style.display = 'flex';
    },
    
    //Switches between menus based on input from html buttons
    //Also closes all menus
    menuInput: function ( cmd ) {
        switch( cmd ) {
            case this.Opt.MAIN:
                document.getElementById( 'pMenu' ).style.display = 'none';
                playState.startMenu();
                break;
            case this.Opt.HELP:
                document.getElementById( 'pMenu' ).style.display = 'none';
                document.getElementById( 'pHelp' ).style.display = 'flex';
                break;
            case this.Opt.CANCEL:
                document.getElementById( 'pMenu' ).style.display = 'none';
                document.getElementById( 'pHelp' ).style.display = 'none';
                break;
            default:
                break;
        }
    },
    
    //Go to main menu
    startMenu: function () {
        game.state.start( 'menu' );
    },
    
    //Switch between normal and double jeopardy boards
    switchBoard: function () {
        game.world.removeAll();
        
        if ( currBoard.curr === 1 ) {
            currBoard.curr = 2;
            game.state.start( 'play' );
        } else {
            currBoard.curr = 1;
            game.state.start( 'play' );
        }
    },
    
    //Clear the display and rebuild it while recording that a AQ was viewed
    qAnswered: function ( x, y ) {
        playState.currRound.board[x][y].updateAnswer( true );
        playState.rebuild();
    },
    
    //Hide player html for the final answer and rebuild
    rebuildFinal: function () {
        document.getElementById( 'finalForm' ).style.display = 'none';
        playState.rebuild();
    },
    
    //Clear the display and rebuild it
    rebuild: function () {
        game.world.removeAll();
        playState.build();
    }
};