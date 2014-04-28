/**
 * IMPORTANT NOTE!!!
 * Please note that this is a heavily modified version for Sky Global's Toolkit.
 */

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.2
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


var scrollspy = (function ($) { "use strict";

    // SCROLLSPY CLASS DEFINITION
    // ==========================
    function ScrollSpy(element, options) {
        var href
        var process  = $.proxy(this.process, this)

        this.$element       = $(element).is('body') ? $(window) : $(element)
        this.$body          = $('body')
        this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
        this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector       = (this.options.target
            || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            || '') + ' .nav li > a'
        this.offsets        = $([])
        this.targets        = $([])
        this.activeTarget   = null

        this.refresh()
        this.process()
    }

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.refresh = function () {
        var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

        this.offsets = $([])
        this.targets = $([])

        var self     = this
        var $targets = this.$body
            .find(this.selector)
            .map(function () {
                var $el   = $(this)
                var href  = $el.data('target') || $el.attr('href')
                var $href = /.*#\w/.test(href) && ($(href).length ? $(href) : $('[id=' + href.split('#')[1] + ']'))

                return ($href
                    && $href.length
                    && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
            })
            .sort(function (a, b) { return a[0] - b[0] })
            .each(function () {
                self.offsets.push(this[0])
                self.targets.push(this[1])
            })
    }

    ScrollSpy.prototype.process = function () {
        var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
        var maxScroll    = scrollHeight - this.$scrollElement.height()
        var offsets      = this.offsets
        var targets      = this.targets
        var activeTarget = this.activeTarget
        var i

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets.last()[0]) && this.activate(i)
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i]
                && scrollTop >= offsets[i] - 100 // note: the 100 is the height of the whole navigation menu
                && (!offsets[i + 1] || scrollTop <= offsets[i + 1] - 100) // note: the 100 is the height of the whole navigation menu
            && this.activate( targets[i] )
        }
    }

    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = this.activeTarget || {};
        var splits = target.split('--');
        var selectedMainTab = splits[0];
        var selectedSubTab = splits.length > 1 ? splits[1] : null;
        if (this.activeTarget.selectedMainTab !== selectedMainTab) {
            $('.tabs a[href="' + selectedMainTab + '"]').parent()
                .trigger('click')// for in-page-nav, in particular to deal with drop down menu
                .trigger('activate'); // for demo's menu to show/hide appropriate submenu
            this.activeTarget = selectedMainTab;
        }
        if (this.activeTarget.selectedSubTab !== selectedSubTab) {
            $('.tabs a[href="' + selectedMainTab + '--' + selectedSubTab + '"]').parent().trigger('click');
            this.activeTarget = selectedSubTab;
        }
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    var old = $.fn.scrollspy

    $.fn.scrollspy = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            $spy.scrollspy($spy.data())
        })
    })

});

//modified for AMD/RequireJS.
//by Peter Mouland
if (typeof window.define === "function" && window.define.amd) {
    define([], function() {
        return scrollspy(jQuery);
    });
} else {
    scrollspy(jQuery);
}
