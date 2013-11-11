if (typeof toolkit === 'undefined') toolkit = {};
toolkit.video = (function (window, $) {
    'use strict';

    var $el = {
        playingVideo: $('.media')
    };

    function Video(container, options) {
        this.container = container;
        this.wrapper = container.find('.video-wrapper');
        this.wrapper.attr('id', 'video-' + options.videoId);
        this.videocontrolcontainer = container.find('.videocontrolcontainer');
        this.player = container.find('video');
        this.videocontrolcontainer.find('img').on('error', function () {
            this.src = options.placeHolderImage;
        });
        this.options = options;
        this.bindEvents();
        //todo: remove once S3 autoplay bug is fixed.
        if (options.autoplay) {
            this.options.autoplay = false;
            this.play();
        }
    }

    Video.prototype = {
        bindEvents:function () {
            var $self = this,
                hijackLink = function (e) {
                    e.preventDefault();
                },
                stop = function (e) {
                    $self.stop();
                    $wrapper.off('click', hijackLink);
                    return false;
                },
                $wrapper = this.wrapper;
            $wrapper.on('keydown', function(e) {
                if(e.keyCode === 17) {
                    e.preventDefault();
                    stop();
                }
            });
            $wrapper.on('click', hijackLink).find('.close').one('click touchstart', stop);
            this.player.on('ended webkitendfullscreen', stop);
        },
        play:function () {
            var $self = this;
            this.showCanvas(function () {
                $self.player.sky_html5player($self.options); //todo: move to main video function
                setTimeout(function () {
                    sky.html5player.play();
                }, 1333); //todo: call without setTimeout. S3 breaks as does flash ie8
//                todo: do both todo's when video team add flash queueing + fixed S3
            });
        },
        stop:function () {
            var $self = this;
            $(window).off('skycom.resizeend', $self.resizeContainer);
            sky.html5player.close(this.wrapper);
            this.hideCanvas();
        },
        showCanvas:function (callback) {
            var height,
                $container = this.container,
                $overlay = $container.find('.video-overlay'),
                $wrapper = $container.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $container.find('.video-wrapper .close'),
                animationSpeed = (this.options.animationSpeed === 0) ? 0 : this.options.animationSpeed || 500,
                $self = this;
            this.originalHeight = $container.height();
            $wrapper.addClass('playing-video');
            $overlay.fadeIn(animationSpeed, function () {
                $play.fadeOut(animationSpeed);
                height = $self.calculateHeightForVideo();
                $container.animate({ height:height }, animationSpeed, function () {
                    $(window).on('skycom.resizeend', $.proxy($self.resizeContainer, $self));
                    $wrapper.show();
                    $overlay.fadeOut(animationSpeed, function () {
                        $close.addClass('active');
                    });
                    callback();
                });
            });
        },
        calculateHeightForVideo:function () {
            return Math.round((this.container.width() / 16) * 9);
        },
        resizeContainer:function () {
            this.container.animate({ height:this.calculateHeightForVideo() }, 250);
        },
        hideCanvas:function () {
            var $container = this.container,
                $overlay = $container.find('.video-overlay'),
                $wrapper = $container.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $container.find('.video-wrapper .close'),
                animationSpeed = (this.options.animationSpeed === 0) ? 0 : this.options.animationSpeed || 500,
                self = this,
                originalHeight = this.originalHeight;

            $overlay.fadeIn(animationSpeed, function () {
                $close.removeClass('active');
                $container.animate({ height:originalHeight }, animationSpeed, function () {
                    $container.css({ height:'auto' });
                    if (self.options.closeCallback) self.options.closeCallback();
                    $play.fadeIn(animationSpeed);
                    $overlay.hide();
                    $wrapper.fadeOut(animationSpeed);
                    $wrapper.removeClass('playing-video');
                });
            });
        }
    };

    return Video;
}(window, jQuery));

if (typeof window.define === "function" && window.define.amd) {
    define('modules/video', [], function () {
        return toolkit.video;
    });
}