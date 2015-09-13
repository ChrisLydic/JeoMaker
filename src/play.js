var playState = {
    
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
        
    },
    
    build: function (currJeo) {
        
    }
};