/*global toolit define*/
if (typeof toolkit==='undefined') { toolkit={}; }
toolkit.carousel = (function(video, detect) {
    'use strict';

    var has3d = detect.css('support3D');
    var hasTransform = detect.css('transform');
    var hasTransition = detect.css('transition');

    function Carousel(element, options) {
        this.options = options;
        this.$viewport = element;
        this.$slideContainer = element.find('.skycom-carousel-container');
        this.$slides = this.$slideContainer.find('.slide');
        this.currentIndex = 0;
        this.slideCount = this.$slides.length;
        this.timerId = false;
        this.touchReset();
        this.bindEvents();
        if (!this.options.video) {
            this.options.video = { displayAdverts: false };
        }
        this.initialiseVideos(this.options.video);
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
            this.$slideContainer.on('click','a', this.pause.bind(this));

            this.$slideContainer.on('click', 'figure', function (e) {
                if (e.target.parentNode.className.indexOf('play-video') >= 0 || e.target.className.indexOf('play-video') >= 0) {
                    return;
                }
                document.location = $(this).closest('.slide').find('figcaption a').attr('href');
            });

            this.$slideContainer.on('mouseenter mouseleave', '.slide', function (e) {
                $(this).find('figcaption a').toggleClass('hover', e.type === 'mouseenter');
            });
        },
        unbindEvents: function() {
            this.unbindTouchEvents();
            this.$slideContainer.off('click','a');
            this.$slideContainer.off('click', 'figure');
        },
        setOffset: function(percent, animate) {
            var $container = this.$slideContainer.removeClass("animate");
            if (animate) { $container.addClass("animate"); }
            if (has3d) {
                $container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
            } else if (hasTransform && hasTransition) {
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
            this.$viewport.next('.terms-content').find('.terms').remove();
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
        initialiseVideos: function(options) {
            var carousel = this;
            this.$slides.video({
                $wrapperLocation: carousel.$viewport,
                token: options.token || "8D5B12D4-E1E6-48E8-AF24-F7B13050EE85",
                displayAdverts: options.displayAdverts,
                onPlay: function() {
                    carousel.pause();
                    carousel.$viewport.find('.actions, .indicators, .terms-link').fadeOut(500);
                },
                closeCallback: function() {
                    carousel.$viewport.find('.actions, .indicators, .terms-link').fadeIn(500);
                }
            });

        },
        moveSlide : function(opts){//index, start, end, callback, reverse
            var self = this,
                $slides = this.$slides,
                cssFloat, indexToShow;

            indexToShow = (opts.index >= this.slideCount)?0:(opts.index < 0) ? this.slideCount - 1 : opts.index;
            cssFloat = (opts.index>this.currentIndex && !opts.reverse) ? 'left' : 'right';

            $slides.filter(':not(:eq(' + this.currentIndex + '))').hide();
            $slides.eq(this.currentIndex).css('float', cssFloat);
            $slides.eq(indexToShow).show().css('float', cssFloat === 'left' ? 'right' : 'left');

            this.setOffset(opts.start, false);
            if (typeof opts.end !== 'undefined'){
                setTimeout(function(){
                    self.setOffset(opts.end, true);
                    self.showTermsLink(indexToShow);
                    self.$viewport.trigger('change', indexToShow);
                }, 20);
                this.currentIndex = indexToShow;
                if (typeof opts.callback === 'function') { opts.callback(indexToShow); }
            }
            return indexToShow;
        },
        goto: function(slideIndex, pause, callback) {
            if (pause !== false)  this.pause();

            if (slideIndex > this.currentIndex) {
                this.moveSlide({
                    index: slideIndex,
                    start: 0,
                    end: -50,
                    callback: callback
                });
            } else if (slideIndex < this.currentIndex) {
                this.moveSlide({
                    index: slideIndex,
                    start: -50,
                    end: 0,
                    callback: callback
                });
            } else {
                this.moveSlide({
                    index: slideIndex,
                    start: 0,
                    end: 0,
                    callback: callback
                });
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
            if (typeof callback === 'function') { callback(); }
            return this;
        },
        pause: function(callback) {
            clearTimeout(this.timerId);

            this.$viewport.trigger('paused');
            if (typeof callback === 'function') { callback(); }
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

            if (!swipe.start || scrollingCarousel===false) { return; }
            e.preventDefault();

            positionAsPercentage = (xDifference / this.$slideContainer.outerWidth(true)) * 100;
            if (xDifference>0) { positionAsPercentage -=50; }
            this.swipe.positionAsPercentage = positionAsPercentage;

            this.moveSlide({index:slideIndex,start:positionAsPercentage});
        },
        touchend: function(e) {
            if (!this.swipe.start) { return; }
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

    // jquerify
    $.fn.skycom_carousel = function(params) {
        var options = $.extend(true, {
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
        }, params);

        // generating default markup
        var markup = {
            actions: function($element, options){
                var html = '', id, label, i, extraClass, icon, action,
                    actions = options.actions,
                    onclick = options.onclick;
                if(options.count <= 1) { return this; }

                for (i=0;i<actions.length;i++) {
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
//                if (count <= 1) return this;
                if (count>1){
                    for (i = count; i--;) {
                        html += '<span' + className + ' data-tracking data-tracking-label="indicator"></span>';
                        className = '';
                    }
                }
                $indicators = $(html + '</div></div>').on('click', 'span', function(e) {
                    onclick($(e.currentTarget).index());
                });
                $element.append($indicators);
                return this;
            },
            terms: function($element) {
                var $termsLink = $('<a href="#!" class="terms-link carousel-content cushioned hidden black internal-link supportive" aria-hidden="true">Terms and Conditions</a>');
                var $termsContent = $('<div class="terms-content carousel-content cushioned"></div>').hide();
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
            var carousel = new Carousel($this, options);
            var createMarkup = function(carousel) {
                markup.indicators($this, {
                    count: carousel.slideCount,
                    onclick: function(index) {
                        if (index !== carousel.currentIndex) {
                            carousel.goto(index, true);
                        } else {
                            carousel.pause();
                        }
                    }
                })
                .terms($this)
                .actions($this, {
                    count: carousel.slideCount,
                    actions: options.actions,
                    onclick: function(action) {
                        carousel[action]();
                    }
                });
            };

            createMarkup(carousel);

            $this.on('click', '.terms-link', function() {
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
            }).on('goto',function(e, slideIndex) {
                carousel.goto(slideIndex, true);
            }).on('refresh',function(e, slideIndex) {
                carousel.$slideContainer = carousel.$viewport.find('.skycom-carousel-container');
                carousel.$slides = carousel.$slideContainer.find('>');
                carousel.slideCount = carousel.$slides.length;
                $this.find('.indicators').remove();
                $this.find('.actions').remove();
                $this.find('.video-overlay').remove();
                slideIndex = parseInt(slideIndex, 10);
                slideIndex = (isNaN(slideIndex) || slideIndex < 0) ? 0 : slideIndex;
                slideIndex = (slideIndex > (carousel.slideCount - 1)) ?  carousel.slideCount - 1 : slideIndex;
                carousel.goto(slideIndex, true);
                carousel.unbindEvents();
                carousel.bindEvents();
                createMarkup(carousel);
                carousel[options.autoplay === true ? 'play' : 'pause'](false, options.interval);
            }).on('keyup',function(e){
                switch(e.keyCode){
                    case 9: carousel.pause(); break; //tab
                    case 37: carousel.previous(); break; //left arrow
                    case 39: carousel.next(); break; //right arrow
                }
            }).find('.toggle-terms').on('click', function() {
                carousel.$viewport.toggleClass('showing-tandcs');
            });
            if(carousel.slideCount > 1) {
                carousel[options.autoplay === true ? 'play' : 'pause'](false, options.interval);
                carousel.goto(options.startSlideIndex, false);
                carousel.showTermsLink(0);
                $this.trigger('change');
            } else {
                carousel.showTermsLink(0);
                carousel.unbindTouchEvents();
            }
        });
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/carousel', ['components/video', 'utils/detect'], function(video, detect) {
        return toolkit.carousel(video, detect);
    });
} else {
    toolkit.carousel = toolkit.carousel(toolkit.video, toolkit.detect);
}
