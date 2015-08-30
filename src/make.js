var makeState = {
    
    create: function () {
        this.jeo = new Jeo(false);
        this.currBoard = this.jeo.b1;
        this.build();
        
    },
    
    update: function () {
        var i;
        for (i = 0; i < this.buttons.length; i++){
            this.buttons[i].isOver();
        }
    },
    
    getInput: function (id) {//id is aq or topic
        document.getElementById(id).style.display = 'none';
        var form = document.getElementById (id);
        console.log(this.ref);
        if (id === 'aq') {
            this.tempInput = {
                answer: form.elements["answer"].value,
                question: form.elements["question"].value
            };
            
            this.updateAQ(this.ref[0], this.ref[1]);
        } else if (id === 'topic') {
            this.tempInput = {
                topic: form.elements["topicText"].value
            };
            
            this.updateTopic(this.ref);
        }
    },
    
    promptRunner: function (id, ref) {
        document.getElementById(id).style.display = 'flex';
        this.ref = ref;
        console.log(this.ref);
    },
    
    updateTopic: function (col) {
        this.currBoard.topics[col] = this.tempInput.topic;
        this.build();
    },
    
    updateAQ: function (row, col) {
        this.currBoard.board[row][col].update(this.tempInput.answer, this.tempInput.question);
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
                    
                    ref = col;
                    
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