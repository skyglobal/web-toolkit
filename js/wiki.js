if (typeof window.define === "function" && window.define.amd) {
    define('wiki', ['toolkit'], function() {

        function initModuleDemos(){
            $('#hero').skycom_carousel({
                carousel: {
                    autoplay: true,
                    videoAds: false
                }
            });
        }

        function logPage(){
            console.group($($('h1').get(0)).text());
            $('.section').each(function(){
                var $section = $(this),
                    notes = $section.find('> .developer-notes').html(),
                    dependencies = $section.find('> .dependencies').html(),
                    init = $section.find('> .init').html();

                if ($section.find('> h2').text()) console.groupCollapsed($section.find('> h2').text());

                log(notes);
                log(dependencies,'Dependencies');
                log(init,'Initialisation');

                $section.find('.example .demo').each(logDemoCode);

                if ($section.find('> h2').text()) console.groupEnd();
            });
            console.groupEnd();
        }


        function logDemoCode(){
            var $this = $(this),
                selector = $this.attr('data-selector'),
                $examples = $this.find('> ' + selector),
                container = $this.closest('.example'),
                notes = container.find('> .developer-notes').html(),
                subtitle = container.find('> h3').text();

            if (subtitle){
                console.groupCollapsed('\'' + subtitle + '\'');
            }

            log(notes);

            $examples.each(function(){
                log(this.outerHTML, '\'' + this.tagName + '\' html');
            });

            if (subtitle){
                console.groupEnd();
            }
        }

        function log(text, group){
            if (text && text.trim().length){
                if (group) console.groupCollapsed(group);
                console.log.apply(console,colourCode(text.trim()));
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

        logPage();
        initModuleDemos();

    });
}