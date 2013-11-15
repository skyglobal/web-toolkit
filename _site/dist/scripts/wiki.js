
define('utils/developer-notes-logger', [],function() {

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
            init = $section.find('> .init').html();

        notes.each(function(){
            log($(this).html());
        });
        log(dependencies,'Dependencies');
        log(init,'Initialisation');
        logDemoCode($section);
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

    return logPage;
});
/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-chevron-down' : "&#xf101;",
        'skycon-sky-plus' : "&#xf102;",
        'skycon-tv' : "&#xf103;",
        'skycon-twitter-reply' : "&#xf104;",
        'skycon-arrow-down-left' : "&#xf105;",
        'skycon-chevron-up' : "&#xf106;",
        'skycon-chevron' : "&#xf107;",
        'skycon-facebook' : "&#xf108;",
        'skycon-tick' : "&#xf109;",
        'skycon-remote-record' : "&#xf10a;",
        'skycon-warning' : "&#xf10b;",
        'skycon-carousel-play' : "&#xf10c;",
        'skycon-arrow-left' : "&#xf10d;",
        'skycon-chevron-left' : "&#xf10e;",
        'skycon-on-demand' : "&#xf10f;",
        'skycon-user-profile' : "&#xf110;",
        'skycon-search' : "&#xf111;",
        'skycon-twitter-retweet' : "&#xf112;",
        'skycon-volume' : "&#xf113;",
        'skycon-twitter-favourite' : "&#xf114;",
        'skycon-expand' : "&#xf115;",
        'skycon-carousel-pause' : "&#xf116;",
        'skycon-mouse' : "&#xf117;",
        'skycon-share' : "&#xf118;",
        'skycon-never-miss' : "&#xf119;",
        'skycon-mail' : "&#xf11a;",
        'skycon-sky-go' : "&#xf11b;",
        'skycon-twitter-follow' : "&#xf11c;",
        'skycon-minify' : "&#xf11d;",
        'skycon-twitter' : "&#xf11e;",
        'skycon-close' : "&#xf11f;",
        'skycon-menu' : "&#xf120;",
        'skycon-phone' : "&#xf121;",
        'skycon-cloud' : "&#xf122;",
        'skycon-video-play' : "&#xf123;",
        'skycon-google-plus' : "&#xf124;"
    };


    function supportsPsuedo(){
        var doc = document,
            html = doc.documentElement,
            body = doc.body,
            supportsPseudo = false,
            paraBefore = doc.createElement('p'),
            styleBefore = doc.createElement('style'),
            heightBefore,
            selectorsBefore = '#testbefore:before { content: "before"; }';

        styleBefore.type = 'text\/css';
        paraBefore.id = 'testbefore';

        if (styleBefore.styleSheet) {
            styleBefore.styleSheet.cssText = selectorsBefore;
        } else {
            styleBefore.appendChild(doc.createTextNode(selectorsBefore));
        }

        body.appendChild(styleBefore);
        body.appendChild(paraBefore);

        heightBefore = doc.getElementById('testbefore').offsetHeight;
        
        if (heightBefore >= 1) {
            supportsPseudo = true;
        }
        
        body.removeChild(styleBefore);
        body.removeChild(paraBefore);
        return supportsPseudo;
    }

    function addSkycon(el, c){
        var html = el.innerHTML,
            entity = icons[c];
        el.innerHTML = '<span style="font-family: \'skycons\'" class="ie7-skycon">' + entity + '</span>' + html;
    }

    function init(){
        if (!supportsPsuedo()){
            var els = document.getElementsByTagName('*'),
                i, c, el;
            for (i = 0; ; i += 1) {
                el = els[i];
                if(!el) { break; }
                c = el.className;
                c = c.match(/skycon-[^\s'"]+/);
                if (c) { addSkycon(el, c[0]); }
            }
        }
    }

    return {
        add: addSkycon,
        init: init
    };
}());

if (typeof window.define === "function" && window.define.amd) {
    define('utils/skycons', [], function() {
        return toolkit.skycons;
    });
}
;
/**
 purpose:
 to let 'anchor' tags do their job and change the hash in the url for internal links.
 this will execute the associated callback with that hash.
 no onclick events needed.
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.hashmanager = (function() {

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

    function cleanHash(hash) {
        return hash.replace(/[#!]/g, '');
    }

    bindEvents();

    return {
        register: register,
        change: change,
        remove: remove,
        onHashChange: onHashChange,
        cleanHash: cleanHash
    };
}());

if (typeof window.define === "function" && window.define.amd) {
    define('utils/hashmanager', [], function() {
        return toolkit.hashmanager;
    });
};
if (typeof toolkit==='undefined') toolkit={};

toolkit.popup = (function() {

    function open(args) {
        var url = args.url;
        var width = args.width || 400;
        var height = args.height || width;
        var top = args.top || (screen.height/2)-(height/2);
        var left = args.left || (screen.width/2)-(width/2);
        var windowTitle = args.title || 'Sky';
        return window.open(url, windowTitle, 'top=' + top + ',left=' + left + ',width=' + width + ',height='+ height);
    }

    function init() {
        $('body').on('click', '[data-popup]', function(e) {
            e.preventDefault();
            var args = $.extend($(this).data('popup'), {url: $(this).attr('href')});
            open(args);
        });
    }

    return {
        init: init,
        open: open
    };
})();

if (typeof window.define === "function" && window.define.amd) {
    define('utils/popup', [], function() {
        return toolkit.popup;
    });
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.diff = (function(){

    function findFiles(opts){
        var oldRoute = opts.oldRoute,
            newRoute = opts.newRoute;
        clear();
        $('a[data-diff]').each(function(){
            getFile(oldRoute, newRoute, $(this).attr('data-diff'));
        });
    }

    function getFile(oldVersion, newVersion, file){
        var dfd_latest, dfd_old;
        var name = file.split('/')[file.split('/').length-1],
            newFile = newVersion + '/' + file + '.html',
            oldFile = oldVersion + '/' + file + '.html';

        dfd_latest = $.ajax({
            crossDomain: true,
            url:newFile,
            cache: false});

        dfd_old = $.ajax({
            crossDomain: true,
            url:oldFile,
            cache: false});

        $.when(dfd_latest,dfd_old).done(function(latest, old){
            var $container = $('<div class="togglee" data-toggle="' + name + '"><table id="' + name + '-table"></table></div>');

            $container.append( $('<textarea id="' + name + '" class="hidden latest"></textarea>').val(latest))
                .append($('<textarea id="old-' + name + '" class=hidden></textarea>').val(old));

            $('[data-diff-container]')
                .append('<h3 class="has-toggle wiki-h3 smaller" id="' + name + '-header"><span class="toggler" for="' + name + '"></span>' + name + '</h3>')
                .append($container);

            diff(name, old[0].split('\n'), latest[0].split('\n'));
        });
    }

    function getDiff(name, matrix, a1, a2, x, y){
        if(x>0 && y>0 && a1[y-1]===a2[x-1]){
            getDiff(name, matrix, a1, a2, x-1, y-1);
            addRow(name, x, y, ' ', a1[y-1]);
        } else {
            if(x>0 && (y===0 || matrix[y][x-1] >= matrix[y-1][x])){
                getDiff(name, matrix, a1, a2, x-1, y);
                addRow(name, x, '', '+', a2[x-1]);
            } else if(y>0 && (x===0 || matrix[y][x-1] < matrix[y-1][x])){
                getDiff(name, matrix, a1, a2, x, y-1);
                addRow(name, '', y, '-', a1[y-1], '');
            } else {
                return;
            }
        }
    }


    function diff(name, a1, a2){
        var matrix = new Array(a1.length+1);
        var x,y;

        for( y=0; y<matrix.length; y++){
            matrix[y] = new Array(a2.length+1);
            for( x=0; x<matrix[y].length; x++){
                matrix[y][x] = 0;
            }
        }

        for( y=1; y<matrix.length; y++){
            for( x=1; x<matrix[y].length; x++){
                if(a1[y-1]===a2[x-1]){
                    matrix[y][x] = 1 + matrix[y-1][x-1];
                } else {
                    matrix[y][x] = Math.max(matrix[y-1][x], matrix[y][x-1]);
                }
            }
        }

        try {
            getDiff(name, matrix, a1, a2, x-1, y-1);
        } catch(e){
            alert(e);
        }
    }

    function addRow(name, x, y, type, rij){
        var tableBody = document.getElementById(name + '-table'),
            header = document.getElementById(name + '-header'),
            tr = document.createElement('tr'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td'),
            txt1 = document.createTextNode(y),
            txt2 = document.createTextNode(x),
            txt3 = document.createTextNode(type + ' ' + rij);

        if(type==='+'){
            tr.className='add';
            $(header).addClass('add');
        } else if(type==='-'){
            tr.className='del';
            $(header).addClass('del');
        }

        td1.className = 'codekolom';
        td2.className = 'codekolom';
        td3.className = 'bredecode';
        td1.appendChild(txt1);
        td2.appendChild(txt2);
        td3.appendChild(txt3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tableBody.appendChild(tr);
    }

    function clear(name){
        $('.sky-form .error').text('');
        $('.togglee').remove();
        $('.has-toggle').remove();
    }

    return findFiles;

}());

if (typeof window.define === "function" && window.define.amd) {
    define('utils/diff', [],function() {
        return toolkit.diff;
    });
};
/**
 purpose:
 to automatically hook into the bootstrap html and shows/hides tabs.
 Works based registering the tabs 'hash' with the changeTab function.
 no onclick events needed.
**/
if (typeof toolkit==='undefined') toolkit={};
toolkit.tabs = (function(hash) {

    var $el = {
        tabContainer: $('section[data-function=tabs]'),
        tabs: $('section[data-function=tabs] li[role=tab]'),
        tabTargets: $('section[data-function=tabs] div[role=tabpanel]')
    };
    var vars = {
        rememberState : $el.tabContainer.attr('data-remember-state')==='true'
    };

    function bindEvents() {
        if (vars.rememberState){
            hash.register(getHashList(), changeTab);
        } else {
            $el.tabs.on('click', function(e){
                e.preventDefault();
                changeTab($(this).find('a').attr('href'));
            });
        }
    }

    function getHashList() {
        var arrHash = [];
        $el.tabs.each(function(){
            arrHash.push($(this).attr('aria-controls'));
        });
        return arrHash;
    }

    function changeTab(controlId){
        $el.tabTargets.add($el.tabs).removeClass("selected");
        $('#' + controlId + '-tab').add($("#" + controlId))
            .addClass('selected');
    }

    bindEvents();

    return {
        getHashList: getHashList,
        changeTab: changeTab
    };

}(toolkit.hashmanager));


if (typeof window.define === "function" && window.define.amd) {
    define('modules/tabs', ['utils/hashmanager'], function() {
        return toolkit.tabs;
    });
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.share = (function() {

    var $el = {
        document: $(document),
        shareCount: $('.share-popup .summary')
    };

    function bindEvents() {
        $el.shareCount.on('click keypress', toggleSharePopover);
    }

    function toggleSharePopover(e) {
        e.preventDefault();
        var $section = $(this).parent(),
            triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
        if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
            $section.toggleClass('active');
            $el.document.on(triggerEvents, function hidePopover(e) {
                if(!$.contains($section[0], e.target)) {
                    $section.removeClass('active');
                    $el.document.off(triggerEvents, hidePopover);
                }
            });
        }
    }

    function init() {
        bindEvents();
    }

    return {
        init: init,
        toggleSharePopover: toggleSharePopover
    };
}());

if (typeof window.define === "function" && window.define.amd) {
    define('modules/share', [], function() {
        return toolkit.share;
    });
}
;
if (typeof toolkit==='undefined') toolkit={};
toolkit.carousel = (function(window, $) {
    

    // get CSS3 capabilities
    var has3d = (function() {
        return ('WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix());
    }());
    var hasTransform = (function() {
        var s = document.body.style;
        return s.transform !== undefined || s.WebkitTransform !== undefined || s.MozTransform !== undefined || s.OTransform !== undefined;
    }());

    function Carousel(element, options) {
        this.options = options;
        this.$viewport = element;
        this.$slideContainer = element.find('.skycom-carousel-container');
        this.$slides = this.$slideContainer.find('>');
        this.currentIndex = 0;
        this.slideCount = this.$slides.length;
        this.timerId = false;
        this.touchReset();
        this.bindEvents();
    }

    Carousel.prototype = {
        unbindTouchEvents: function() {
            this.$slideContainer.off('touchstart touchmove touchend touchcancel');
        },
        bindTouchEvents: function() {
            this.$slideContainer
                .on('touchstart', this.touchstart.bind(this))
                .on('touchmove', this.touchmove.bind(this))
                .on('touchend', this.touchend.bind(this))
                .on('touchcancel', this.touchReset.bind(this));
        },
        bindEvents: function() {
            this.bindTouchEvents();
            this.$slideContainer.find('a').on('click', this.pause.bind(this));
        },
        unbindEvents: function() {
            this.unbindTouchEvents();
            this.$slideContainer.find('a').off('click');
        },
        setOffset: function(percent, animate) {
            var $container = this.$slideContainer.removeClass("animate");
            if (animate) $container.addClass("animate");
            if (has3d) {
                $container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
            } else if (hasTransform) {
                $container.css("transform", "translate("+ percent +"%,0)");
            } else if (animate) {
                $container.animate({'left': (percent*2) + '%'}, 600);
            } else {
                $container.css({'left': (percent*2) + '%'});
            }
            return this;
        },
        toggleTermsContent: function(){
            this.pause();
            var termsHidden = this.$viewport.next('.terms-content').find('.terms').length===0;
            this[termsHidden ? 'showTermsContent' : 'hideTermsContent']();
        },
        showTermsContent: function(){
            this.hideTermsContent();
            var $terms = $(this.$slides[this.currentIndex]).find('.terms');
            if ($terms.length){
                this.$viewport.next('.terms-content').append($terms.clone(true).removeClass('speak').attr('aria-hidden','true')).fadeIn(200);
            }
        },
        hideTermsContent: function(){
            this.$viewport.next('.terms-content').fadeOut(200, function() {
                $(this).find('.terms').remove();
            });
        },
        showTermsLink: function(slideIndex){
            this.hideTermsLink();
            var $terms = $(this.$slides[slideIndex]).find('.terms');
            if ($terms.length){
                this.$viewport.find('.terms-link').removeClass('hidden').fadeIn(200);
            }
        },
        hideTermsLink: function(){
            this.$viewport.find('.terms-link').fadeOut(200);
            this.hideTermsContent();
        },
        moveSlide : function(opts){//index, start, end, callback, reverse
            var self = this,
                $slides = this.$slides,
                cssFloat, indexToShow;

            indexToShow = (opts.index >= this.slideCount)?0:(opts.index < 0) ? this.slideCount - 1 : opts.index;
            cssFloat = (opts.index>this.currentIndex && !opts.reverse) ? 'left' : 'right';

            $slides.filter(':not(:eq(' + this.currentIndex + '))').hide();
            $slides.eq(this.currentIndex).css('float', cssFloat);
            $slides.eq(indexToShow).show().css('float', cssFloat == 'left' ? 'right' : 'left');

            this.setOffset(opts.start, false);
            if (typeof opts.end !== 'undefined'){
                setTimeout(function(){
                    self.setOffset(opts.end, true);
                    self.showTermsLink(indexToShow);
                    self.$viewport.trigger('change', indexToShow);
                }, 20);
                this.currentIndex = indexToShow;
                if (typeof opts.callback == 'function') opts.callback(indexToShow);
            }
            return indexToShow;
        },
        goto: function(slideIndex, pause, callback) {
            if (pause !== false) this.pause();
            if (slideIndex===this.currentIndex) { return; }

            if ((slideIndex>this.currentIndex)) {
                this.moveSlide({index: slideIndex, start:0, end:-50, callback:callback});
            } else{
                this.moveSlide({index: slideIndex, start:-50, end: 0, callback:callback});
            }
            return this;
        },
        next: function(pause, callback) {
            this.goto(this.currentIndex + 1, pause, callback);
            this.$viewport.find('.indicators, .actions').css('display', 'block');
            return this;
        },
        previous: function() {
            this.goto(this.currentIndex - 1);
            this.$viewport.find('.indicators, .actions').css('display', 'block');
            return this;
        },
        play: function(callback, delay) {
            var self = this,
                interval = this.options.interval;

            self.timerId = setTimeout(function() { //timeout for small delay after pressing pay button
                self.next(false);
                self.timerId = setTimeout(function loop() {  //timeout interval between slides
                    self.next(false, function() {
                        self.timerId = setTimeout(loop, interval);
                    });
                }, interval);
            }, delay || this.options.onPlayDelay);

            this.$viewport.trigger('playing');
            if (typeof callback == 'function') callback();
            return this;
        },
        pause: function(callback) {
            clearTimeout(this.timerId);

            this.$viewport.trigger('paused');
            if (typeof callback == 'function') callback();
            return this;
        },
        touchstart: function(e) {
            var touch = e.originalEvent.touches[0];
            this.pause();
            this.swipe.start = {x: touch.pageX, y:touch.pageY};
        },
        touchmove: function(e) {
            var swipe = this.swipe,
                touch = e.originalEvent.touches[0],
                xDifference = touch.pageX - swipe.start.x,
                yDifference = touch.pageY - swipe.start.y,
                scrollingCarousel = Math.abs(xDifference) > Math.abs(yDifference),
                slideIndex = xDifference<0?this.currentIndex+1:this.currentIndex- 1,
                positionAsPercentage;

            if (!swipe.start || scrollingCarousel===false) return;
            e.preventDefault();

            positionAsPercentage = (xDifference / this.$slideContainer.outerWidth(true)) * 100;
            if (xDifference>0) positionAsPercentage -=50;
            this.swipe.positionAsPercentage = positionAsPercentage;

            this.moveSlide({index:slideIndex,start:positionAsPercentage});
        },
        touchend: function(e) {
            if (!this.swipe.start) return;
            var swipe = this.swipe,
                position = swipe.positionAsPercentage,
                touch = e.originalEvent.changedTouches[0],
                xDifference = touch.pageX - swipe.start.x,
                direction = null,
                threshold = 75;
            if (Math.abs(xDifference) > threshold) {
                direction = (xDifference < 0) ? 'left' : 'right';
            }

            if (direction === 'left') {
                this.moveSlide({
                    index: this.currentIndex + 1,
                    start: position,
                    end: -50
                });
                this.$viewport.find('.next').trigger('toolkit.track');

            } else if (direction === 'right') {
                this.moveSlide({
                    index: this.currentIndex - 1,
                    start: position,
                    end:0
                });
                this.$viewport.find('.previous').trigger('toolkit.track');

            } else if (position !== 0) {
                var start = (xDifference > 0) ? position + 50 : position,
                    index = this.currentIndex,
                    end = 0,
                    reverse;
                if (start < 0){
                    this.currentIndex = (index+1>=this.slideCount) ? 0 : index+1;
                } else {
                    this.currentIndex -= 1;
                    end = -50;
                    start -= 50;
                }
                reverse = this.currentIndex===0 && index === this.slideCount-1;
                this.moveSlide({
                    index: index,
                    start: start,
                    end: end,
                    reverse: reverse
                });
            }
            this.touchReset();
        },
        touchReset: function() {
            this.swipe = {
                start: false,
                positionAsPercentage: 0
            };
        }
    };

    function Video(carousel, options) {
        this.carousel = carousel;
        this.wrapper = carousel.$viewport.find('.video-wrapper');
        this.wrapper.attr('id', 'video-' + options.videoId);
        this.videocontrolcontainer = carousel.$viewport.find('.videocontrolcontainer');
        this.player = carousel.$viewport.find('video');
        this.videocontrolcontainer.find('img').on('error', function() {
            this.src = options.placeHolderImage;
        });
        this.options = options;
        this.bindEvents();
    }

    Video.prototype = {
        bindEvents: function(){
            var $self = this,
                hijackLink = function(e) {
                    e.preventDefault();
                },
                stop = function(e){
                    $self.stop();
                    $wrapper.off('click', hijackLink);
                    return false;
                },
                $wrapper = this.wrapper;
            $wrapper.on('click', hijackLink).find('.close').one('click touchstart', stop);
            this.player.on('ended webkitendfullscreen', stop);
        },
        play: function() {
            var $self = this,
                carouselControls = this.carousel.$viewport.find('.actions, .indicators');
            this.originalHtml = this.videocontrolcontainer.html();
            this.carousel.pause();
            this.showCanvas(function() {
                carouselControls.hide();
                $self.carousel.unbindTouchEvents();
                $self.player.sky_html5player($self.options); //todo: move to main video function
                setTimeout(function(){sky.html5player.play();},1333); //todo: call without setTimeout. S3 breaks as does flash ie8
//                todo: do both todo's when video team add flash queueing + fixed S3
            });
        },
        stop: function() {
            var $self = this,
                carouselControls = this.carousel.$viewport.find('.actions, .indicators');
            $(window).off('skycom.resizeend', $self.resizeCarousel);
            sky.html5player.close(this.wrapper);
            $self.videocontrolcontainer.html($self.originalHtml); //todo: remove once video team fix 'ie 8 repeat play' bug
            this.hideCanvas( function(){
                $self.carousel.bindTouchEvents();
                carouselControls.show();
            });
        },
        showCanvas: function(callback) {
            var height,
                $carousel = this.carousel.$viewport,
                $overlay = $carousel.find('.video-overlay'),
                $wrapper = $carousel.find('.video-wrapper'),
                $play = $carousel.find('.play-video'),
                $close = $carousel.find('.video-wrapper .close'),
                speed= 500,
                $self = this;

            this.originalHeight = $carousel.height();
            $wrapper.addClass('playing-video');
            $overlay.fadeIn(function() {
                $play.fadeOut();
                height = $self.calculateHeightForVideo();
                $carousel.animate({ height: height }, speed, function() {
                    $(window).on('skycom.resizeend', $.proxy($self.resizeCarousel, $self));
                    $wrapper.show();
                    $overlay.fadeOut(speed, function() {
                        $close.addClass('active');
                    });
                    callback();
                });
            });
        },
        calculateHeightForVideo: function() {
            return Math.round((this.carousel.$viewport.width() / 16) * 9);
        },
        resizeCarousel: function() {
            this.carousel.$viewport.animate({ height: this.calculateHeightForVideo() }, 250);
        },
        hideCanvas: function(callback) {
            var $carousel = this.carousel.$viewport,
                $overlay = $carousel.find('.video-overlay'),
                $wrapper = $carousel.find('.video-wrapper'),
                $play = $carousel.find('.play-video'),
                $close = $carousel.find('.video-wrapper .close'),
                speed = 500,
                originalHeight = this.originalHeight;
            $overlay.fadeIn(speed, function() {
                $close.removeClass('active');
                $carousel.animate({ height: originalHeight }, speed, function(){
                    $carousel.css({ height: 'auto' });
                    callback();
                    $play.fadeIn();
                    $overlay.hide();
                    $wrapper.fadeOut();
                    $wrapper.removeClass('playing-video');
                });
            });
        }
    };

    // jquerify
    $.fn.skycom_carousel = function(params) {
        var options = $.extend(true, {
            carousel: {
                actions: [
                    { id: 'play', label: 'Play Carousel', icon: 'carousel-play' },
                    { id: 'pause', label: 'Pause Carousel', icon: 'carousel-pause' },
                    { id: 'previous', label: 'Previous', icon: 'chevron-left',speak:true },
                    { id: 'next', label: 'Next', icon: 'chevron',speak:true }
                ],
                autoplay: true,
                startSlideIndex: 0,
                onPlayDelay: 500,
                interval: 6000
            },
            video: {
                token:"8D5B12D4-E1E6-48E8-AF24-F7B13050EE85",
                autoplay: false,
                videoId: null,
                freewheel: false, //disable ads
                placeHolderImage: '//static.video.sky.com/posterframes/skychasky.jpg'
            }
        }, params);

        // generating default markup
        var markup = {
            actions: function($element, options){
                var html = '', id, label, i, extraClass, icon, action,circle,
                    actions = options.actions,
                    onclick = options.onclick;
                if(options.count <= 1) return this;
                for (i in actions) {
                    action = actions[i];
                    id = action.id;
                    extraClass = (id=='next' || id=='previous') ? ' hidden-touch ' : '';
                    icon = 'skycon-' + action.icon;
                    label = (action.speak) ? '<span class="speak">' + action.label + '</span>' : action.label;
                    html += '<a href="#" class="skycom-internal supportive ' + extraClass + id + '" >';
                    html += '<span class="semi-circle"><i class="' + icon + '" aria-hidden="true"></i></span>' + label;
                    html += '</a>';
                }
                $element.find('.skycom-carousel-container').before('<div class="actions">' + html + '</div>');
                $element.find('> .actions > *').each(function(index) {
                    $(this).attr('data-action', actions[index].id).on('click', function(e) {
                        onclick(actions[index].id);
                        e.preventDefault();
                    });
                });
                return this;
            },
            indicators: function($element, options) {

                var $indicators, i,
                    count = options.count,
                    onclick = options.onclick,
                    html = '<div class="indicators"><div class="container">',
                    className = ' class="active"';
                if (count <= 1) return this;
                for (i = count; i--;) {
                    html += '<span' + className + ' data-tracking data-tracking-label="indicator"></span>';
                    className = '';
                }
                $indicators = $(html + '</div></div>').on('click', 'span', function(e) {
                    onclick($(e.currentTarget).index());
                });
                $element.append($indicators);
                return this;
            },
            terms: function($element) {
                var $termsLink = $('<a href="#!" class="terms-link carousel-content cushioned hidden black internal-link supportive" aria-hidden="true">Terms and Conditions</a>');
                var $termsContent = $('<div class="terms-content carousel-content  cushioned hidden"></div>');
                if ($element.find('.terms').length){
                    $element.append($termsLink);
                    $element.after($termsContent);
                    $element.addClass('has-terms');
                }
                return this;
            },
            video: function($element) {
                $element.append('<div class="video-overlay"></div>');
                return this;
            }
        };

        return this.each(function() {
            var $this = $(this);
            var carousel = new Carousel($this, options.carousel);
            var createMarkup = function(carousel) {
                markup.indicators($this, {
                    count: carousel.slideCount,
                    onclick: function(index) {
                        carousel.goto(index);
                    }
                })
                .terms($this)
                .actions($this, {
                    count: carousel.slideCount,
                    actions: options.carousel.actions,
                    onclick: function(action) {
                        carousel[action]();
                    }
                })
                .video($this);
            };

            createMarkup(carousel);

            $this.on('click', '.play-video', function(e) {
                e.preventDefault();
                options.video.videoId = $(this).attr('data-video-id');
                if (options.carousel.videoAds){
                    options.video.freewheel = true;
                }
                var video = new Video(carousel, options.video);
                video.play();

            }).on('click', '.terms-link', function(e) {
                carousel.toggleTermsContent();
            }).on('change',function(e, index) {
                index = index || 0;
                $this.find('.indicators .container > *').removeClass('active').eq(index).addClass('active');
                carousel.$slides.removeClass('active').find('a').attr('tabindex',-1);
                carousel.$slides.eq(index).addClass('active').find('a').removeAttr('tabindex');
            }).on('playing',function() {
                $this.removeClass('paused').addClass('playing');
            }).on('paused',function() {
                $this.removeClass('playing').addClass('paused');
            }).on('pause',function() {
                carousel.pause();
            }).on('play',function() {
                carousel.play();
            }).on('refresh',function(e, index) {
                carousel.$slides = carousel.$slideContainer.find('>');
                carousel.slideCount = carousel.$slides.length;
                $this.find('.indicators').remove();
                $this.find('.actions').remove();
                $this.find('.video-overlay').remove();

                createMarkup(carousel);

                index = parseInt(index, 10);
                if (isNaN(index) || index < 0) {
                    index = 0;
                } else if (index > (carousel.slideCount - 1)){
                    index = carousel.slideCount - 1;
                }
                if (index > carousel.currentIndex) {
                    carousel.moveSlide({index: index, start:0, end:-50});
                } else {
                    carousel.moveSlide({index: index, start:-50, end: 0});
                }
            }).on('keyup',function(e){
                switch(e.keyCode){
                    case 9: carousel.pause(); break; //tab
                    case 37: carousel.previous(); break; //left arrow
                    case 39: carousel.next(); break; //right arrow
                }
            }).find('.toggle-terms').on('click', function(e) {
                carousel.$viewport.toggleClass('showing-tandcs');
            });
            if(carousel.slideCount > 1) {
                carousel[options.carousel.autoplay === true ? 'play' : 'pause'](false, options.carousel.interval);
                carousel.goto(options.carousel.startSlideIndex, false);
                carousel.showTermsLink(0);
                $this.trigger('change');
            } else {
                carousel.unbindTouchEvents();
            }
        });
    };
}(window, jQuery));

if (typeof window.define === "function" && window.define.amd) {
    define('modules/carousel', [], function() {
        return toolkit.carousel;
    });
};
if (typeof toolkit==='undefined') toolkit={};
toolkit.main = (function() {

    function bindEvents() {
        var addWindowLoadClass = function() { $(document.body).addClass('window-loaded');},
            windowLoadTimeout = setTimeout(addWindowLoadClass, 5000);

        $(window).load(function() {
            clearTimeout(windowLoadTimeout);
            addWindowLoadClass();
        });
    }

    bindEvents();

}());

toolkit.modules = (function(){

    var init =function(options) {
        var module;
        var modulesToInitialize = $.extend({
            skycons : false,
            share : false,
            popup : false
        }, options);
        for (module in modulesToInitialize) {
            if ((modulesToInitialize[module] || !options ) && toolkit[module] && toolkit[module].init) {
                toolkit[module].init();
            }
        }
    };

    return {
        init: init
    };
})();

if (typeof window.define === "function" && window.define.amd) {
    define('modules', [], function() {
        return toolkit.modules;
    });
}

if (typeof window.define === "function" && window.define.amd) {
//    explicitly call all js files here to ensure all files are available
    define('toolkit',[
        'utils/skycons',
        'utils/hashmanager',
        'utils/popup',
        'utils/diff',
        'modules',
        'modules/tabs',
        'modules/share',
        'modules/carousel'], function(skycons, hashmanager, popup, diff, modules, tabs, share, carousel){


        return {
            modules: modules,
            skycons: skycons,
            hashmanager: hashmanager,
            popup: popup,
            diff: diff,
            tabs: tabs,
            share: share,
            carousel: carousel
        };
    });
};
define('wiki', ['utils/developer-notes-logger', 'toolkit'], function(logger, toolkit) {

    function bindEvents(){
        $(document).on('click','.toggler', toggle);
        $('#check').on('click', checkDiff);
    }

    function checkDiff(e){
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
        toolkit.diff({
            oldRoute: route + '/' + oldVersion + '/_site/_includes/',
            newRoute: route + '/' + newVersion + '/_site/_includes/'
        });
    }

    function initModuleDemos(){
        $('#hero').skycom_carousel({
            carousel: {
                autoplay: true,
                videoAds: false
            }
        });
        $('#hero-16-9').skycom_carousel({
            carousel: {
                autoplay: true,
                videoAds: false
            }
        });
        toolkit.modules.init();
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
    initModuleDemos();
    bindEvents();

});