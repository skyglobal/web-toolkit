
var developerNotesLogger = (function() {

    function logPage(){
        if (!console || !console.group){
            console.log('Please use a real browser for developer notes');
            return;
        }
        console.group($($('h1').get(0)).text());
        $('.wiki-section').each(function(){
            var $section = $(this);
            if ($section.find('> h2').text()) console.groupCollapsed($section.find('> h2').text());

            logNotes($section);

            $section.find('.sub-section').each(function(){
                var $subsection = $(this);
                if ($subsection.find('> h3').text()) console.groupCollapsed($subsection.find('> h3').text());

                logNotes($subsection);

                $subsection.find('.example').each(function(){
                    var $example = $(this);
                    if ($example.find('> h4').text()) console.groupCollapsed($example.find('> h4').text());
                    logNotes($example);
                    if ($example.find('> h4').text()) console.groupEnd();
                });

                if ($subsection.find('> h3').text()) console.groupEnd();
            });
            if ($section.find('> h2').text()) console.groupEnd();
        });
        console.groupEnd();
    }

    function logNotes($section){
        var notes = $section.find('> .developer-notes'),
            dependencies = $section.find('> .dependencies').html(),
            init = $section.find('> script').html();
        if (init){
            init = init.split(';');
            init.shift();
            init = init.join(';');
        }

        notes.each(function(){
            log($(this).html());
        });
        log(dependencies,'Dependencies');
        log(init,'Javascript');
        logDemoCode($section);
    }

    function logDemoCode($this){
        var selector = $this.find('> .demo').attr('data-selector'),
            $examples = $this.find('> .demo > ' + selector).not('.developer-notes');

        $examples.each(function(){
            var html = window.demoCode[selector] || this.outerHTML;
            log(html, '\'' + this.tagName + '\' html');
        });

    }

    function log(text, group){
        if (text && text.trim().length){
            if (group) console.groupCollapsed(group);
            console.log.apply(console,colourCode(text.trim().replace(/&lt;/g,'<').replace(/&gt;/g,'>')));
            if (group) console.groupEnd();
        }
    }

    function colourCode(str){
        var codeCount = str.match(/<code>/gi) === null ? 0 : str.match(/<code>/gi).length;
        var strWithColourCodes = str.replace(/<code>/gi,'%c').replace(/<\/code>/gi,'%c');
        var returnArr = [strWithColourCodes];
        if (strWithColourCodes.indexOf('%c')>-1){
            for (var x=0; x<codeCount; x++){
                returnArr.push('background: #FDF6E3; color: #777;');
                returnArr.push('background: white; color:black;');
            }
        }
        return returnArr;
    }

    return logPage;
});

if (typeof window.define === "function" && window.define.amd){
     define('utils/developer-notes-logger', [],function() {
          return developerNotesLogger();
    });
} else {
    developerNotesLogger();
}
;
var demo = (function(logger) {
    function bindEvents() {
        $(document).on('click','.toggler', toggle);
        $('#check').on('click', checkDiff);
    }

    function checkDiff(e) {
        e.preventDefault();
        var oldVersion = $('#version').val(),
            newVersion = $('.wiki-header small').text().replace('v',''),
            route = 'http://web-toolkit.global.sky.com';
        if (oldVersion.split('.').length<3 || (oldVersion.split('.')[0]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.0.0' or higher");
        }
        if (parseFloat(oldVersion,10)===1 || (oldVersion.split('.')[0]==='0')){
            oldVersion = '0.6.9';//get lowest version available
        }
        window.toolkit.diff({
            oldRoute: route + '/' + oldVersion + '/_site/_includes/',
            newRoute: route + '/' + newVersion + '/_site/_includes/'
        });
    }

    function sortSkyconsTable(){
        var skycons = [];
        var rows = $('#wiki-skycons tbody tr');
        rows.each(function(i){
            skycons.push({i:i, skycon:$(this).find('td').first().text().trim()});
        });
        skycons.sort(function (a, b) {
            if (a.skycon > b.skycon) {
                return 1;
            } else if (a.skycon < b.skycon) {
                return -1;
            } else {
                return 0;
            }
        });
        $('#wiki-skycons tbody tr').remove();
        for (var i=0; i<skycons.length; i++){
            $('#wiki-skycons tbody').append($(rows[skycons[i].i]));
        }
    }

    function toggle(){
        var $toggler = $(this);
        var $example = $('div[data-toggle=' + $toggler.attr('for') + ']');
        if ($example.hasClass('open')){
            $toggler.removeClass('open');
            $example.removeClass('open');
        } else {
            $toggler.addClass('open');
            $example.addClass('open');
        }
    }

    logger();
    bindEvents();
    sortSkyconsTable();
});

if (typeof window.define === "function" && window.define.amd){
    define('demo', ['utils/developer-notes-logger'], function(developerNotesLogger) {
            return demo(developerNotesLogger);
 });
} else {
    demo(developerNotesLogger);
}
;