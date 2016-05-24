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
        
        //set all AQ to unanswered
        
        
        this.playerMenu();
    },
    
    //Show the player creation menu
    playerMenu: function () {
        document.getElementById( 'playerForm' ).style.display = 'flex';
        document.getElementById( 'player' ).elements['playerName'].select();
        
        var select = document.getElementById( 'players' );
        
        select.addEventListener( "keydown", playMenuState.viewEditPlayer );
        select.addEventListener( "click", playMenuState.viewEditPlayer );
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
        } else {
            var player = new Player( name.value, color );
            currPlayers.push( player );
            
            name.value = '';
            name.focus();
            
            playMenuState.updatePlayers();
        }
    },
    
    //Modify a player
    viewEditPlayer: function () {
        function setView () {
            var playerHeader = document.getElementById( 'playerHeader' );
            var playerCont = document.getElementById( 'playerCont' );
            var form = document.getElementById( 'player' );
            var nameField = form.elements['playerName'];
            var selected = form.elements['players'].value;
            var color = form.elements['colors'];
            var addBtn = form.elements['addPlayer'];
            var startBtn = form.elements['startGame'];
            var index = 0;
            
            playerHeader.innerHTML = 'Edit Team';
            nameField.value = selected;
            
            for ( var i = 0; i < currPlayers.length; i++ ) {
                if ( currPlayers[i].name == selected ) {
                    index = i;
                    break;
                }
            }
            
            color.value = currPlayers[index].avatar;
            
            addBtn.value = 'Update';
            startBtn.value = 'Delete';
            
            addBtn.removeAttribute('onclick');
            addBtn.addEventListener( 'click', playMenuState.changePlayer );
            startBtn.removeAttribute('onclick');
            startBtn.addEventListener( 'click', playMenuState.deletePlayer );
            
            if ( !( form.elements['returnPlayer'] ) ) {
                var btnData = '<input type=\"button\" name=\"returnPlayer\"' +
                        'value=\"Return\" onclick=\"playMenuState.returnPlayer()\">';
                playerCont.innerHTML += btnData;
            }
        }
        
        //To make sure the selected value has been updated
        //Not an optimal solution...
        setTimeout( setView, 10 );
    },
    
    //Modify a player
    changePlayer: function () {
        var form = document.getElementById( 'player' );
        var name = form.elements['playerName'].value;
        var color = form.elements['colors'].value;
        var selected = form.elements['players'].value;
        var index = 0;

        for ( var i = 0; i < currPlayers.length; i++ ) {
            if ( currPlayers[i].name == selected ) {
                index = i;
                break;
            }
        }
        
        name = name.trim();
        
        //Check if player already exists
        var checkUnique = false;
        
        for ( var i = 0; i < currPlayers.length; i++ ) {
            if ( ( currPlayers[i].name == name ) && ( i != index ) ) {
                checkUnique = true;
            }
        }
        
        //Validate name
        if ( name.length == 0 || checkUnique ) {
            name = 'Invalid player name';
        } else {
            currPlayers[index].avatar = color;
            currPlayers[index].name = name;
            
            playMenuState.updatePlayers();
            playMenuState.returnPlayer();
        }
    },
    
    //Modify a player
    deletePlayer: function ( name ) {
        var form = document.getElementById( 'player' );
        var selected = form.elements['players'].value;
        
        for ( var i = 0; i < currPlayers.length; i++ ) {
            if ( currPlayers[i].name == selected ) {
                currPlayers.splice( i, 1 );
                break;
            }
        }
        
        playMenuState.updatePlayers();
        playMenuState.returnPlayer();
    },
    
    //Change player creation menu to create teams mode
    returnPlayer: function ( name ) {
        var playerHeader = document.getElementById( 'playerHeader' );
        var playerCont = document.getElementById( 'playerCont' );
        var form = document.getElementById( 'player' );
        var nameField = form.elements['playerName'];
        var color = form.elements['colors'];
        var addBtn = form.elements['addPlayer'];
        var startBtn = form.elements['startGame'];
        var index = 0;
        
        playerHeader.innerHTML = 'Create Team';
        nameField.value = 'Team Name';
        color.value = '#FF0000';
        
        addBtn.value = 'Add';
        startBtn.value = 'Start';
        
        addBtn.removeAttribute('onclick');
        addBtn.addEventListener( 'click', playMenuState.makePlayer );
        startBtn.removeAttribute('onclick');
        startBtn.addEventListener( 'click', playMenuState.play );
        
        //doesn't work, needs NODE type
        var returnBtn = form.elements['returnPlayer'];
        playerCont.removeChild(returnBtn);
    },
    
    //Update players list in player creation menu,
    //   called when new players are made
    updatePlayers: function () {
        var select = document.getElementById( 'players' );
        
        select.innerHTML = '';
        
        for ( var i = 0; i < currPlayers.length; i++ ) {
            select.innerHTML = select.innerHTML + '<option ' +
                ' >' + currPlayers[i].name + '</option>';
        }
    },
    
    //Change color selector's color (in player creation menu)
    //   to the selected color
    colorSet: function () {
        var colors = document.getElementById( 'colors' );
        colors.value = colors.value;
    }
};