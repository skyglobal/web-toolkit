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
                cwd: 'static/font-svgs/',    // Src matches are relative to this path.
                src: ['*.svg'],      // Actual pattern(s) to match.
                dest: 'src/fonts/min/', // Destination path prefix.
                ext: '.svg'         // Dest filepaths will have this extension.
            }]
        },
        icons: {                         // Target
            files: [{                   // Dictionary of files
                expand: true,           // Enable dynamic expansion.
                cwd: 'src/svgs/orig/',    // Src matches are relative to this path.
                src: ['*.svg'],      // Actual pattern(s) to match.
                dest: 'src/svgs/min/', // Destination path prefix.
                ext: '.svg'         // Dest filepaths will have this extension.
            }]
        }
};