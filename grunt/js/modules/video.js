if (typeof toolkit === 'undefined') toolkit = {};
toolkit.video = (function (window, $) {
    'use strict';

    function Video($container, options) {
        if (!$container.attr('data-video-id')){ return; }
        var video = this;
        this.$container = $container;
        this.options = {
            token : options.token,
            freewheel : options.displayAdverts,
            animationSpeed : (options.animationSpeed) ? options.animationSpeed : 500,
            autoplay : false,
            videoId : $container.attr('data-video-id'),
            onPlay: options.onPlay,
            closeCallback: options.closeCallback
        };
        this.bindEvents();
    }

    Video.prototype = {
        bindEvents: function(){
            var video = this;
            video.$container.on('click','.play-video' ,function(){
                video.createWrapper();
                video.play();
            });
        },
        bindWrapperEvents:function () {
            var video = this;
            video.$wrapper.on('keydown', video.stopOnEscape.bind(video));
            video.$wrapper.one('click touchstart', '.close', video.stop.bind(video));
            video.$player.on('ended webkitendfullscreen', video.stop.bind(video));
        },
        createWrapper:function () {
            this.$container.append('<div class="video-wrapper">' +
                '<a href="#!" class="close"><i class="skycon-close" aria-hidden=true></i><span class="speak">Close</span></a>' +
                '<div class="videocontrolcontainer"><video></video><img class="posterFrame"/></div>' +
            '</div>');
            this.$container.find('.posterFrame').on('error', function () {
                this.src = options.placeHolderImage;
            });
            this.$container.append('<div class="video-overlay"></div>');
            this.$player = this.$container.find('video');
            this.$wrapper = this.$container.find('.video-wrapper');
            this.$wrapper.attr('id', 'video-' + this.options.videoId);
            this.bindWrapperEvents();
        },
        removeWrapper: function(){
            this.$wrapper.removeClass('playing-video').remove();
        },

        play:function (e) {
            if(e) { e.preventDefault(); }
            var video = this;
            if(video.options.onPlay) {
                video.options.onPlay();
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
            if (e.keyCode === 17) {
                e.preventDefault();
                this.stop();
            }
        },
        stop:function () {
            var video = this;
            $(window).off('skycom.resizeend', video.resizeContainer);
            sky.html5player.close(this.$wrapper);
            this.hideCanvas();
        },
        showCanvas:function (callback) {
            var height,
                $container = this.$container,
                $overlay = $container.find('.video-overlay'),
                $wrapper = $container.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $container.find('.video-wrapper .close'),
                animationSpeed = (this.options.animationSpeed === 0) ? 0 : this.options.animationSpeed || 500,
                video = this;
            this.originalHeight = $container.height();
            $wrapper.addClass('playing-video');
            $overlay.fadeIn(animationSpeed, function () {
                $play.fadeOut(animationSpeed);
                height = video.calculateHeight();
                $container.animate({ height:height }, animationSpeed, function () {
                    $(window).on('skycom.resizeend', $.proxy(video.resizeContainer, video));
                    $wrapper.show();
                    $overlay.fadeOut(animationSpeed, function () {
                        $close.addClass('active');
                    });
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
                $overlay = $container.find('.video-overlay'),
                $wrapper = $container.find('.video-wrapper'),
                $play = $container.find('.play-video'),
                $close = $container.find('.video-wrapper .close'),
                animationSpeed = (this.options.animationSpeed === 0) ? 0 : this.options.animationSpeed || 500,
                originalHeight = this.originalHeight;

            $overlay.fadeIn(animationSpeed, function () {
                $close.removeClass('active');
                $container.animate({ height:originalHeight }, animationSpeed, function () {
                    $container.css({ height:'auto' });
                    if (video.options.closeCallback) {
                        video.options.closeCallback();
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
}(window, jQuery));

if (typeof window.define === "function" && window.define.amd) {
    define('modules/video', [], function () {
        return toolkit.video;
    });
}