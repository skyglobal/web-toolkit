if (typeof toolkit === 'undefined') toolkit = {};
toolkit.video = (function (window, $, event) {
    'use strict';

    function Video($container, options) {
        if (!$container.attr('data-video-id')){ return; }
        var video = this;
        this.$container = $container;
        this.options = {
            token : options.token,
            freewheel : options.displayAdverts,
            autoplay : false,
            videoId : $container.attr('data-video-id')
        };
        this.toolkitOptions = {
            animationSpeed: (options.animationSpeed !== undefined ) ? options.animationSpeed : 500,
            onPlay: options.onPlay,
            closeCallback: options.closeCallback,
            $wrapperLocation: options.$wrapperLocation || this.$container
        };

        this.bindEvents();
    }

    Video.prototype = {
        bindEvents: function(){
            var video = this;
            video.$container.on('click','.play-video' ,function(e){
                video.createWrapper();
                video.play(e);
            });
        },
        bindWrapperEvents:function () {
            var video = this;
            $('body').one('keydown', video.stopOnEscape.bind(video));
            video.$wrapper.one('click touchstart', '.close', video.stop.bind(video));
            video.$player.one('ended webkitendfullscreen', video.stop.bind(video));

            if (video.options.freewheel) {
                video.$player.on('onSlotStarted', function () {
                    video.$player.off('ended webkitendfullscreen');
                    video.$player.one('onSlotEnded', function () {
                        video.$player.one('playing', function() {
                            video.$player.one('ended webkitendfullscreen', video.stop.bind(video));
                        });
                    });
                });
            }
        },
        createWrapper:function () {
            this.toolkitOptions.$wrapperLocation.append('<div class="video-wrapper">' +
                '<a href="#!" class="close"><i class="skycon-close" aria-hidden=true></i><span class="speak">Close</span></a>' +
                '<div class="videocontrolcontainer"><video></video><img class="posterFrame"/></div>' +
            '</div>');
            this.toolkitOptions.$wrapperLocation.find('.posterFrame').on('error', function () {
                this.src = options.placeHolderImage;
            });
            this.toolkitOptions.$wrapperLocation.append('<div class="video-overlay"></div>');
            this.$player = this.toolkitOptions.$wrapperLocation.parent().find('video');
            this.$wrapper = this.toolkitOptions.$wrapperLocation.find('.video-wrapper');
            this.$wrapper.attr('id', 'video-' + this.options.videoId);
            this.bindWrapperEvents();
        },
        removeWrapper: function(){
            this.$wrapper.removeClass('playing-video').remove();
            this.toolkitOptions.$wrapperLocation.find('.video-overlay').remove();
        },

        play:function(e) {
            if(e) { e.preventDefault(); }
            var video = this;
            if(video.toolkitOptions.onPlay) {
                video.toolkitOptions.onPlay();
            }
            this.showCanvas(function () {
            video.$player.sky_html5player(video.options); //todo: move to main video function
            setTimeout(function () {
                sky.html5player.play();
            }, 1333); //todo: call without setTimeout. S3 breaks as does flash ie8
//                todo: do both todo's when video team add flash queueing + fixed S3
            });
        },
        stopOnEscape: function(e){
            if (e.keyCode === 27) {
                e.preventDefault();
                this.stop();
            }
        },
        stop:function (e) {
            if(e) { e.preventDefault(); }
            var video = this;
            event.off(window, 'resizeend', video.resizeListener);
            sky.html5player.close(this.$wrapper);
            this.hideCanvas();
        },
        showCanvas:function (callback) {
            var height,
                $container = this.$container,
                $wrapperLocation = this.toolkitOptions.$wrapperLocation,
                $overlay = $wrapperLocation.find('.video-overlay'),
                $wrapper = $wrapperLocation.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $wrapper.find('.close'),
                animationSpeed = (this.toolkitOptions.animationSpeed === 0) ? 0 : this.toolkitOptions.animationSpeed || 500,
                video = this;
            this.originalHeight = $container.height();
            $wrapper.addClass('playing-video');
            $overlay.fadeIn(animationSpeed, function () {
                $play.fadeOut(animationSpeed);
                $close.addClass('active');
                height = video.calculateHeight();
                $container.animate({ height:height }, animationSpeed, function () {
                    video.resizeListener = video.resizeContainer.bind(video);
                    event.on(window, 'resizeend', video.resizeListener);
                    $wrapper.show();
                    $overlay.fadeOut(animationSpeed);
                    callback();
                });
            });
        },
        calculateHeight:function () {
            return Math.round((this.$container.width() / 16) * 9);
        },
        resizeContainer:function () {
            this.$container.animate({ height:this.calculateHeight() }, 250);
        },
        hideCanvas:function () {
            var video = this,
                $container = this.$container,
                $wrapperLocation = this.toolkitOptions.$wrapperLocation,
                $overlay = $wrapperLocation.find('.video-overlay'),
                $wrapper = $wrapperLocation.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $wrapper.find('.close'),
                animationSpeed = (this.toolkitOptions.animationSpeed === 0) ? 0 : this.toolkitOptions.animationSpeed || 500,
                originalHeight = this.originalHeight;

            $overlay.fadeIn(animationSpeed, function () {
                $close.removeClass('active');
                $container.animate({ height:originalHeight }, animationSpeed, function () {
                    $container.css({ height:'auto' });
                    if (video.toolkitOptions.closeCallback) {
                        video.toolkitOptions.closeCallback();
                    }
                    $play.fadeIn(animationSpeed);
                    $overlay.hide();
                    $wrapper.fadeOut(animationSpeed, video.removeWrapper.bind(video));
                });
            });
        }
    };
    $.fn.video = function(params) {
        return this.each(function() {
            var video = new Video($(this), params);
        });
    };
    return Video;
});

if (typeof window.define === "function" && window.define.amd) {
    define('components/video', ['bower_components/bskyb-event/dist/js/event.requirejs'], function (event) {
        return toolkit.video(window, jQuery, event);
    });
} else {
    toolkit.video =  toolkit.video(window, jQuery, skyComponents.event);
}
