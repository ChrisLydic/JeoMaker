var playState = {
    
    Opt: { MAIN: 1, HELP: 2, CANCEL: 3 },
    
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
                    if ( this.currRound.board[row - 1][col].isFull() ) {
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
                        btnColor, partial( this.promptRunner, row - 1, col ) ) );
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
        var barStyles = {
            font: '30px Arial',
            fill: LABEL_WHITE
        };
        
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
        }
        
        //Final question button
        posXBar = w - ( btnBarWidth + btnBarWidthSmall + ( 2 * padBar ) );
        
        this.buttons.push( new RectButton( posXBar, posYBar, btnBarWidth,
                btnBarHeight, BLUE, partial( this.promptRunner, 0, 0 ) ) );
        
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
    },
    
    drawTeams: function ( width, offset ) {
        //Calculate number of teams to draw
        
        //Setup
        
        //Draw teams in loop
        for () {}
    },
    
    drawTeam: function ( x, y ) {
        
    },
    
    promptRunner: function ( x, y ) {
        game.world.removeAll();
        
        var text = playState.currRound.board[x][y].a;
        
        styles = {
            font: '24px Arial',
            fill: LABEL_WHITE,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: w - 100,
            wordWrapHeight: h - 200,
        };
        
        var label = game.add.text( w / 2, ( ( h / 2 ) - 100 ), text, styles );
        label.anchor.setTo( 0.5, 0.5 );
        
        //players//
        
        //Button setup
        var pad = 50;
        var btnWidth = 200;
        var btnHeight = 50;
        var halfWidth = w/2;
        var posX = 0;
        var posY = h - btnHeight;
        var posYLabel = posY + ( btnHeight / 2 );
        
        //Exit button
        posX = halfWidth - ( pad + btnWidth );
        
        this.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, this.build ) );
        
        //Exit label
        posX += btnWidth / 2;
        
        var label1 = game.add.text( posX, posYLabel, 'Back', barStyles );
        
        label1.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label1 );
        
        //Question Button
        posX = halfWidth + pad + btnWidth;
        
        this.buttons.push( new RectButton( posX, posY, btnWidth, btnHeight,
                BLUE, partial( this.showQuestion, x, y ) ) );
        
        //Question Label
        posX -= btnWidth / 2;
        
        var label3 = game.add.text( posX, posYLabel, 'Question', barStyles );
        
        label3.anchor.setTo( 0.5, 0.5 );
        layers.textLayer.add( label3 );
    },
    
    menu: function () {
        document.getElementById( 'pMenu' ).style.display = 'flex';
    },
    
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
    
    switchBoard: function () {
        game.world.removeAll();
        
        if ( currBoard.curr === 1 ) {
            currBoard.curr = 2;
            game.state.start( 'play' );
        } else {
            currBoard.curr = 1;
            game.state.start( 'play' );
        }
    }
};