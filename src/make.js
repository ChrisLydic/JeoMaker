//make.js
//Game builder, opens Jeo board in edit mode
//Allows users to set or change questions, answers, and topics
//Provides menus for saving the file or going to main menu
var makeState = {
    
    //'Enum' used by menuInput to determine what option has been triggered
    //   from the menu buttons
    Opt: { MAIN: 1, HELP: 2, SAVE: 3, CANCEL: 4 },
    
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
    //Also makes the switchBoard, finalQuestion, menu, and save buttons
    build: function () {
        //Phaser uses layers to determine location on z axis
        layers = {
            bgLayer: this.add.group(),
            btnLayer: this.add.group(),
            textLayer: this.add.group()
        };
        
        //Setup for drawing variables
        //ref variable provides location of the topic or answer/question
        //   in the board object
        var btnColor, row, col, x, y, styles, labelText, heightTopics, ref, id;
        var aqForm = 'aq';
        var topicForm = 'topic';
        
        //Nested loop over the 2d array storing the board, draws topics and
        //   answer/questions
        for ( row = 0; row < 6; row++ ) {
            for ( var col = 0; col < 6; col++ ) {
                //Setup padding amounts
                posX = ( PADDING * ( col + 1 ) ) + ( widthBox * ( col ) );
                posY = ( PADDING * ( row + 1 ) ) + ( heightBox * ( row ) );
                
                //Topics are on the zero row
                if ( row === 0 ) {
                    btnColor = LIGHT_BLUE;
                    
                    ref = [col];
                    
                    id = topicForm;
                    
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
                } else { //answer/question buttons
                    //If a tile has been edited already, color it purple
                    if ( this.currRound.board[row - 1][col].isFull() ) {
                        btnColor = PURPLE;
                    } else {
                        btnColor = BLUE;
                    }
                    
                    ref = [row - 1, col];
                    
                    id = aqForm;
                    
                    //answer/question labels use a dollar amount
                    labelText = '$' + this.currRound.money[row - 1].toString();
                    styles = {
                        font: (heightBox * 0.6) + 'px Arial',
                        fill: LABEL_BLUE
                    };
                }
                
                //Buttons are built based on presets from if statement
                var label = game.add.text( posX + widthBox/2, posY + heightBox/2,
                        labelText, styles );
                label.anchor.setTo( 0.5,0.5 );
                layers.textLayer.add( label );
                
                this.buttons.push( new RectButton( posX, posY, widthBox, heightBox,
                        btnColor, partial( this.promptRunner, id, ref ) ) );
            }
        }
        
        //Draw menubar
        var graphics = game.add.graphics( 0, 0 );
        layers.bgLayer.add( graphics );
        graphics.beginFill( LIGHT_BLUE );
        graphics.drawRect( 0, ( PADDING * 7 ) + ( heightBox * 6 ), w, MENU_BAR_HEIGHT );
        graphics.endFill();
        
        //Settings for menubar buttons
        var padBar = PADDING/2;
        var posYBar = ( PADDING * 7 ) + ( heightBox * 6 ) + padBar;
        var btnBarHeight = 50;
        var btnBarWidth = 200;
        var btnBarWidthSmall = 100;
        var barStyles = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        
        //Setup for final question button
        id = aqForm;
        ref = ['F'];
        
        //Draw menubar buttons
        if ( currBoard.isDouble ) {
            //Switch board button
            this.buttons.push( new RectButton( ( w / 2 ) - ( btnBarWidth * 1.5 + padBar ),
                    posYBar, btnBarWidth, btnBarHeight, BLUE, this.switchBoard ) );
            
            //Final question button, color is changed if it has been edited
            var fqColor;
            if ( currBoard.finalQ.isFull() ) {
                fqColor = PURPLE;
            } else {
                fqColor = BLUE;
            }
            this.buttons.push( new RectButton( ( w / 2 ) + ( btnBarWidth / 2 + padBar ), posYBar,
                    btnBarWidth, btnBarHeight, fqColor, partial( this.promptRunner, id, ref ) ) );
            
            //Switch board label
            var label1 = game.add.text( ( w / 2 ) - ( btnBarWidth * 1.5 + padBar) +
                    ( btnBarWidth / 2 ), posYBar + ( btnBarHeight / 2 ), 'Switch Board', barStyles );
            
            label1.anchor.setTo( 0.5, 0.5 );
            layers.textLayer.add( label1 );
            
            //Final Question Label
            var label3 = game.add.text( ( w / 2 ) + ( btnBarWidth / 2 + padBar ) +
                    ( btnBarWidth / 2 ), posYBar + ( btnBarHeight / 2 ), 'Final Q', barStyles );
            
            label3.anchor.setTo( 0.5, 0.5 );
            layers.textLayer.add( label3 );
        } else {
            //Final question button, color is changed if it has been edited
            var fqColor;
            if ( currBoard.finalQ.isFull() ) {
                fqColor = PURPLE;
            } else {
                fqColor = BLUE;
            }
            this.buttons.push( new RectButton( ( w / 2 ) - ( btnBarWidth / 2 ),
                    posYBar, btnBarWidth, btnBarHeight, fqColor,
                    partial( this.promptRunner, id, ref ) ) );
            
            //Final Question Label
            var label1 = game.add.text( ( w / 2 ), posYBar +
                    ( btnBarHeight / 2 ), 'Final Q', barStyles );
            
            label1.anchor.setTo( 0.5, 0.5 );
            layers.textLayer.add( label1 );
        }
        
        //Menu button
        this.buttons.push( new RectButton( padBar, posYBar, btnBarWidthSmall,
                btnBarHeight, BLUE, partial( this.popUp, 'menu' ) ) );
        //Save button
        this.buttons.push( new RectButton( w - ( padBar + 100 ), posYBar,
                btnBarWidthSmall, btnBarHeight, BLUE, partial( this.popUp, 'save' ) ) );
        
        //Menu label
        var label1 = game.add.text( padBar + ( btnBarWidthSmall / 2 ),
                posYBar + ( btnBarHeight / 2 ), 'Menu', barStyles );
        
        label1.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label1 );
        
        //Save label
        var label2 = game.add.text( w - ( padBar + 100 ) + ( btnBarWidthSmall / 2),
                posYBar + ( btnBarHeight / 2 ), 'Save', barStyles );
        
        label2.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label2 );
    },
    
    //Called by an html form, takes input given in form and updates
    //   the corresponding data in the board
    getInput: function ( id ) {// id is aq or topic
        var form = document.getElementById( id );
        
        if ( id === 'aq' ) {
            a = form.elements['answer'].value;
            q = form.elements['question'].value;
            this.updateAQ( a, q );
        } else if ( id === 'topic' ) {
            topic = form.elements['topicText'].value;
            this.updateTopic( topic );
        }
        
        //container of the forms has Form appended to its name
        document.getElementById( id + 'Form' ).style.display = 'none';
        
        this.build();
    },
    
    //When a topic or answer/question button is clicked, get their current
    //   values and display a form for editing these values
    promptRunner: function ( id, ref ) {
        //Store the reference of the topic or answer/question being edited
        window.ref = ref;
        
        var bd = makeState.currRound; //scope issues here, this gets around them
        var form = document.getElementById( id );

        if ( id === 'aq' && ref[0] !== 'F' ) {
            form.elements['answer'].value = bd.board[ window.ref[0] ][ window.ref[1] ].a;
            form.elements['question'].value = bd.board[ window.ref[0] ][ window.ref[1] ].q;
        } else if ( id === 'aq' && ref[0] === 'F' ) {
            form.elements['answer'].value = currBoard.finalQ.a;
            form.elements['question'].value = currBoard.finalQ.q;
        } else if ( id === 'topic' ) {
            form.elements['topicText'].value = bd.topics[ window.ref[0] ] ;
        }
        
        document.getElementById( id + 'Form' ).style.display = 'flex';
    },
    
    //Updates a topic using a reference value
    updateTopic: function ( topic ) {
        this.currRound.topics[ window.ref[0] ] = topic;
    },
    
    //Updates an answer/question using a reference value
    updateAQ: function ( a, q ) {
        if ( window.ref[0] === 'F' ) {
            currBoard.finalQ.update( a, q );
        } else {
            this.currRound.board[ window.ref[0] ][ window.ref[1] ].update( a, q );
        }
    },
    
    //Brings up menus when their respective buttons are clicked
    popUp: function ( typeP ) {//types: menu, save
        switch( typeP ) {
            case 'menu':
                document.getElementById( typeP ).style.display = 'flex';
                break;
            case 'save':
                if ( currBoard.isFull() ) {
                    this.save();
                } else {
                    document.getElementById( typeP ).style.display = 'flex';
                }
                break;
            default:
                break;
        }
    },
    
    //Switches between menus based on input from html buttons
    //Also closes all menus
    menuInput: function ( cmd ) {
        switch( cmd ) {
            case this.Opt.MAIN:
                document.getElementById( 'menu' ).style.display = 'none';
                game.state.start( 'menu' );
                break;
            case this.Opt.HELP:
                document.getElementById( 'menu' ).style.display = 'none';
                document.getElementById( 'help' ).style.display = 'flex';
                break;
            case this.Opt.SAVE:
                document.getElementById( 'save' ).style.display = 'none';
                this.save();
                break;
            case this.Opt.CANCEL:
                document.getElementById( 'menu' ).style.display = 'none';
                document.getElementById( 'help' ).style.display = 'none';
                document.getElementById( 'save' ).style.display = 'none';
                break;
            default:
                break;
        }
    },
    
    //Create and save a JSON made from board data
    save: function () {
        localStorage.setItem( currBoard.name, JSON.stringify( objectify( currBoard ) ) );
    },
    
    //Switch between normal and double jeopardy boards
    switchBoard: function () {
        game.world.removeAll();
        
        if ( currBoard.curr === 1 ) {
            currBoard.curr = 2;
            game.state.start( 'make' );
        } else {
            currBoard.curr = 1;
            game.state.start( 'make' );
        }
    }
};