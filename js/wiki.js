if (typeof window.define === "function" && window.define.amd) {
    define('wiki', ['toolkit'], function() {

        var vars = {
            lastLog: null
        };

        function bindEvents(){
            $('.example .demo').each(function(){
                var $this = $(this),
                    selector = $this.attr('data-selector'),
                    $examples = $this.find('> ' + selector);
                $examples.each(function(){
                    $(this).data('html',this.outerHTML);
                }).on('mouseenter', showCodePreview)
            });

            $('#hero').skycom_carousel({
                carousel: {
                    autoplay: true,
                    videoAds: false
                }
            });

        }

        function showCodePreview(){
            if (!console){ return; }
            var $this = $(this),
                container = $this.closest('.example'),
                title = container.parent().find('> h2').text(),
                subtitle = container.find('> h3').text(),
                html = $this.data('html'),
                genericNotes = container.parent().find('> .developer-notes').html(),
                notes = container.find('.developer-notes').html(),
                dependencies = container.parent().find('> .dependencies').html(),
                init = container.parent().find('> .init').html();

            if (vars.lastLog == html) { return; }
            vars.lastLog = html;

            console.group(title);

            if (genericNotes && genericNotes.trim().length) {
                console.log.apply(console,colourCode(genericNotes.trim()));
            }

            if (dependencies && dependencies.trim().length){
                console.groupCollapsed('Dependencies');
                    console.log(dependencies);
                console.groupEnd();
            }

            if (init && init.trim().length){
                console.groupCollapsed('Initialisation');
                console.log.apply(console,colourCode(init.trim()));
                console.groupEnd();
            }

            if (notes && notes.trim().length){
                console.groupCollapsed('\'' + subtitle + '\' Notes');
                    console.log.apply(console,colourCode(notes.trim()));
                console.groupEnd();
            }
                console.groupCollapsed('\'' + this.tagName + '\' html');
                    console.log(html);
                console.groupEnd();
            console.groupEnd();
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

        bindEvents();

    });
}