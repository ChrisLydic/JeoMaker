//playMenu.js
//Menu where the game is selected and loaded, and where teams are created
var playMenuState = {
    
    //Stores all localStorage keys
    storage: [],
    
    //If there are any Jeo boards saved, load all their keys and open a menu to
    //   select between them
    //Otherwise, display error message
    create: function () {
        //Reset player data
        currPlayers = [];
        
        //Check if any games are in local storage
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
            this.noSaves();
        }
    },
    
    //Clean up display and start game as long as there are enough players
    //Current min is two players, change if needed for testing
    play: function () {
        var form = document.getElementById( 'player' );
        var name = form.elements['playerName'];
        
        if ( currPlayers.length > 1 ) {
            document.getElementById( 'players' ).innerHTML = '';
            name.value = 'Team Name';
            document.getElementById( 'playerForm' ).style.display = 'none';
            game.state.start( 'play' );
        } else {
            name.value = 'Not enough players';
            console.log( 'Not enough players' );
        }
    },
    
    //Go back to main menu
    return: function () {
        document.getElementById( 'noSaves' ).style.display = 'none';
        game.state.start( 'menu' );
    },
    
    //Show error message: no saved games available
    noSaves: function () {
        document.getElementById( 'noSaves' ).style.display = 'flex';
    },
    
    //Display all saved Jeo games so user can select one
    nameMenu: function () {
        document.getElementById( 'playForm' ).style.display = 'flex';
        var select = document.getElementById( 'games' );
        
        select.innerHTML = '';
        
        for ( var i = 0; i < this.storage.length; i++ ) {
            select.innerHTML = select.innerHTML + '<option>' + this.storage[i] + '</option>';
        }
    },
    
    //If a Jeo game is selected, load the data from file and open
    //   player creation menu
    loadJeo: function() {
        var games = document.getElementById( 'games' );
        var nameTemp = games.options[games.selectedIndex].text;
        document.getElementById( 'playForm' ).style.display = 'none';
        
        currBoard = unobjectify( JSON.parse( localStorage.getItem( nameTemp ) ) );
        this.playerMenu();
    },
    
    //Show the player creation menu
    playerMenu: function () {
        document.getElementById( 'playerForm' ).style.display = 'flex';
        document.getElementById( 'player' ).elements['playerName'].select();
    },
    
    //Create player from user input, display error message if it is invalid
    makePlayer: function () {
        var form = document.getElementById( 'player' );
        var name = form.elements['playerName'];
        var color = form.elements['colors'].value;
        
        //Remove leading and trailing spaces
        name.value = name.value.trim();
        
        //Check if player already exists
        var checkUnique = false;
        
        for ( var i = 0; i < currPlayers.length; i++ ) {
            if ( currPlayers[i].name == name.value ) { checkUnique = true; }
        }
        
        //Validate name
        if ( name.value.length == 0 || checkUnique ) {
            name.value = 'Invalid player name';
            console.log( 'Invalid player name' );
        } else {
            var player = new Player( name.value, color );
            currPlayers.push( player );
            
            name.value = '';
            name.focus();
            
            this.updatePlayers();
        }
    },
    
    //Update players list in player creation menu,
    //   called when new players are made
    updatePlayers: function () {
        var select = document.getElementById( 'players' );
        
        select.innerHTML = '';
        
        for ( var i = 0; i < currPlayers.length; i++ ) {
            select.innerHTML = select.innerHTML + '<option>' + currPlayers[i].name + '</option>';
        }
    },
    
    //Change color selector's color (in player creation menu)
    //   to the selected color
    colorSet: function () {
        var colors = document.getElementById( 'colors' );
        colors.value = colors.value;
    }
};