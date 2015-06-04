if (typeof demo==='undefined') demo={};
demo.tests = (function(hashManager){

    var timeout = {};

    function runTest(hash){
        var item = hash.replace(/test\//,'');
        var spec = item.split('/')[1] + '-spec';
        var $runTestLink = $('a[href*="#' + hash + '"]');
        $runTestLink.removeAttr('href').attr('id', 'link-test-' + spec);
        $('html, body').animate({
            scrollTop: $runTestLink.parent().offset().top
        }, 200);
        var $testFrame = $("<iframe src='./iframe.html#" + item + "' style='width:100%'></iframe>");
        $("body").append($testFrame);
        createLightbox($testFrame, spec);
        $runTestLink.on('click', function(){
            showLightbox($('#' +  spec + '-lightbox'));
        });
        timeout[spec] = setInterval(function(){
            $testFrame.height($testFrame.contents().find("body").height());
        },100);
    }

    function updateTestsResults(results){
        var spec = results.spec;
        var failures = results.failures;
        var $runTestLink = $('a[id="link-test-' + spec + '"]');
        if(failures === '0'){
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

    function createLightbox($contents, spec){
        //todo: make lightbox do this automatically
        var lightboxDiv = document.createElement('div');
        var container = document.createElement('div');
        var article = document.createElement('article');
        var $close = $('<a class="internal-link lightbox-close skycon-close black" href="#"><span class="speak">Close</span></a>');
        lightboxDiv.className = 'lightbox';
        lightboxDiv.id = spec + '-lightbox';
        container.className = 'skycom-container lightbox-container clearfix';
        article.className = 'lightbox-content skycom-10 skycom-offset1';
        $(article).append($contents);
        $(container).append($close);
        $(container).append($(article));
        $(lightboxDiv).append($(container));
        $('body').append($(lightboxDiv));
        showLightbox($('#' +  spec + '-lightbox'));
        $close.add($(lightboxDiv)).on('click', function(e){
            hideLightbox(e, $('#' +  spec + '-lightbox'));
            clearInterval(timeout[spec]);
        });
    }

    function registerTests(){
        if (!window.require){
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

    return {
        updateTestsResults: updateTestsResults
    };

});

if (typeof window.define === "function" && window.define.amd){
    define(['bower_components/bskyb-hash-manager/dist/scripts/hash-manager.requirejs'], function(hashManager) {
        demo.tests = demo.tests(hashManager);
        return demo.tests;
    });
} else {
    demo.tests = demo.tests(skyComponents['hash-manager']);
}
