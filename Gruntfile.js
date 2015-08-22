module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            all_src : {
                options : {
                    sourceMap : true,
                    sourceMapName : 'build/sourceMap.map'
                },
                src : ['src/boot.js', 'src/load.js', 'src/menu.js', 'src/play.js', 'src/game.js'],
                dest : 'build/Main.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};