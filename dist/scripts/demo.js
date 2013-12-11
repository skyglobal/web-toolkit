
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
/**
 purpose:
 to let 'anchor' tags do their job and change the hash in the url for internal links.
 this will execute the associated callback with that hash.
 no onclick events needed.
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.hashManager = (function() {

    var vars = {
        globalHashList: {},
        hasLoaded: false,
        windowLoaded: false,
        lastExecutor: null,
        hash: null
    };

    function bindEvents() {
        $(window).on('hashchange', onHashChange);
        var doc_mode = document.documentMode,
        hashChangeSupport = 'onhashchange' in window && ( doc_mode === undefined || doc_mode > 7 );
        if (!hashChangeSupport){ //IE7 support
            vars.hash = document.location.hash;
            setInterval(function(){
                if (document.location.hash !== vars.hash){
                    $(window).trigger( 'hashchange' );
                }
            },200);
        }
        vars.windowLoaded = true;
    }

    function onHashChange(hash) {
        var evt, fn;
        hash = cleanHash((typeof hash === 'string') ? hash : location.hash);
        if (hash) {
            evt = vars.globalHashList[hash];
            fn = 'callback';
            vars.lastExecutor = hash;
        } else if (vars.lastExecutor) {
            evt = vars.globalHashList[vars.lastExecutor];
            fn = 'undo';
        }
        if (evt && typeof evt[fn] === 'function') {
            evt[fn](hash);
        }
    }

    function remove() {
        var loc = window.location;
        if ("pushState" in history) {
            location.hash = '!';
            history.pushState("", document.title, loc.pathname + loc.search);
        } else {
            location.hash = '!';
        }
    }

    function change(hash){
        location.hash = '!' + hash;
    }

    function register(hashList, callback, undo){
        var globalHashList = vars.globalHashList;
        $(hashList).each(function(i, hash) {
            hash = cleanHash(hash);
            if (globalHashList[hash]){
                var err = 'hashManager: hash (' + hash + ') already exists';
                throw new Error(err);
            }
            globalHashList[hash] = {
                callback: callback,
                undo: undo
            };

            if (vars.windowLoaded && hash === cleanHash(location.hash)) {
                onHashChange(hash);
            }
        });
    }

    function resetHash() {
        vars.globalHashList = [];
    }

    function cleanHash(hash) {
        return hash.replace(/[#!]/g, '');
    }

    bindEvents();

    return {
        register: register,
        change: change,
        remove: remove,
        onHashChange: onHashChange,
        resetHash: resetHash,
        cleanHash: cleanHash
    };
});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/hashManager', [], function() {
        return toolkit.hashManager();
    });
} else {
    toolkit.hashManager =  toolkit.hashManager();
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.focus = (function () {
    

    var tabKey = false;
    var focusClass = 'has-focus';

    function bindEvents(){
        $(document)
            .on('click keyup',keyUp)
            .on('keydown', keyDown)
            .on('focus', "a, input, button, select, *[tabindex]", addClass)
            .on('blur', "a, input, button, select, *[tabindex]", removeClass);
    }

    function addClass(e) {
        if (tabKey) {
            $(e.currentTarget).addClass(focusClass);
        }
    }

    function removeClass(e) {
        $(e.currentTarget).removeClass(focusClass);
    }

    function keyDown(e){
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        if (KeyID == 9) {tabKey = true;}
    }

    function keyUp(e){
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        if (KeyID == 9) {tabKey = false;}
    }

    function apply(el){
        $(el).addClass(focusClass);
        el.focus();
    }

    bindEvents();

    return {
        apply: apply,
        className: focusClass
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/focus', [], function() {
        
        return toolkit.focus();
    });
} else {
    toolkit.focus = toolkit.focus();
};
/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus) {
    
	var scrollbarWidth = function() {
        var scrollDiv = document.createElement("div"),
            scrollbarWidth;
        scrollDiv.className = "lightbox-scrollbar-measure";
        document.body.appendChild(scrollDiv);
        scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }();

	function hideTabIndex(index, element) {
		var $element = $(element);
		// Note that if tabindex is 'undefined', data-tabindex does not get set
		$element.attr('data-tabindex', $element.attr('tabindex'));
		$element.attr('tabindex', -1);
	}

	function restoreTabIndex(index, element) {
		var $element = $(element);
		if ($element.attr('data-tabindex')) {
			$element.attr('tabindex', $element.attr('data-tabindex'));
			$element.removeAttr('data-tabindex');
		} else {
			// if the element didn't have a data-tabindex, then it did not define a tabindex
			$element.removeAttr('tabindex');
		}
	}

    function Lightbox($element){
        this.$container = $element;
        this.$closeIcon = $element.find('.lightbox-close');
        this.bindEvents();
    }

	Lightbox.prototype = {
		bindEvents: function() {
            var lightboxId = this.$container.attr('id');

            this.$container.on("click", this.close.bind(this));
			this.$closeIcon.on("click", this.close.bind(this));

			// bind all lightbox open links
			$('[data-lightbox=#' + lightboxId + ']').on("click", this.open.bind(this));

			// prevent clicks on the lightbox from closing it
			this.$container.find('.lightbox-content').on("click", function(e) { return false; });
		},

		open: function(event, $target) {
			// event doesn't exist if called manually
			if (event) {
				event.preventDefault();
				this.$originator = $(event.target);
			}

			if ($target) {
				this.$originator = $target;
			}

			// hide the scrollbar on the body ('cos we don't want the user to scroll that any more) and replace the
			// space it took up with a (dynamically calculated) padding. If we don't, the grid resizes itself to take
			// up the newly available space and the page content jumps around.
			$('body').css( {
				'overflow':		'hidden',
				'padding-right': scrollbarWidth + 'px'
			});

			this.$container.addClass('lightbox-open');

			// if we were navigated by the keybaord, propogate that focus class to the lightbox
			if (this.$originator.hasClass(keyboardFocus.className)) {
                keyboardFocus.apply(this.$closeIcon[0]);
			}else{
                this.$closeIcon[0].focus();
            }

			// remove tabbing for all elements and re-enable for elements in the lightbox
			$('a, input, select, textarea, button, *[tabindex]').each(hideTabIndex);
			this.$container.find('*[tabindex]').each(restoreTabIndex);
		},

		close: function(event) {
			event.preventDefault();
            if (this.$container.hasClass('lightbox-closing')) { return ; }

            this.$container.addClass('lightbox-closing');

            // really really hode the lightbox once the 0.5 sec animation has finished
            var cont = this.$container;
            var orig = this.$originator;
            window.setTimeout(function() {
                cont.removeClass('lightbox-open');
                cont.removeClass('lightbox-closing');

                // move the focus back to the element that opened the lightbox
                // defend against not passing in the 'originator' in the show() method
                if (orig) {
                    orig.focus();
                }

                // remove our inline stying for the scrollbar fudge
                $('body').removeAttr('style');

                // restore all tabbing
                $('*[tabindex]').each(restoreTabIndex);
            }, 500);
		}
	};

	$.fn.lightbox = function() {
		return this.each(function() {
			var lightbox = new Lightbox($(this));
		});
	};

    return {
		show: function(lightbox, originator) {
			var lbox = new Lightbox($(lightbox));
			lbox.open.bind(lbox)(false, $(originator));
		}
	};

});

if (typeof window.define === "function" && window.define.amd) {
    define('modules/lightbox', ['utils/focus'], function(focus) {
        
        return toolkit.lightbox(jQuery, focus);
    });
} else {
    toolkit.lightbox = toolkit.lightbox(jQuery, toolkit.focus);
};
var demo = (function(logger, hash, lightbox) {
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

    function updateTestsResults($runTestLink, $mocha){
        var findFailure = $mocha.find('.failures em').text();

        if(findFailure === '0'){
            $runTestLink.append("<span class='colour result-summary'><i class='skycon-tick' aria-hidden='true'></i> Tests Passed</span>");
        } else {
            $runTestLink.append("<span class='colour error result-summary'><i class='skycon-warning' aria-hidden='true'></i> Tests Failed</span>");
        }
    }

    function hideLightbox(e,$box){
        e.preventDefault();
        var hide =  $(e.target).hasClass('lightbox-close') ||
            (!$(e.target).hasClass('lightbox-content') && !$(e.target).parents('.lightbox-content').length);
        if ( hide){
            $box.hide();
        }
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
        $('#' +  spec + '-lightbox').show();
        $close.add($(lightboxDiv)).on('click', function(e){
            hideLightbox(e, $('#' +  spec + '-lightbox'));
        });
    }

    function runTest(hash){
        var spec = hash.replace('test/','');
        var script = document.createElement('script');
        script.src = "/test/specs/" + spec + ".js";
        script.onload =  function(){
            var $runTestLink = $('a[href*="#' + hash + '"]'),
                $mocha = $('<div id="mocha" class="mocha-container"></div>');
            $runTestLink.parent().after($mocha);
            var grep = window[spec]();
            mocha.grep(grep);
            mocha.run(function(){
                updateTestsResults($runTestLink, $mocha);
                $mocha.attr('id','mocha-' + spec)
            });
            $runTestLink.removeAttr('href');
            $('html, body').animate({
                scrollTop: $mocha.parent().prev().offset().top
            }, 200);
            createLightbox($mocha, spec);
            $runTestLink.on('click', function(){
                $('#' +  spec + '-lightbox').show();
            })
        };
        document.head.appendChild(script);
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
        hash.register(hashes, runTest);
    }

    logger();
    bindEvents();
    sortSkyconsTable();
    registerTests();
});

if (typeof window.define === "function" && window.define.amd){
    define('demo', ['utils/developer-notes-logger',
                    'utils/hashManager',
                    'modules/lightbox'], function(developerNotesLogger, hash,lightbox) {
            return demo(developerNotesLogger, hash, lightbox);
 });
} else {
    demo(developerNotesLogger, toolkit.hashManager, toolkit.lightbox);
}
;