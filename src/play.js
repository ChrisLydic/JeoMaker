//play.js
//Runs the play version of the Jeo game, allows team point values to be changed
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
        var teamBtnWidth = 50;
        var barStyles = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        
        //Parameter for makeTeams()
        var teamWidth = w;
        
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
            
            teamWidth -= btnBarWidth + padBar;
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
        
        teamWidth -= btnBarWidth + btnBarWidthSmall + ( 2 * padBar );
        
        var teamX = 10;
        var teamY = h - 60;
        var baseCashAmount = 200;
        
        //Makes the team data and buttons
        //Dependent on whether or not teams can all fit in menu barStyle
        //If not, a button controls which teams are currently shown
        if ( this.oneLineFit( teamWidth, 0 ) ) {
            this.makeTeams( teamX, teamY, teamWidth, 0, baseCashAmount );
        } else {
            teamWidth -= padBar + teamBtnWidth;
            this.makeTeams( teamX, teamY, teamWidth, this.offset, baseCashAmount );
            
            // var teamWidths = this.countTeams( teamWidth, this.offset );
            // this.offset += teamWidths.length;
        
            teamX = teamWidth;
            button1 = game.add.button( teamX, teamY, 'incrementTeams',
                    partial( this.incTeams, teamWidth ), this, 1, 0 );
        }
    },
    
    //Draws a single row of teams using drawTeam()
    makeTeams: function ( x, y, width, offset, amount ) {
        //Setup
        var numTeams;
        var teamWidths;
        
        //Calculate number of teams to draw
        teamWidths = this.countTeams( width, offset );
        numTeams = teamWidths.length;
        
        //Draw teams in loop
        for ( var index = offset; index < ( numTeams + offset ); index++ ) {
            this.drawTeam( x, y, index, amount );
            x += teamWidths[index - offset];
        }
        
        return numTeams;
    },
    
    //Draws a single team's info and buttons to adjust their score
    //The amount variable is the increment/decrement amount
    drawTeam: function ( x, y, index, amount ) {
        //setup
        var graphics = game.add.graphics( 0, 0 );
        
        colorSize = 50;
        pad = 5;
        
        nameStyles = {
            font: '16px Arial',
            fill: LABEL_WHITE,
        };
        scoreStyles = {
            font: '34px Arial',
            fill: LABEL_WHITE,
        };
        
        //draw team color
        //convert color given by html to format phaser recognizes
        graphics.beginFill( Phaser.Color.hexToRGB( currPlayers[index].avatar ) );
        graphics.drawRect( x, y, colorSize, colorSize );
        graphics.endFill();
        
        //draw team name
        x += colorSize + pad;
        
        var label1 = game.add.text( x, y, currPlayers[index].name, nameStyles );
        
        //draw team score
        y += label1.height;
        
        //phaser won't display score when it is zero so '' is appended
        //to convert it to a string beforehand
        var label2 = game.add.text( x, y, '' + currPlayers[index].score, scoreStyles );
        
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
    
    //Finds how many teams will fill one 'line' of space when drawn
    //This allows handling of cases where the teams need multiple lines
    //   of space to be displayed properly
    countTeams: function ( width, offset ) {
        var teamWidths = [];
        var teamWidth;
        var staticWidth = 85;
        var teamPad = 30;
        
        //Iterate over each team, finding the max possible width of each team's
        //   display information, and store each line's width
        for ( var count = offset; count < currPlayers.length; count++ ) {
            teamWidth = staticWidth + teamPad;
            
            var label = game.add.text( w, h, currPlayers[count].name,
                    { font: '16px Arial' } );
            
            //Max width is defined by the MAX_SCORE_WIDTH or the width of the
            //   team's name, whichever is larger
            if ( label.width > MAX_SCORE_WIDTH ) {
                teamWidth += label.width;
            } else {
                teamWidth += MAX_SCORE_WIDTH;
            }
            
            label.destroy();
            
            if ( ( width -= teamWidth ) >= 0 ) {
                teamWidths.push( teamWidth );
            } else {
                break;
            }
        }
        
        return teamWidths;
    },
    
    //Checks if a list of teams is going to fit on a single 'line' of space
    //   using countTeams()
    oneLineFit: function ( width, offset ) {
        var teams = this.countTeams( width, offset );
        
        //If the number of players is equal to the length of teams,
        //   they can all fit on a single line
        if ( ( currPlayers.length - offset ) == teams.length ) {
            return true;
        } else {
            return false;
        }
    },
    
    //For team scores, increments by set amount
    incText: function ( button ) {
        currPlayers[button.index].setScore( button.amount );
        button.label.setText( '' + currPlayers[button.index].score );
    },
    
    //For team scores, decrements by set amount
    decText: function ( button ) {
        currPlayers[button.index].setScore( -(button.amount) );
        button.label.setText( '' + currPlayers[button.index].score );
    },
    
    //Change teams currently shown in menu bar
    incTeams: function ( teamWidth ) {
        var teamWidths = playState.countTeams( teamWidth, this.offset );
        this.offset += teamWidths.length;
        
        if ( this.offset == currPlayers.length ) {
            this.offset = 0;
        }
        
        this.rebuild();
    },
    
    //Opens the answer for a specific button, where the answer is displayed
    //   along with teams and a couple navigation buttons
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
        var teamPad = 25;
        var teamHeight = 50;
        var teamSpace = teamPad;
        if ( playState.oneLineFit( w, 0 ) ) {
            teamSpace += teamHeight + teamPad;
        } else {
            var offs = 0;
            var teamWidths;
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                teamWidths = playState.countTeams( w, offs );
                offs += teamWidths.length;
                teamSpace += teamHeight + teamPad;
            }
            
            teamWidths = playState.countTeams( w, offs );
            teamSpace += teamHeight + teamPad;
        }
        
        //Draw answer
        var text = playState.currRound.board[x][y].a;

        styles = {
            font: '28px Arial',
            fill: LABEL_WHITE,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: w - 100,
            wordWrapHeight: h - ( 150 + teamSpace ),
        };
        
        var label1 = game.add.text( w / 2, 50, text, styles );
        label1.anchor.setTo( 0.5, 0 );
        layers.textLayer.add( label1 );
        
        //Add teams
        if ( playState.oneLineFit( w, 0 ) ) {
            var teamWidthsArr = playState.countTeams( w, 0 );
            var teamWidths = 0;
            
            //Get width the teams will take up
            for ( var i = 0; i < teamWidthsArr.length; i++ ){
                teamWidths += teamWidthsArr[i];
            }
            
            //Account for extra padding at the end
            teamWidths -= 30;
            
            var teamX = ( w - teamWidths ) / 2;
            var teamY = h - ( teamSpace + 100 );
            
            var value = playState.currRound.money[x % 5];
            
            playState.makeTeams( teamX, teamY, teamWidths += 30, 0, value );
        } else {
            var offs = 0;
            var teamX = 10;
            var teamY = h - ( teamSpace + 100 );
            
            var value = playState.currRound.money[x % 5];
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                playState.makeTeams( teamX, teamY, w, offs, value );
                
                var teamWidths = playState.countTeams( w, offs );
                offs += teamWidths.length;
                
                teamY += teamHeight + teamPad;
            }
            
            playState.makeTeams( teamX, teamY, w, offs, value );
            
        }
        
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
    
    //Opens the answer for a specific button, where the answer is displayed
    //   along with teams and a couple navigation buttons
    //Remember that Jeopardy begins with the answer and then reveals
    //   the question
    showFinal: function () {
        game.world.removeAll();
        game.input.onDown.removeAll();
        
        playState.buttons = [];
        
        layers = {
            bgLayer: playState.add.group(),
            btnLayer: playState.add.group(),
            textLayer: playState.add.group()
        };
        
        //Get text height
        var teamPad = 25;
        var teamHeight = 50;
        var teamSpace = teamPad;
        if ( playState.oneLineFit( w, 0 ) ) {
            teamSpace += teamHeight + teamPad;
        } else {
            var offs = 0;
            var teamWidths;
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                teamWidths = playState.countTeams( w, offs );
                offs += teamWidths.length;
                teamSpace += teamHeight + teamPad;
            }
            
            teamWidths = playState.countTeams( w, offs );
            teamSpace += teamHeight + teamPad;
        }
        
        //Draw answer
        var text = playState.currRound.board[x][y].a;

        styles = {
            font: '28px Arial',
            fill: LABEL_WHITE,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: w - 100,
            wordWrapHeight: h - ( 150 + teamSpace ),
        };
        
        var label1 = game.add.text( w / 2, 50, text, styles );
        label1.anchor.setTo( 0.5, 0 );
        layers.textLayer.add( label1 );
        
        //Add teams
        if ( playState.oneLineFit( w, 0 ) ) {
            var teamWidthsArr = playState.countTeams( w, 0 );
            var teamWidths = 0;
            
            //Get width the teams will take up
            for ( var i = 0; i < teamWidthsArr.length; i++ ){
                teamWidths += teamWidthsArr[i];
            }
            
            //Account for extra padding at the end
            teamWidths -= 30;
            
            var teamX = ( w - teamWidths ) / 2;
            var teamY = h - ( teamSpace + 100 );
            
            var value = playState.currRound.money[x % 5];
            
            playState.makeTeams( teamX, teamY, teamWidths += 30, 0, value );
        } else {
            var offs = 0;
            var teamX = 10;
            var teamY = h - ( teamSpace + 100 );
            
            var value = playState.currRound.money[x % 5];
            
            while ( !( playState.oneLineFit( w, offs ) ) ) {
                playState.makeTeams( teamX, teamY, w, offs, value );
                
                var teamWidths = playState.countTeams( w, offs );
                offs += teamWidths.length;
                
                teamY += teamHeight + teamPad;
            }
            
            playState.makeTeams( teamX, teamY, w, offs, value );
            
        }
        
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
    showFinalQuestion: function () {
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
                game.state.start( 'menu' );
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
    
    //Clear the display and rebuild it
    qAnswered: function ( x, y ) {
        playState.currRound.board[x][y].updateAnswer( true );
        playState.rebuild();
    },
    
    //Clear the display and rebuild it
    rebuild: function () {
        game.world.removeAll();
        playState.build();
    }
};