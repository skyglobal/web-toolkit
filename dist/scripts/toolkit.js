
/**
 purpose:
 Needed for IE7
 **/
if (typeof toolkit==='undefined') toolkit={};
toolkit.skycons = (function() {
    var icons = {
        'skycon-sky' : "&#xf100;",
        'skycon-twitter-reply' : "&#xf101;",
        'skycon-chevron' : "&#xf102;",
        'skycon-facebook' : "&#xf103;",
        'skycon-remote-record' : "&#xf104;",
        'skycon-warning' : "&#xf105;",
        'skycon-carousel-play' : "&#xf106;",
        'skycon-user-profile' : "&#xf107;",
        'skycon-search' : "&#xf108;",
        'skycon-twitter-retweet' : "&#xf109;",
        'skycon-volume' : "&#xf10a;",
        'skycon-twitter-favourite' : "&#xf10b;",
        'skycon-expand' : "&#xf10c;",
        'skycon-carousel-pause' : "&#xf10d;",
        'skycon-share' : "&#xf10e;",
        'skycon-never-miss' : "&#xf10f;",
        'skycon-mail' : "&#xf110;",
        'skycon-sky-go' : "&#xf111;",
        'skycon-twitter-follow' : "&#xf112;",
        'skycon-minify' : "&#xf113;",
        'skycon-twitter' : "&#xf114;",
        'skycon-close' : "&#xf115;",
        'skycon-menu' : "&#xf116;",
        'skycon-google-plus' : "&#xf117;"
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
                    { id: 'play', label: 'Play Carousel' },
                    { id: 'pause', label: 'Pause Carousel' },
                    { id: 'previous', label: 'Previous' },
                    { id: 'next', label: 'Next' }
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
                var html = '', action, label, i, extraClass,
                    actions = options.actions,
                    onclick = options.onclick;
                if(options.count <= 1) return this;
                for (i in actions) {
                    extraClass = '';
                    action = actions[i].id;
                    label = actions[i].label;
                    if (action=='next' || action=='previous'){
                        extraClass=' hidden-touch ';
                    }
                    html += '<a href="#" class="skycom-internal ' + extraClass + action + '" >';
                    html += '<span class="icon-carousel-' + action + '"></span>' + label;
                    if (action == 'next' || action == 'previous') {
                        html += '<span class="icon-carousel-' + action + '-over over"></span>';
                    }
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
        'modules',
        'modules/tabs',
        'modules/share',
        'modules/carousel'], function(skycons, hashmanager, popup, modules, tabs, share, carousel){


        return {
            modules: modules,
            skycons: skycons,
            hashmanager: hashmanager,
            popup: popup,
            tabs: tabs,
            share: share,
            carousel: carousel
        };
    });
};
//# sourceMappingURL=toolkit.js.map