if (typeof demo==='undefined') demo={};
demo.tests = (function(hashManager){

    function runTest(hash){
        var spec = hash.replace('test/','');
        require(['specs/' + spec], function(specDescription){
            var $runTestLink = $('a[href*="#' + hash + '"]'),
                $mocha = $('<div id="mocha" class="mocha-container"></div>');
            $runTestLink.parent().after($mocha);
//            var grep = window[spec]();
            mocha.grep(specDescription);
            mocha.run(function(){
                updateTestsResults($runTestLink, $mocha);
                $mocha.attr('id','mocha-' + specDescription);
            });
            $runTestLink.removeAttr('href');
            $('html, body').animate({
                scrollTop: $mocha.parent().prev().offset().top
            }, 200);
            createLightbox($mocha, spec);
            $runTestLink.on('click', function(){
                showLightbox($('#' +  specDescription + '-lightbox'));
            });
        });
    }

    function updateTestsResults($runTestLink, $mocha){
        var findFailure = $mocha.find('.failures em').text();

        if(findFailure === '0'){
            $runTestLink.prepend("<span class='dev-button result-summary'><i class='skycon-tick colour' aria-hidden='true'></i> Tests Passed</span>");
        } else {
            $runTestLink.prepend("<span class='dev-button result-summary error'><i class='skycon-warning colour' aria-hidden='true'></i> Tests Failed</span>");
        }
    }

    function hideLightbox(e,$box){
        e.preventDefault();
        var hide =  $(e.target).hasClass('lightbox-close') ||
            (!$(e.target).hasClass('lightbox-content') && !$(e.target).parents('.lightbox-content').length);
        if ( hide){
            $box.hide().removeClass('lightbox-open');
        }
    }

    function showLightbox($box){
        $box.show().addClass('lightbox-open');
    }

    function createLightbox($mocha, spec){
        //todo: make lightbox do this automatically
        var lightboxDiv = document.createElement('div');
        var container = document.createElement('div');
        var article = document.createElement('article');
        var $close = $('<a class="internal-link lightbox-close skycon-close black" href="#"><span class="speak">Close</span></a>');
        lightboxDiv.className = 'lightbox';
        lightboxDiv.id = spec + '-lightbox';
        container.className = 'skycom-container lightbox-container clearfix';
        article.className = 'lightbox-content skycom-10 skycom-offset1';
        $(article).append($close);
        $(article).append($mocha.find('#mocha-stats'));
        $(article).append($mocha.find('#mocha-report'));
        $(container).append($(article));
        $(lightboxDiv).append($(container));
        $mocha.append($(lightboxDiv));
        showLightbox($('#' +  spec + '-lightbox'));
        $close.add($(lightboxDiv)).on('click', function(e){
            hideLightbox(e, $('#' +  spec + '-lightbox'));
        });
    }

    function registerTests(){
        if (!window.require || !window.describe){
            setTimeout(registerTests,250);
            return;
        }
        var hashes = [];
        $('.run-test').each(function(){
            hashes.push($(this).attr('href').split('#')[1]);
        });
        hashManager.register(hashes, runTest);
    }

    registerTests();

});

if (typeof window.define === "function" && window.define.amd){
    define('demo/tests', ['utils/hashManager'], function(hashManager) {
        return demo.tests(hashManager);
    });
} else {
    demo.tests(toolkit.hashManager);
}
