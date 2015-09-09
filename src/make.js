var makeState = {
    
    create: function () {
        switch(currBoard.curr):
            case "1":
                this.currBoard = currBoard.jeo.b1;
                break;
            case "2":
                this.currBoard = currBoard.jeo.b2;
                break;
            default:
                //final question
                break;
        this.build();
        
    },
    
    update: function () {
        
        //Mouse over and mouse out check for buttons
        var i;
        for ( i = 0; i < this.buttons.length; i++ ){
            this.buttons[i].isOver();
        }
        
        //Check if input has been submitted
        if ( globalTempVal.newInput ) {
            console.log("TEEEHEEE");
            this.updateBoard();
            globalTempVal.newInput = false;
            game.state.start("make");
        }
    },
    
    updateBoard: function () {//id is aq or topic
        if ( globalTempVal.id === 'aqForm' ) {
            this.updateAQ( globalTempVal.ref[0], globalTempVal.ref[1] );
        } else if ( globalTempVal.id === 'topicForm' ) {
            this.updateTopic( globalTempVal.ref[0] );
        }
    },
    
    promptRunner: function (id, ref) {
        document.getElementById(id).style.display = 'flex';
        globalTempVal.ref = ref;
    },
    
    updateTopic: function (col) {
        this.currBoard.topics[col] = globalTempVal.topic;
    },
    
    updateAQ: function ( row, col ) {
        this.currBoard.board[row][col].update( globalTempVal.a, globalTempVal.q );
    },
    
    build: function () {
        layers = {
            bgLayer: this.add.group(),
            textLayer: this.add.group()
        };
        
        this.buttons = [];
        
        var btnColor, row, col, x, y, styles, labelText, heightTopics, ref, id;
        var aqForm = 'aqForm';
        var topicForm = 'topicForm';
                
        for (row = 0; row < 6; row++) {
            for (var col = 0; col < 6; col++) {
                posX = (PADDING * (col + 1)) + (widthBox * (col));
                posY = (PADDING * (row + 1)) + (heightBox * (row));
                
                if (row === 0) {
                    btnColor = 0x00BBFF;
                    
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
                    btnColor = 0x0055FF;
                    
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
        
        var graphics = game.add.graphics(0, 0);
        layers.bgLayer.add(graphics);
        graphics.beginFill(0x00BBFF);
        graphics.drawRect(0, (PADDING * 7) + (heightBox * 6), w, MENU_BAR_HEIGHT);
        graphics.endFill();
    }
};