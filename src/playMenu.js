var playMenuState = {
    
    storage: [],
    
    colorEnum: {
        RED: [0, 0x],
        GREEN: [1, 0x],
        BLUE: [2, 0x],
        PURPLE: [3, 0x],
        YELLOW: [4, 0x],
        ORANGE: [5, 0x],
        PINK: [6, 0x]
    },
    
    create: function () {
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
    },
    
    makePlayers: function () {
        var desc = "Play state is not finished.";
        
        var textValues = {
            font: '12px Arial',
            fill: LABEL_WHITE,
            wordWrap: true,
            wordWrapWidth: w/2
        };
        
        var label1 = game.add.text( game.world.centerX, game.world.centerY, desc, textValues );
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
        var colors = document.getElementById( 'colors' );
        var color = colors.options[colors.selectedIndex].text;
        
        var form = document.getElementById( 'player' );
        var name = form.elements['playerName'].value;
        
        document.getElementById( 'playerForm' ).style.display = 'none';
        
        var player = new Player( name, color );
        
        currPlayers.push( player );
    }
};