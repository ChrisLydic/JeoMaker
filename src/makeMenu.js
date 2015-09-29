var makeMenuState = {
    
    storage: [],
    
    name: '',
    
    create: function () {  
        //Check if there are any saved Jeo objects in localStorage
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
        game.state.start( 'make' );
    },
    
    gameMenu: function () {
        var desc1 = 'A single round of Jeopardy followed by final Jeopardy.';
        var desc2 = 'A normal round of Jeopardy, followed by double Jeopardy,'
                + ' followed by final Jeopardy.';
        
        var font1 = '30px Arial';
        var textValues = {
            font: '12px Arial',
            fill: LABEL_WHITE,
            wordWrap: true,
            wordWrapWidth: w/2
        };
        
        var buttonOne = new LabelButton( 'One Round', font1, LABEL_WHITE, 'center',
                false, game, game.world.centerX, game.world.centerY - 50, 'button',
                partial( this.makeBoard, false ), this );
        
        var label1 = game.add.text( game.world.centerX, game.world.centerY, desc1, textValues );
        
        var buttonDouble = new LabelButton( 'Double', font1, LABEL_WHITE, 'center',
                false, game, game.world.centerX, game.world.centerY - 10, 'button',
                partial( this.makeBoard, true ), this );
        
        var label2 = game.add.text( game.world.centerX, game.world.centerY, desc2, textValues );
    },
    
    nameMenu: function () {
        document.getElementById( 'ddown' ).style.display = 'flex';
        var select = document.getElementById( 'down' );
        
        for ( var i = 0; i < this.storage.length; i++ ) {
            select.innerHTML = select.innerHTML + '<option>' + this.storage[i] + '</option>';
        }
        
        select.innerHTML = select.innerHTML + '<option>New</option>';
    },
    
    loadJeo: function() {
        var select = document.getElementById( 'down' );
        var nameTemp = select.options[select.selectedIndex].text;
        document.getElementById( 'ddown' ).style.display = 'none';
        
        if ( nameTemp === 'New' ) {
            document.getElementById( 'nameForm' ).style.display = 'flex';
        } else {
            currBoard = unobjectify( JSON.parse( localStorage.getItem( nameTemp ) ) );
            this.makeStart();
        }
    },
    
    inputName: function () {
        var form = document.getElementById( 'name' );
        
        this.name = form.elements['nameText'].value;
        
        document.getElementById( 'nameForm' ).style.display = 'none';
        
        this.gameMenu();
    },
    
    makeBoard: function ( isDouble ) {
        currBoard = new Jeo( this.name, isDouble );
        this.makeStart();
    }
};