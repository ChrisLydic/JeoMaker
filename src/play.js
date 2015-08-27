var playState = {
    
    create: function () {
        this.build();
        
    },
    
    update: function () {
        
    },
    
    loadBoard: function () {
        this.jeo = new Jeo(false);
    },
    
    build: function (currJeo) {
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < 6; col++) {
                var box = new Phaser.Rectangle((PADDING * (col + 1)) + (widthBox * (col)), (PADDING * (row + 1)) + (heightBox * (row)), widthBox, heightBox);
                if (row === 0) {
                    game.debug.geom(box,'#00ffff');
                } else {
                    game.debug.geom(box,'#0099ff');
                }
            }
        }
        var box = new Phaser.Rectangle(0, (PADDING * 7) + (heightBox * 6), w, MENU_BAR_HEIGHT);
        game.debug.geom(box,'#00ffff');
    }
};