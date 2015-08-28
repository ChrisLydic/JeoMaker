var makeState = {
    
    create: function () {
        this.loadBoard(true);
        this.build();
        
    },
    
    update: function () {
        
    },
    
    loadBoard: function (isDouble) {
        this.jeo = new Jeo(isDouble);
    },
    
    build: function () {
        this.layers = {
            bgLayer: this.add.group(),
            textLayer: this.add.group()
        };
        
        var btnColor, row, col, x, y, styles, labelText;
        var graphics = game.add.graphics(0, 0);
        this.layers.bgLayer.add(graphics);
        
        for (row = 0; row < 6; row++) {
            for (var col = 0; col < 6; col++) {
                posX = (PADDING * (col + 1)) + (widthBox * (col));
                posY = (PADDING * (row + 1)) + (heightBox * (row));
                
                if (row === 0) {
                    btnColor = 0x00FFFF;
                    
                    labelText = this.jeo.b1.topics[col];
                    styles = { font: (heightBox * 0.2) + 'px Arial', fill: '#FFFFFF', align: 'center', wordWrap: true, wordWrapWidth: widthBox };
                } else {
                    btnColor = 0x0099FF;
                    
                    labelText = this.jeo.b1.money[row - 1];
                    styles = { font: (heightBox * 0.6) + 'px Arial', fill: '#FFFFFF' };
                }
                
                graphics.beginFill(btnColor);
                graphics.drawRect(posX, posY, widthBox, heightBox);
                graphics.endFill();
                
                var label = game.add.text(posX + widthBox/2, posY + heightBox/2, labelText, styles);
                label.anchor.setTo(0.5,0.5);
                this.layers.textLayer.add(label);
                
                makeButton(posX, posY, widthBox, heightBox, partial(console.log, 'yo'));          
            }
        }
        graphics.beginFill(0x00FFFF);
        graphics.drawRect(0, (PADDING * 7) + (heightBox * 6), w, MENU_BAR_HEIGHT);
        graphics.endFill();
    }
};