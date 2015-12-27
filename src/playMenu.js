var playMenuState = {
    
    storage: [],
    
    create: function () {
        this.playerMenu();
        if ( localStorage.length > 0 ) {
            for ( var i = 0, len = localStorage.length; i < len; i++ ) {
                this.storage.push( localStorage.key( i ) );
            }
            this.nameMenu();
        } else {
            this.noSaves();
        }
    },
    
    play: function () {
        game.state.start( 'play' );
    },
    
    noSaves: function () {
        //show a warning: no saved games available
        
        //var desc = "No saved games available.";
        
        //var textValues = {
        //    font: '12px Arial',
        //    fill: LABEL_WHITE,
        //    wordWrap: true,
        //    wordWrapWidth: w/2
        //};
        
        //var label1 = game.add.text( game.world.centerX, game.world.centerY, desc, textValues );
    },
    
    makePlayers: function () {
        this.playerMenu();
    },
    
    nameMenu: function () {
        document.getElementById( 'playForm' ).style.display = 'flex';
        var select = document.getElementById( 'games' );
        
        for ( var i = 0; i < this.storage.length; i++ ) {
            select.innerHTML = select.innerHTML + '<option>' + this.storage[i] + '</option>';
        }
    },
    
    loadJeo: function() {
        var games = document.getElementById( 'games' );
        var nameTemp = games.options[games.selectedIndex].text;
        document.getElementById( 'playForm' ).style.display = 'none';
        
        currBoard = unobjectify( JSON.parse( localStorage.getItem( nameTemp ) ) );
        this.makePlayers();
    },
    
    playerMenu: function () {
        document.getElementById( 'playerForm' ).style.display = 'flex';
    },
    
    makePlayer: function () {
        var form = document.getElementById( 'player' );
        var name = form.elements['playerName'].value;
        var color = form.elements['colors'].value;
                
        var player = new Player( name, color );
        
        currPlayers.push( player );
        
        this.updatePlayers();
    },
    
    updatePlayers: function () {
        var select = document.getElementById( 'players' );
        
        select.innerHTML = '';
        
        for ( var i = 0; i < currPlayers.length; i++ ) {
            select.innerHTML = select.innerHTML + '<option>' + currPlayers[i].name + '</option>';
        }
    }
};