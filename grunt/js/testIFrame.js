if (typeof testIFrame === 'undefined') testIFrame={};
testIFrame.main = (function() {

    var item = document.location.hash.replace(/#/,'');
    var spec = item.split('/')[1] + '-spec';
    var filesReceived=0;
    var exampleCount=0;

    function getBlanket(callback){
        var script = document.createElement('script');
        script.src = "test/libraries/blanket.js";
        script.setAttribute("data-cover-never", "specs");
        script.setAttribute("data-cover-only", item);
        script.onload =  callback;
        document.head.appendChild(script);
    }
    function getFixtures(){
//        var $examples = $('#' + item.replace('/',' #')).find('.example');
        var $examples = $(window.parent.document).find('#' + item.replace('/','--').replace(/\//,' #') + ' .example');
        if (!$examples.length){
            $('.spinner-blue').remove();
            $('#fixtures').append('No demos found. [$(#' + item.replace('/','--').replace(/\//,' #') + ' .example)]');
            return;
        }
        $examples.each(function(){
            var example = $(this).attr('data-example');
            var init = $(this).find('script').length;
            getCode(item, example, 'html').always(function(data){
                filesReceived++;
                $('#fixtures').append($(data));
                if (init){
                    getCode(item, example, 'js').always(function(data){
                        filesReceived++;
                        if (data){
                            $('#fixtures').append($('<script>' + data + '</script>'));
                        }
                        getTests();
                    });
                }
                getTests();
            });
        });
    }
    function getCode(item, example, ext){
        exampleCount++;
        return $.ajax({
            crossDomain: true,
            cache: false,
            dataType: 'html',
            url: '_includes/' + item + '/' + example + '.' + ext
        });
    }
    function getTests(){
        if (exampleCount !== filesReceived){ return ; }
        require(['specs/' + spec], function(specDescription){
            mocha.grep(specDescription);
            setTimeout(runMocha,2000);
        });
    }
    function runMocha(){
        $('.spinner-blue').remove();
        mocha.run(function (){
            document.location.hash = item;
            if (window.parent && window.parent.demo){
                window.parent.demo.tests.updateTestsResults({ failures:$('.failures em').text(), spec:spec});
            }
        });
    }

    require([item], getFixtures);

})();

