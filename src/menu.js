//menu.js
//Create the main menu for the game, with options to build a new game or play an existing game
var menuState = {
    
    create: function () {
        this.makeMenu();
    },
    
    //Display logo and buttons
    makeMenu: function () {
        var logoText = game.add.text( game.world.centerX, game.world.centerY - 105, 'JeoMaker', {
            font: '60px Arial',
            fill: '#FFFFFF'
        } );

        logoText.anchor.setTo(0.5, 0.5);
        
        var font = {
            font: '30px Arial',
            fill: '#FFFFFF'
        }
        
        //game builder label
        var editorText = game.add.text( game.world.centerX, game.world.centerY - 30,
                'Game Editor', font );

        editorText.anchor.setTo(0.5, 0.5);
        
        function make () {
            editorText.fill = "#FFFF66";
            game.state.start( 'makeMenu' );
        }
        
        editorText.inputEnabled = true;
        //phaser is having problems with the onInputOver event, so no hover
        //   effects for now...
        editorText.events.onInputDown.add( make, this );
        
        //play label
        var playText = game.add.text( game.world.centerX, game.world.centerY + 20,
                'Play', font );

        playText.anchor.setTo(0.5, 0.5);
        
        function play () {
            playText.fill = "#FFFF66";
            game.state.start( 'playMenu' );
        }
        
        playText.inputEnabled = true;
        playText.events.onInputDown.add( play, this );
        
        //help label
        var helpText = game.add.text( game.world.centerX, game.world.centerY + 70,
                'Help', font );

        helpText.anchor.setTo(0.5, 0.5);
        
        function help () {
            helpText.fill = "#FFFF66";
            document.getElementById( 'mHelp' ).style.display = 'flex';
        }
        function helpUp () {
            helpText.fill = "#FFFFFF";
        }
        
        helpText.inputEnabled = true;
        helpText.events.onInputDown.add( help, this );
        helpText.events.onInputDown.add( helpUp, this );
        
        //about label
        var aboutText = game.add.text( game.world.centerX, game.world.centerY + 120,
                'About', font );

        aboutText.anchor.setTo(0.5, 0.5);
        
        function about () {
            aboutText.fill = "#FFFF66";
            document.getElementById( 'about' ).style.display = 'flex';
        }
        function aboutUp () {
            aboutText.fill = "#FFFFFF";
        }
        
        aboutText.inputEnabled = true;
        aboutText.events.onInputDown.add( about, this );
        aboutText.events.onInputUp.add( aboutUp, this );
    },
    
    hideHelp: function () {
        document.getElementById( 'mHelp' ).style.display = 'none';
    },
    
    hideAbout: function () {
        document.getElementById( 'about' ).style.display = 'none';
    }
};