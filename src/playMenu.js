//playMenu.js
//Menu where the game is selected and loaded, and where Players are created
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
            name.value = 'Player Name';
            document.getElementById( 'playerForm' ).style.display = 'none';
            game.state.start( 'play' );
        } else {
            name.value = 'Not enough players';
            name.focus();
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
        
        select.addEventListener( "change", playMenuState.viewEditPlayer );
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
            name.focus();
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
            var form = document.getElementById( 'player' );
            var nameField = form.elements['playerName'];
            var selected = form.elements['players'].value;
            var color = form.elements['colors'];
            var index = 0;
            
            var oldAddBtn = form.elements['addPlayer'];
            var newAddBtn = oldAddBtn.cloneNode(true);
            oldAddBtn.parentNode.replaceChild(newAddBtn, oldAddBtn);
            
            var oldStartBtn = form.elements['startGame'];
            var newStartBtn = oldStartBtn.cloneNode(true);
            oldStartBtn.parentNode.replaceChild(newStartBtn, oldStartBtn);
            
            playerHeader.innerHTML = 'Edit Player';
            nameField.value = selected;
            
            for ( var i = 0; i < currPlayers.length; i++ ) {
                if ( currPlayers[i].name == selected ) {
                    index = i;
                    break;
                }
            }
            
            color.value = currPlayers[index].avatar;
            
            newAddBtn.value = 'Update';
            newStartBtn.value = 'Delete';
            
            newAddBtn.removeAttribute('onclick');
            newAddBtn.addEventListener( 'click', playMenuState.changePlayer );
            newStartBtn.removeAttribute('onclick');
            newStartBtn.addEventListener( 'click', playMenuState.deletePlayer );
            
            if ( !( form.elements['returnPlayer'] ) ) {
                var playerCont = document.getElementById( 'playerCont' );
                var returnBtn = document.createElement("input");
                returnBtn.type = 'button';
                returnBtn.name = 'returnPlayer';  
                returnBtn.value = 'Return';
                returnBtn.addEventListener( 'click', playMenuState.returnPlayer );
                playerCont.appendChild( returnBtn );
            }
        }
        
        //To make sure the selected value has been updated
        //Not an optimal solution...
        setTimeout( setView, 10 );
    },
    
    //Modify a player
    changePlayer: function () {
        var form = document.getElementById( 'player' );
        var nameField = form.elements['playerName'];
        var name = nameField.value;
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
            nameField.value = 'Invalid player name';
            nameField.focus();
        } else {
            currPlayers[index].edit( name, color );
            
            playMenuState.updatePlayers();
            playMenuState.returnPlayer();
        }
    },
    
    //Modify a player
    deletePlayer: function () {
        var form = document.getElementById( 'player' );
        var selected = form.elements['players'].value;
        
        //Remove list item corresponding to player
        for ( var i = 0; i < currPlayers.length; i++ ) {
            if ( currPlayers[i].name == selected ) {
                currPlayers.splice( i, 1 );
                break;
            }
        }
        
        playMenuState.updatePlayers();
        playMenuState.returnPlayer();
    },
    
    //Change player creation menu to create players mode
    returnPlayer: function () {
        var playerHeader = document.getElementById( 'playerHeader' );
        var playerCont = document.getElementById( 'playerCont' );
        var form = document.getElementById( 'player' );
        var nameField = form.elements['playerName'];
        var color = form.elements['colors'];
        var index = 0;
        
        var oldAddBtn = form.elements['addPlayer'];
        var newAddBtn = oldAddBtn.cloneNode( true );
        oldAddBtn.parentNode.replaceChild( newAddBtn, oldAddBtn );
        
        var oldStartBtn = form.elements['startGame'];
        var newStartBtn = oldStartBtn.cloneNode( true );
        oldStartBtn.parentNode.replaceChild( newStartBtn, oldStartBtn );
        
        playerHeader.innerHTML = 'Create Player';
        nameField.value = '';
        nameField.focus();
        color.value = '#FF0000';
        
        newAddBtn.value = 'Add';
        newStartBtn.value = 'Start';
        
        newAddBtn.removeAttribute( 'onclick' );
        newAddBtn.addEventListener( 'click', playMenuState.makePlayer );
        newStartBtn.removeAttribute( 'onclick' );
        newStartBtn.addEventListener( 'click', playMenuState.play );

        var returnBtn = form.elements['returnPlayer'];
        if ( returnBtn ) {
            playerCont.removeChild( returnBtn );
        }
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