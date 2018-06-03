

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    sourceMap: true,
                    sourceMapFilename: 'public/assets/styles/styles.css.map',
                    sourceMapURL: 'styles.css.map'
                },
                files: {
                    "public/assets/styles/styles.css": "src/less/style.less"
                }
            },
            beautify: {
                files: {
                    "public/assets/styles/styles.css": "src/less/style.less"
                }
            }
        },
        // Copy web assets from bower_components to more convenient directories.
        copy: {
            main: {
                files: [
                    // Vendor scripts.
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/js/',
                        src: ['**/*.js'],
                        dest: 'public/assets/scripts/bootstrap/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery/dist/',
                        src: ['**/*.js', '**/*.map'],
                        dest: 'public/assets/scripts/jquery/'
                    },

                    // Fonts.
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        cwd: 'bower_components/',
                        src: ['bootstrap/dist/fonts/**'],
                        dest: 'public/assets/fonts/'
                    }
                ]
            }
        },
        concat: {
            development: {
                files: {
                    'public/assets/scripts/libs.js': ['public/assets/scripts/jquery/*.js', 'public/assets/scripts/bootstrap/*.js']
                }
            },
            production: {
                files: {
                    'public/assets/scripts/index.js': ['public/assets/scripts/libs.js', 'public/assets/scripts/common.js']
                }
            }
        },
        uglify: {
            options: {
                sourceMap: false
            },
            production: {
                src: 'public/assets/scripts/index.js',
                dest: 'public/assets/scripts/index.min.js'
            }
        },
        htmlbuild: {
            development: {
                src: 'src/html/layout/*.html',
                dest: './public/',
                options: {
                    sections: {
                        layout: {
                            head: 'src/html/template/head.html',
                            header: 'src/html/template/header.html',
                            scripts: 'src/html/template/scripts.html',
                            footer: 'src/html/template/footer.html'
                        }
                    }
                },
                data: {
                    // Data to pass to templates
                    version: "0.1.0",
                    title: "test"
                }
            }
        },
        replace: {
            html: {
                src: ['./public/*.html'],
                dest: './public/',
                replacements: [{
                    from: /(\.\.\/)+/g,
                    to: ''
                },{
                    from: '.css"/>',
                    to: '.css?timestamp=' + new Date().getTime() + '"/>'
                },{
                    from: 'common.js',
                    to: 'common.js?timestamp=' + new Date().getTime()
                }]
            },
            production: {
                src: ['./public/*.html'],
                dest: './public/',
                replacements: [{
                    from: '<script src="//localhost:35729/livereload.js"></script>',
                    to: ''
                },{
                    from: /\?timestamp=\d+/g,
                    to: ''
                },{
                    from: 'styles.css"/>',
                    to: 'styles.min.css"/>'
                }]
            },
            productionFinal: {
                src: ['./public/*.html'],
                dest: './public/',
                replacements: [{
                    from: '<script src="js/libs.js"></script>',
                    to: ''
                },{
                    from: 'common.js',
                    to: 'index.min.js'
                },{
                    from: 'styles.css"/>',
                    to: 'styles.min.css"/>'
                }]
            },
            beautify: {
                src: ['./public/*.html'],
                dest: './public/',
                replacements: [{
                    from: 'styles.min.css"/>',
                    to: 'styles.css"/>'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['src/js/*.js', 'js/common.js'],
                tasks: ['concat:development'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            styles: {
                files: ['src/less/*.less'],
                tasks: ['less:development', 'postcss'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            html: {
                files: ['src/templates/*.html', 'src/chunks/*.html'],
                tasks: ['htmlbuild', 'replace:html'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer-core')({
                        browsers: ['last 2 version', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 9', 'ie 10', 'ie 11']
                    }).postcss,
                    require('postcss-urlrewrite')({
                        imports: true,
                        properties: [ 'background', 'background-image', 'content', 'src' ],
                        rules: [{ from: /(\.\.\/)+css\//, to: '' }]
                    })
                ]
            },
            dist: {
                src: './public/assets/styles/styles.css'
            }
        },
        csso: {
            production: {
                files: {
                    './public/assets/styles/styles.min.css': ['./public/assets/styles/styles.css']
                }
            }
        },
        cssmin: {
            production: {
                files: {
                    './public/assets/styles/styles.min.css': ['./public/assets/styles/styles.css']
                }
            }
        },
        modernizr: {
            dist: {
                // [REQUIRED] Path to the build you're using for development.
                "srcFile" : "remote",

                // Path to save out the built file.
                "outputFile" : "public/assets/scripts/modernizr.js",

                // Based on default settings on http://modernizr.com/download/
                "extra" : {
                    "shiv" : true,
                    "printshiv" : false,
                    "load" : true,
                    "mq" : false,
                    "cssclasses" : true
                },

                // Based on default settings on http://modernizr.com/download/
                "extensibility" : {
                    "addtest" : false,
                    "prefixed" : true,
                    "teststyles" : true,
                    "testprops" : true,
                    "testallprops" : true,
                    "hasevents" : false,
                    "prefixes" : false,
                    "domprefixes" : true,
                    "cssclassprefix": ""
                },
                "parseFiles" : false,
                "matchCommunityTests" : true,
                "tests" : [ // https://github.com/Modernizr/grunt-modernizr/blob/master/lib/customappr.js#L2-111
                    'svg',
                    'flexbox'
                ]
            }
        },
        removelogging: {
            dist: {
                src: "public/assets/scripts/common.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks("grunt-remove-logging");

    grunt.registerTask('development', ['copy', 'concat:development', 'less:development', 'postcss', 'htmlbuild', 'replace:html', 'modernizr', 'watch']);
    grunt.registerTask('production', ['copy', 'concat:production', 'uglify:production', 'less:development', 'postcss', 'htmlbuild', 'replace:html', 'replace:production', 'cssmin:production', 'modernizr', 'removelogging']);
    grunt.registerTask('production-compress', ['copy', 'concat:production', 'uglify:production', 'less:development', 'postcss', 'htmlbuild', 'replace', 'cssmin:production', 'modernizr', 'removelogging']);
    grunt.registerTask('css-beautify', ['less:beautify', 'postcss', 'replace:beautify']);
};