var playState = {
    
    create: function () {
        this.build();
        
    },
    
    update: function () {
        
    },
    
    loadBoard: function () {
        game.global.currJeo = new Jeo(false);
    },
    
    build: function () {
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < 6; col++) {
                var box = new Phaser.Rectangle((padding * (col + 1)) + (widthBox * (col)), (padding * (row + 1)) + (heightBox * (row)), widthBox, heightBox);
                if (row === 0) {
                    game.debug.geom(box,'#00ffff');
                } else {
                    game.debug.geom(box,'#0099ff');
                }
            }
        }
        var box = new Phaser.Rectangle(0, (padding * 7) + (heightBox * 6), w, menuBarHeight);
        game.debug.geom(box,'#00ffff');
    }
};