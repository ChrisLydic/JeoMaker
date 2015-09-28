var makeMenuState = {
    
    storage: [],
    
    name: "",
    
    create: function () {        
        if ( localStorage.length > 0 ) {
            for ( var i = 0, len = localStorage.length; i < len; i++ ) {
                this.storage.push( localStorage.key( i ) );
            }
            this.nameMenu();
        } else {
            document.getElementById( 'nameForm' ).style.display = 'flex';
        }
    },
    
    makeStart: function () {
        game.state.start('make');
    },
    
    gameMenu: function () {
        var desc1 = "A single round of Jeopardy followed by final Jeopardy.";
        var desc2 = "A normal round of Jeopardy, followed by double Jeopardy, followed by final Jeopardy.";
        
        var buttonOne = new LabelButton( 'One Round', '30px Arial', LABEL_WHITE, 'center', false, game, game.world.centerX, game.world.centerY - 50, 'button', partial( this.makeBoard, false ), this );
        var labelOne = game.add.text( game.world.centerX, game.world.centerY, desc1, { font: '12px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: w/2 } );
        var buttonDouble = new LabelButton( 'Double', '30px Arial', LABEL_WHITE, 'center', false, game, game.world.centerX, game.world.centerY - 10, 'button', partial( this.makeBoard, true ), this );
        var labelOne = game.add.text( game.world.centerX, game.world.centerY, desc2, { font: '12px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: w/2 } );
    },
    
    nameMenu: function () {
        document.getElementById( 'ddown' ).style.display = 'flex';
        var select = document.getElementById( 'down' );
        
        for ( var i = 0; i < this.storage.length; i++ ) {
            select.innerHTML = select.innerHTML + "<option>" + this.storage[i] + "</option>";
        }
        
        select.innerHTML = select.innerHTML + "<option>New</option>";
    },
    
    loadJeo: function() {
        var select = document.getElementById( 'down' );
        var nameTemp = select.options[select.selectedIndex].text;
        document.getElementById( 'ddown' ).style.display = 'none';
        
        if ( nameTemp == "New" ) {
            document.getElementById( 'nameForm' ).style.display = 'flex';
        } else {
            currBoard = unobjectify( JSON.parse( localStorage.getItem( nameTemp ) ) );
            this.makeStart();
        }
    },
    
    inputName: function () {
        var form = document.getElementById( "name" );
        
        this.name = form.elements["nameText"].value;
        
        document.getElementById( 'nameForm' ).style.display = 'none';
        
        this.gameMenu();
    },
    
    makeBoard: function ( isDouble ) {
        currBoard = new Jeo( this.name, isDouble );
        this.makeStart();
    }
};