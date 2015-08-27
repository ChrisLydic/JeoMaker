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
        var box, row, col, x, y, styles, labelText;
        
        for (row = 0; row < 6; row++) {
            for (var col = 0; col < 6; col++) {
                posX = (PADDING * (col + 1)) + (widthBox * (col));
                posY = (PADDING * (row + 1)) + (heightBox * (row));
                
                var box = new Phaser.Rectangle(x, y, widthBox, heightBox);
                
                if (row === 0) {
                    game.debug.geom(box,'#00ffff');
                    
                    labelText = this.jeo.b1.topics[col];
                    styles = { 'font': '20px Arial', 'fill': '#FFFFFF', 'align': 'center', 'wordWrap': true, 'wordWrapWidth': widthBox };
                } else {
                    game.debug.geom(box,'#0099ff');
                    
                    labelText = this.jeo.b1.money[row - 1];
                    styles = { 'font': '20px Arial', 'fill': '#FFFFFF', 'align': 'center', 'wordWrap': true, 'wordWrapWidth': widthBox };
                }
                
                var label = new Phaser.Text(game, posX, posY, label, styles);
                label.anchor.setTo(0.5, 0.5);
            }
        }
        var box = new Phaser.Rectangle(0, (PADDING * 7) + (heightBox * 6), w, MENU_BAR_HEIGHT);
        game.debug.geom(box,'#00ffff');
    }
};