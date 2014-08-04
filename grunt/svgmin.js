module.exports =  {

        options: {                  // Configuration that will be passed directly to SVGO
            plugins: [{
                removeViewBox: false,
                removeUselessStrokeAndFill: true,
                removeEmptyAttrs: true
            }]
        },
        fonts: {                         // Target
            files: [{                   // Dictionary of files
                expand: true,           // Enable dynamic expansion.
                cwd: 'app/src/skycons/',    // Src matches are relative to this path.
                src: ['*.svg'],      // Actual pattern(s) to match.
                dest: 'build/minified/skycons/', // Destination path prefix.
                ext: '.svg'         // Dest filepaths will have this extension.
            }]
        },
        icons: {                         // Target
            files: [{                   // Dictionary of files
                expand: true,           // Enable dynamic expansion.
                cwd: 'app/src/svgs/',    // Src matches are relative to this path.
                src: ['*.svg'],      // Actual pattern(s) to match.
                dest: 'build/minified/svgs/', // Destination path prefix.
                ext: '.svg'         // Dest filepaths will have this extension.
            }]
        }
};
