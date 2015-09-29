var makeState = {
    
    Opt: { MAIN: 1, HELP: 2, SAVE: 3, CANCEL: 4 },
    
    create: function () {
        game.world.removeAll();
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
    
    update: function () {
        //Mouse over and mouse out check for buttons
        for ( var i = 0; i < this.buttons.length; i++ ){
            this.buttons[i].isOver();
        }
    },
    
    build: function () {
        layers = {
            bgLayer: this.add.group(),
            btnLayer: this.add.group(),
            textLayer: this.add.group()
        };
        
        this.buttons = [];
        
        var btnColor, row, col, x, y, styles, labelText, heightTopics, ref, id;
        var aqForm = 'aq';
        var topicForm = 'topic';
        
        for ( row = 0; row < 6; row++ ) {
            for ( var col = 0; col < 6; col++ ) {
                posX = ( PADDING * ( col + 1 ) ) + ( widthBox * ( col ) );
                posY = ( PADDING * ( row + 1 ) ) + ( heightBox * ( row ) );
                
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
                } else {
                    //If a tile has been edited already, color it purple
                    if ( this.currRound.board[row - 1][col].isFull() ) {
                        btnColor = PURPLE;
                    } else {
                        btnColor = BLUE;
                    }
                    
                    ref = [row - 1, col];
                    
                    id = aqForm;
                    
                    labelText = '$' + this.currRound.money[row - 1].toString();
                    styles = {
                        font: (heightBox * 0.6) + 'px Arial',
                        fill: LABEL_BLUE
                    };
                }
                
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
            var func1 = 'do nothing';
            var func2 = 'do nothing';
            if ( currBoard.curr === 1 ) {
                func2 = partial( this.switchBoard, 2 );
            } else {
                func1 = partial( this.switchBoard, 1 );
            }
            
            //Board 1 button
            this.buttons.push( new RectButton( ( w / 2 ) - ( btnBarWidth * 1.5 + padBar ),
                    posYBar, btnBarWidth, btnBarHeight, BLUE, func1 ) );
            //Board 2 button
            this.buttons.push( new RectButton( ( w / 2 ) - ( btnBarWidth / 2 ),
                    posYBar, btnBarWidth, btnBarHeight, BLUE, func2 ) );
            
            //Final question button, color is changed if it has been edited
            var fqColor;
            if ( currBoard.finalQ.isFull() ) {
                fqColor = PURPLE;
            } else {
                fqColor = BLUE;
            }
            this.buttons.push( new RectButton( ( w / 2 ) + ( btnBarWidth / 2 + padBar ), posYBar,
                    btnBarWidth, btnBarHeight, fqColor, partial( this.promptRunner, id, ref ) ) );
            
            //Board 1 label
            var label1 = game.add.text( ( w / 2 ) - ( btnBarWidth * 1.5 + padBar) +
                    ( btnBarWidth / 2 ), posYBar + ( btnBarHeight / 2 ), 'Normal', barStyles );
            
            label1.anchor.setTo( 0.5, 0.5 );
            layers.textLayer.add( label1 );
            
            //Board 2 label
            var label2 = game.add.text( ( w / 2 ) - ( btnBarWidth / 2 ) + ( btnBarWidth / 2 ),
                    posYBar + ( btnBarHeight / 2 ), 'Double', barStyles );
            
            label2.anchor.setTo( 0.5, 0.5 );
            layers.textLayer.add( label2 );
            
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
    
    promptRunner: function ( id, ref ) {
        window.ref = ref;
        var bd = makeState.currRound; //////////////////////
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
    
    updateTopic: function ( topic ) {
        this.currRound.topics[ window.ref[0] ] = topic;
    },
    
    updateAQ: function ( a, q ) {
        if ( window.ref[0] === 'F' ) {
            currBoard.finalQ.update( a, q );
        } else {
            this.currRound.board[ window.ref[0] ][ window.ref[1] ].update( a, q );
        }
    },
    
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
    
    save: function () {
        localStorage.setItem( currBoard.name, JSON.stringify( objectify( currBoard ) ) );
    },
    
    switchBoard: function ( num ) {
        if ( num === 1 ) {
            currBoard.curr = 1;
            makeState.create();
        } else {
            currBoard.curr = 2;
            makeState.create();
        }
    }
};