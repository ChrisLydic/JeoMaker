//makeMenu.js
//Menu where the game is selected and loaded, or created as a new object
var makeMenuState = {
    
    //The keys of JSON files stored on user's local storage
    storage: [],
    
    //If a new board is created, its name is stored here
    name: '',
    
    //If there are any Jeo boards saved, load all their keys and open a menu to
    //   select between them
    //Otherwise, open form for naming a new board
    create: function () {  
        //Check if there are any saved Jeo objects in localStorage
        if ( localStorage.length > 0 ) {
            for ( var i = 0, len = localStorage.length; i < len; i++ ) {
                if ( this.storage.indexOf( localStorage.key( i ) ) > -1) {
                    //if the Jeo object has already been loaded, don't load it again
                } else {
                    this.storage.push( localStorage.key( i ) );
                }
            }
            this.nameMenu();
        } else {
            document.getElementById( 'nameForm' ).style.display = 'flex';
        }
    },
    
    //Start the game builder
    makeStart: function () {
        game.state.start( 'make' );
    },
    
    //Gives option of making a single board jeopardy game or a double board game
    //Only shown if user is making a new game
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
        
        var buttonDouble = new LabelButton( 'Double', font1, LABEL_WHITE, 'center',
                false, game, game.world.centerX, game.world.centerY - 10, 'button',
                partial( this.makeBoard, true ), this );
    },
    
    //Makes a menu containing all saved Jeo boards and a New Game option
    nameMenu: function () {
        document.getElementById( 'ddown' ).style.display = 'flex';
        var select = document.getElementById( 'down' );
        
        select.innerHTML = '';
        
        for ( var i = 0; i < this.storage.length; i++ ) {
            select.innerHTML = select.innerHTML + '<option>' + this.storage[i] + '</option>';
        }
        
        select.innerHTML = select.innerHTML + '<option>New</option>';
    },
    
    //If a saved Jeo board is selected, this function will load it from the
    //   file and make it into a Jeo object, then set the current board to
    //   the loaded board
    //If New Game is selected, the proper menu will be opened
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
    
    //Gets the name for a new Jeo board, opens the next menu
    inputName: function () {
        var form = document.getElementById( 'name' );
        
        this.name = form.elements['nameText'].value;
        
        document.getElementById( 'nameForm' ).style.display = 'none';
        
        this.gameMenu();
    },
    
    //Creates a new Jeo board and makes it the current board
    makeBoard: function ( isDouble ) {
        currBoard = new Jeo( this.name, isDouble );
        this.makeStart();
    }
};