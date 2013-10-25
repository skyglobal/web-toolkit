if (typeof window.define === "function" && window.define.amd) {
    define('wiki', ['toolkit'], function(toolkit) {

        function initModuleDemos(){
            $('#hero').skycom_carousel({
                carousel: {
                    autoplay: true,
                    videoAds: false
                }
            });
            toolkit.modules.init();
        }

        function logPage(){
            if (!console.group){
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
                init = $section.find('> .init').html();

            notes.each(function(){
                log($(this).html());
            });
            log(dependencies,'Dependencies');
            log(init,'Initialisation');
            logDemoCode($section)
        }

        function logDemoCode($this){
            var selector = $this.find('> .demo').attr('data-selector'),
                $examples = $this.find('> .demo > ' + selector).not('.developer-notes');

            $examples.each(function(){
                log(this.outerHTML, '\'' + this.tagName + '\' html');
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
                    returnArr.push('background:white; color:black;');
                }
            }
            return returnArr;
        }

        if (console){
            logPage();
        }

        initModuleDemos();

    });
}