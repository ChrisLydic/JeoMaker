var makeState = {
    
    create: function () {
        switch(currBoard.curr) {
            case "1":
                this.currBoard = currBoard.b1;
                break;
            case "2":
                this.currBoard = currBoard.b2;
                break;
            default:
                //final question?
                break;
        }
        this.build();
    },
    
    update: function () {
        //Mouse over and mouse out check for buttons
        var i;
        for ( i = 0; i < this.buttons.length; i++ ){
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
        
        for (row = 0; row < 6; row++) {
            for (var col = 0; col < 6; col++) {
                posX = (PADDING * (col + 1)) + (widthBox * (col));
                posY = (PADDING * (row + 1)) + (heightBox * (row));
                
                if (row === 0) {
                    btnColor = LIGHT_BLUE;
                    
                    ref = [col];
                    
                    id = topicForm;
                    
                    labelText = this.currBoard.topics[col];
                    
                    if (labelText.length < 13) {
                        heightTopics = heightBox * 0.3;
                    } else if (labelText.length < 30) {
                        heightTopics = heightBox * 0.25;
                    } else {
                        heightTopics = heightBox * 0.2;
                    }
                    
                    styles = {font: heightTopics + 'px Arial', fill: '#FFFFFF', align: 'center', wordWrap: true, wordWrapWidth: widthBox};
                } else {
                    if ( this.currBoard.board[row - 1][col].isComplete() ) {
                        btnColor = PURPLE;
                    } else {
                        btnColor = BLUE;
                    }
                    
                    ref = [row - 1, col];
                    
                    id = aqForm;
                    
                    labelText = this.currBoard.money[row - 1];
                    styles = {font: (heightBox * 0.6) + 'px Arial', fill: '#FFFF99'};
                }
                
                var label = game.add.text(posX + widthBox/2, posY + heightBox/2, labelText, styles);
                label.anchor.setTo(0.5,0.5);
                layers.textLayer.add(label);
                
                this.buttons.push(new RectButton(posX, posY, widthBox, heightBox, btnColor, partial(this.promptRunner, id, ref)));
            }
        }
        
        var graphics = game.add.graphics( 0, 0 );
        layers.bgLayer.add( graphics );
        graphics.beginFill( LIGHT_BLUE );
        graphics.drawRect( 0, (PADDING * 7) + (heightBox * 6), w, MENU_BAR_HEIGHT );
        graphics.endFill();
        
        var padBar = PADDING/2;
        var posYBar = (PADDING * 7) + (heightBox * 6) + padBar;
        var btnBarHeight = 50;
        var btnBarWidth = 200;
        var btnBarWidthSmall = 100;
        var barStyles = {font: '30px Arial', fill: '#FFFFFF' };
        
        if ( currBoard.isDouble ) {
            this.buttons.push( new RectButton( (w/2)-(btnBarWidth*1.5 + padBar), posYBar,
                    btnBarWidth, btnBarHeight, BLUE, partial( this.promptRunner, id, ref ) ) );
            
            this.buttons.push( new RectButton( (w/2)-(btnBarWidth/2), posYBar, btnBarWidth,
                    btnBarHeight, BLUE, partial( this.promptRunner, id, ref ) ) );
            
            this.buttons.push( new RectButton( (w/2)+(btnBarWidth/2 + padBar), posYBar,
                    btnBarWidth, btnBarHeight, BLUE, partial( this.promptRunner, id, ref ) ) );
            
            var label1 = game.add.text( (w/2)-(btnBarWidth*1.5 + padBar)+(btnBarWidth/2),
                    posYBar + (btnBarHeight/2), 'Normal', barStyles );
            
            label1.anchor.setTo(0.5,0.5);
            layers.textLayer.add(label1);
            
            var label2 = game.add.text( (w/2)-(btnBarWidth/2)+(btnBarWidth/2),
                    posYBar + (btnBarHeight/2), 'Double', barStyles );
            
            label2.anchor.setTo(0.5,0.5);
            layers.textLayer.add(label2);
            
            var label3 = game.add.text( (w/2)+(btnBarWidth/2 + padBar)+(btnBarWidth/2),
                    posYBar + (btnBarHeight/2), 'Final Q', barStyles );
            
            label3.anchor.setTo(0.5,0.5);
            layers.textLayer.add(label3);
        } else {
            this.buttons.push( new RectButton( (w/2)-(btnBarWidth + padBar/2), posYBar,
                    btnBarWidth, btnBarHeight, BLUE, partial( this.promptRunner, id, ref ) ) );
            
            this.buttons.push( new RectButton( (w/2)+(padBar/2), posYBar, btnBarWidth,
                    btnBarHeight, BLUE, partial( this.promptRunner, id, ref ) ) );
            
            var label1 = game.add.text( (w/2)-(btnBarWidth + padBar/2)+(btnBarWidth/2),
                    posYBar + (btnBarHeight/2), 'Normal', barStyles );
            
            label1.anchor.setTo(0.5,0.5);
            layers.textLayer.add(label1);
            
            var label2 = game.add.text( (w/2)+(padBar/2)+(btnBarWidth/2), posYBar +
                    (btnBarHeight/2), 'Final Q', barStyles );
            
            label2.anchor.setTo(0.5,0.5);
            layers.textLayer.add(label2);
        }
        
        this.buttons.push( new RectButton( padBar, posYBar, btnBarWidthSmall,
                btnBarHeight, BLUE, partial() ) );
        this.buttons.push( new RectButton( w-( padBar + 100 ), posYBar,
                btnBarWidthSmall, btnBarHeight, BLUE, partial() ) );
        
        var label1 = game.add.text( padBar+(btnBarWidthSmall/2), posYBar +
                (btnBarHeight/2), 'Menu', barStyles );
        
        label1.anchor.setTo(0.5,0.5);
        layers.textLayer.add(label1);
        
        var label2 = game.add.text( w-( padBar + 100 )+(btnBarWidthSmall/2),
                posYBar + (btnBarHeight/2), 'Quit', barStyles );
        
        label2.anchor.setTo(0.5,0.5);
        layers.textLayer.add(label2);
    },
    
    getInput: function (id) {// id is aq or topic
        var form = document.getElementById(id);
        
        if (id === 'aq') {
            a = form.elements['answer'].value;
            q = form.elements['question'].value;
            this.updateAQ( a, q );
        } else if (id === 'topic') {
            topic = form.elements['topicText'].value;
            this.updateTopic( topic );
        }
        
        //container of the forms has Form appended to its name
        document.getElementById( id + 'Form' ).style.display = 'none';
        
        this.build();
    },
    
    promptRunner: function (id, ref) {///////////////////////////////////consider using a phaser button to handle submit
        window.ref = ref;
        var bd = makeState.currBoard;
        var form = document.getElementById(id);
        //currently using AN for testing
        if (id === 'aq') {
            form.elements["answer"].value = bd.board[ window.ref[0] ][ window.ref[1] ].a;
            form.elements["question"].value = bd.board[ window.ref[0] ][ window.ref[1] ].q;
        } else if (id === 'topic') {
            form.elements["topicText"].value = bd.topics[ window.ref[0] ] ;
        }
        
        document.getElementById( id + 'Form' ).style.display = 'flex';
    },
    
    updateTopic: function (topic) {
        this.currBoard.topics[ window.ref[0] ] = topic;
    },
    
    updateAQ: function ( a, q ) {
        this.currBoard.board[ window.ref[0] ][ window.ref[1] ].update( a, q );
    },
    
    popUp: function ( type ) {//types: menu, save, saveErr
        switch(currBoard.curr) {
            case "menu":
                
                break;
            case "save":
                
                break;
            case "saveErr":
                
                break;
            default:
                break;
        }
    }
};