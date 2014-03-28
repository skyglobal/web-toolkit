/*! web-toolkit - v2.2.5 - 2014-03-28 */
if (typeof toolkit === "undefined") toolkit = {};

toolkit.polyfill = function() {
    function functionBind() {
        if (typeof Function.prototype.bind !== "undefined") {
            return;
        }
        Function.prototype.bind = function(oThis) {
            var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, FNOP = function() {}, fBound = function() {
                return fToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            FNOP.prototype = this.prototype;
            fBound.prototype = new FNOP();
            return fBound;
        };
    }
    function stringTtrim() {
        if (typeof String.prototype.trim !== "undefined") {
            return;
        }
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "");
        };
    }
    function arrayIndexOf() {
        if (typeof Array.prototype.indexOf !== "undefined") {
            return;
        }
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = from < 0 ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }
            for (;from < len; from++) {
                if (from in this && this[from] === elt) return from;
            }
            return -1;
        };
    }
    function classList() {}
    functionBind();
    stringTtrim();
    arrayIndexOf();
    classList();
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/polyfill", [], function() {
        toolkit.polyfill = toolkit.polyfill();
        return toolkit.polyfill;
    });
} else {
    toolkit.polyfill = toolkit.polyfill();
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.event = function() {
    var timeout = {
        resize: null
    };
    var state = {};
    var browserSpecificEvents = {
        transitionend: check("transition", "end"),
        animationend: check("animation", "end")
    };
    function capitalise(str) {
        return str.replace(/\b[a-z]/g, function() {
            return arguments[0].toUpperCase();
        });
    }
    function check(eventName, type) {
        var result = false, eventType = eventName.toLowerCase() + type.toLowerCase(), eventTypeCaps = capitalise(eventName.toLowerCase()) + capitalise(type.toLowerCase());
        if (state[eventType]) {
            return state[eventType];
        }
        if ("on" + eventType in window) {
            result = eventType;
        } else if ("onwebkit" + eventType in window) {
            result = "webkit" + eventTypeCaps;
        } else if ("ono" + eventType in document.documentElement) {
            result = "o" + eventTypeCaps;
        }
        return result;
    }
    function bindEvents() {
        on(window, "resize", function() {
            clearTimeout(timeout.resize);
            timeout.resize = setTimeout(emitResizeEnd, 200);
        });
    }
    function emitResizeEnd() {
        emit(window, "resizeend");
        if (typeof $ !== "undefined") {
            $(window).trigger("resizeend");
        }
    }
    function on(el, eventName, exec) {
        var browserSpecificEventName = browserSpecificEvents[eventName.toLowerCase()];
        eventName = browserSpecificEventName || eventName;
        if (el.addEventListener) {
            el.addEventListener(eventName, exec, false);
        } else {
            el.attachEvent(eventName, exec);
        }
    }
    function off(el, eventName, exec) {
        var browserSpecificEventName = browserSpecificEvents[eventName.toLowerCase()];
        eventName = browserSpecificEventName || eventName;
        if (el.removeEventListener) el.removeEventListener(eventName, exec, false); else el.detachEvent("on" + eventName, exec);
    }
    function emit(el, eventName) {
        var event;
        if (document.createEvent) {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventName, false, false, null);
            el.dispatchEvent(event);
        } else {
            event = document.createEventObject();
            el.fireEvent("on" + eventName, event);
        }
    }
    function ready(exec) {
        if (/in/.test(document.readyState)) {
            setTimeout(function() {
                ready(exec);
            }, 9);
        } else {
            exec();
        }
    }
    bindEvents();
    return {
        on: on,
        off: off,
        emit: emit,
        ready: ready
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/event", [], function() {
        toolkit.event = toolkit.event();
        return toolkit.event;
    });
} else {
    toolkit.event = toolkit.event();
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.detect = function(event) {
    var state = {
        css: {}
    };
    var html = document.documentElement;
    var toolkitClasses = [ "no-touch", "touch-device", "mobile-view", "desktop-view", "landscape", "portrait" ];
    var vendorPrefix = [ "Moz", "Webkit", "Khtml", "O", "ms" ];
    var touchClasses = {
        hasNot: toolkitClasses[0],
        has: toolkitClasses[1]
    };
    var viewClasses = {
        mobile: toolkitClasses[2],
        desktop: toolkitClasses[3]
    };
    var orientationClasses = {
        landscape: toolkitClasses[4],
        portrait: toolkitClasses[5]
    };
    function bindEvents() {
        event.on(window, "resize", updateDetectionStates);
    }
    function updateDetectionStates() {
        removeClasses();
        attachClasses();
    }
    function removeClasses() {
        var arrClasses = html.className.split(" ");
        for (var i in toolkitClasses) {
            var indexToRemove = arrClasses.indexOf(toolkitClasses[i]);
            if (indexToRemove > -1) {
                arrClasses.splice(indexToRemove, 1);
            }
        }
        html.className = arrClasses.join(" ");
    }
    function attachClasses() {
        var arrClasses = html.className.split(" ");
        arrClasses.push(touch() ? touchClasses.has : touchClasses.hasNot);
        arrClasses.push(view("mobile") ? viewClasses.mobile : viewClasses.desktop);
        arrClasses.push(orientation("landscape") ? orientationClasses.landscape : orientationClasses.portrait);
        html.className = arrClasses.join(" ");
    }
    function support3D() {
        var property = "transform";
        var style = html.style;
        for (var i = 0; i < vendorPrefix.length; i++) {
            style[vendorPrefix[i] + property] = "translate3D(0,0,0)";
            if (style[vendorPrefix[i] + property] === "translate3D(0,0,0)") {
                state.css.support3D = true;
                return state.css.support3D;
            }
        }
        state.css.support3D = false;
        return state.css.support3D;
    }
    function supportsPseudo() {
        var paraBefore = document.createElement("p"), styleBefore = document.createElement("style"), heightBefore, selectorsBefore = '#testbefore:before { content: "before"; }';
        styleBefore.type = "text/css";
        paraBefore.id = "testbefore";
        if (styleBefore.styleSheet) {
            styleBefore.styleSheet.cssText = selectorsBefore;
        } else {
            styleBefore.appendChild(document.createTextNode(selectorsBefore));
        }
        document.body.appendChild(styleBefore);
        document.body.appendChild(paraBefore);
        heightBefore = document.getElementById("testbefore").offsetHeight;
        document.body.removeChild(styleBefore);
        document.body.removeChild(paraBefore);
        state.css.pseudo = heightBefore >= 1;
        return state.css.pseudo;
    }
    function pseudo(el, pos, property) {
        if (!el) {
            return supportsPseudo();
        }
        if (!window.getComputedStyle) {
            return false;
        }
        var css = window.getComputedStyle(el, ":" + pos);
        var str = css.getPropertyValue(property);
        if (str && (str.indexOf("'") === 0 || str.indexOf('"') === 0)) {
            str = str.substring(1, str.length - 1);
        }
        return str;
    }
    function getHtmlPseudo(pos) {
        var content = pseudo(html, pos, "content");
        var fontFamily = pseudo(html, pos, "font-family");
        return content && content != "normal" ? content : fontFamily;
    }
    function supportsCSS(property) {
        if (state.css[property]) {
            return state.css[property];
        }
        if (property === "support3D") {
            return support3D(property);
        }
        var style = html.style;
        if (typeof style[property] == "string") {
            state.css[property] = true;
            return true;
        }
        property = property.charAt(0).toUpperCase() + property.substr(1);
        for (var i = 0; i < vendorPrefix.length; i++) {
            if (typeof style[vendorPrefix[i] + property] == "string") {
                state.css[property] = true;
                return state.css[property];
            }
        }
        state.css[property] = false;
        return state.css[property];
    }
    function css(el, property) {
        if (!property) {
            return supportsCSS(el);
        }
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
        } else if (el.currentStyle) {
            property = property.replace(/\-(\w)/g, function(strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = el.currentStyle[property];
        }
        return strValue;
    }
    function view(type) {
        state.view = getHtmlPseudo("after") || "desktop";
        return type ? state.view == type : state.view;
    }
    function orientation(type) {
        state.orientation = getHtmlPseudo("before") || "landscape";
        return type ? state.orientation == type : state.orientation;
    }
    function touch() {
        state.touch = typeof window.ontouchstart !== "undefined";
        return state.touch;
    }
    function elementVisibleBottom(el) {
        if (el.length < 1) return;
        var elementOffset = {
            top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
            left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
        };
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight;
    }
    attachClasses();
    bindEvents();
    return {
        css: css,
        touch: touch,
        orientation: orientation,
        view: view,
        pseudo: pseudo,
        state: state,
        elementVisibleBottom: elementVisibleBottom,
        updateDetectionStates: updateDetectionStates
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/detect", [ "utils/event" ], function(event) {
        toolkit.detect = toolkit.detect(event);
        return toolkit.detect;
    });
} else {
    toolkit.detect = toolkit.detect(toolkit.event);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.skycons = function(detect, event) {
    var icons = {
        "skycon-sky": "&#xf100;",
        "skycon-chevron-down": "&#xf101;",
        "skycon-info": "&#xf102;",
        "skycon-arrow-right": "&#xf103;",
        "skycon-plus-circle": "&#xf104;",
        "skycon-sky-plus": "&#xf105;",
        "skycon-tv": "&#xf106;",
        "skycon-twitter-reply": "&#xf107;",
        "skycon-arrow-down-left": "&#xf108;",
        "skycon-chevron-up": "&#xf109;",
        "skycon-chevron": "&#xf10a;",
        "skycon-facebook": "&#xf10b;",
        "skycon-tick": "&#xf10c;",
        "skycon-remote-record": "&#xf10d;",
        "skycon-warning": "&#xf10e;",
        "skycon-carousel-play": "&#xf10f;",
        "skycon-arrow-left": "&#xf110;",
        "skycon-chevron-left": "&#xf111;",
        "skycon-on-demand": "&#xf112;",
        "skycon-user-profile": "&#xf113;",
        "skycon-search": "&#xf114;",
        "skycon-twitter-retweet": "&#xf115;",
        "skycon-at": "&#xf116;",
        "skycon-volume": "&#xf117;",
        "skycon-twitter-favourite": "&#xf118;",
        "skycon-expand": "&#xf119;",
        "skycon-carousel-pause": "&#xf11a;",
        "skycon-mouse": "&#xf11b;",
        "skycon-share": "&#xf11c;",
        "skycon-never-miss": "&#xf11d;",
        "skycon-mail": "&#xf11e;",
        "skycon-sky-go": "&#xf11f;",
        "skycon-twitter-follow": "&#xf120;",
        "skycon-pending": "&#xf121;",
        "skycon-minify": "&#xf122;",
        "skycon-twitter": "&#xf123;",
        "skycon-close": "&#xf124;",
        "skycon-menu": "&#xf125;",
        "skycon-phone": "&#xf126;",
        "skycon-speech-bubble": "&#xf127;",
        "skycon-cloud": "&#xf128;",
        "skycon-video-play": "&#xf129;",
        "skycon-google-plus": "&#xf12a;"
    };
    function addWebfont(el, c) {
        var html = el.innerHTML, entity = icons[c];
        el.innerHTML = "<span style=\"font-style:normal;font-family: 'skycons'\">" + entity + "</span>" + html;
    }
    function init() {
        if (detect.pseudo()) {
            return;
        }
        var els = document.getElementsByTagName("*"), i, c, el;
        for (i = 0; ;i += 1) {
            el = els[i];
            if (!el) {
                break;
            }
            c = el.className;
            c = c.match(/skycon-[^\s'"]+/);
            if (c) {
                addWebfont(el, c[0]);
            }
        }
    }
    event.ready(init);
    return {
        add: addWebfont
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/skycons", [ "utils/detect", "utils/event" ], function(detect, event) {
        toolkit.skycons = toolkit.skycons(detect, event);
        return toolkit.skycons;
    });
} else {
    toolkit.skycons = toolkit.skycons(toolkit.detect, toolkit.event);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.hashManager = function() {
    var vars = {
        globalHashList: {},
        eventsAlreadyBound: false,
        lastExecutor: null,
        hash: null
    };
    function bindEvents() {
        $(window).on("hashchange", onHashChange);
        var doc_mode = document.documentMode, hashChangeSupport = "onhashchange" in window && (doc_mode === undefined || doc_mode > 7);
        if (!hashChangeSupport) {
            vars.hash = document.location.hash;
            setInterval(function() {
                if (document.location.hash !== vars.hash) {
                    $(window).trigger("hashchange");
                }
            }, 200);
        }
        vars.eventsAlreadyBound = true;
    }
    function onHashChange(hash) {
        var evt, fn;
        hash = cleanHash(typeof hash === "string" ? hash : location.hash);
        evt = getHashEvent(hash);
        if (hash && evt) {
            fn = "callback";
            vars.lastExecutor = hash;
        } else if (vars.lastExecutor) {
            evt = getHashEvent(vars.lastExecutor);
            fn = "undo";
        }
        if (evt && typeof evt[fn] === "function") {
            evt[fn](hash);
        }
    }
    function remove() {
        var loc = window.location;
        if ("pushState" in history) {
            location.hash = "!";
            history.pushState("", document.title, loc.pathname + loc.search);
        } else {
            location.hash = "!";
        }
    }
    function change(hash) {
        location.hash = "!" + hash;
    }
    function getHashEvent(hash) {
        var globalHashList = vars.globalHashList, registeredHash, wildcardEvent, exactMatchEvent;
        for (registeredHash in globalHashList) {
            if (matches(hash, registeredHash) || matches(registeredHash, hash)) {
                if (registeredHash.indexOf("/*") >= 0) {
                    wildcardEvent = globalHashList[registeredHash];
                } else {
                    exactMatchEvent = globalHashList[registeredHash];
                    break;
                }
            }
        }
        return exactMatchEvent || wildcardEvent;
    }
    function matches(hashWithoutWildCard, hashWithWildCard) {
        hashWithoutWildCard = cleanHash(hashWithoutWildCard);
        hashWithWildCard = cleanHash(hashWithWildCard);
        var hashSections = hashWithWildCard.split("/*");
        var hashMatched = hashWithoutWildCard.indexOf(hashSections[0]) === 0 && hashSections.length > 1 || hashWithoutWildCard == hashWithWildCard;
        return hashMatched;
    }
    function register(hashList, callback, undo) {
        if (typeof hashList === "string") {
            hashList = [ hashList ];
        }
        var hash, i = 0, len = hashList.length;
        for (i; i < len; i++) {
            hash = cleanHash(hashList[i]);
            if (vars.globalHashList[hash]) {
                var err = "hashManager: hash (" + hash + ") already exists";
                throw new Error(err);
            }
            vars.globalHashList[hash] = {
                callback: callback,
                undo: undo
            };
            if (vars.eventsAlreadyBound && matches(location.hash, hash)) {
                onHashChange();
            }
        }
    }
    function resetHash() {
        vars.globalHashList = [];
    }
    function cleanHash(hash) {
        return hash.replace(/[#!]/g, "");
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
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/hash-manager", [], function() {
        toolkit.hashManager = toolkit.hashManager();
        return toolkit.hashManager;
    });
} else {
    toolkit.hashManager = toolkit.hashManager();
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.popup = function() {
    function open(args) {
        var url = args.url;
        var width = args.width || 400;
        var height = args.height || width;
        var top = args.top || screen.height / 2 - height / 2;
        var left = args.left || screen.width / 2 - width / 2;
        var windowTitle = args.title || "Sky";
        return window.open(url, windowTitle, "top=" + top + ",left=" + left + ",width=" + width + ",height=" + height);
    }
    function openThisLink(e) {
        e.preventDefault();
        var args = $.extend($(this).data("popup"), {
            url: $(this).attr("href")
        });
        open(args);
    }
    function bindEvents() {
        $(document).on("click", "[data-popup]", openThisLink);
    }
    bindEvents();
    return {
        open: open
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/popup", [], function() {
        toolkit.popup = toolkit.popup();
        return toolkit.popup;
    });
} else {
    toolkit.popup = toolkit.popup();
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.toggle = function(detect, event) {
    var hasResized = false, hasContentChanged = false, elementsToToggle = {}, hiddenClass = "toggle-hidden", supportTransition = detect.css("transition");
    function animate($el, to) {
        if (supportTransition) {
            $el.css({
                height: to,
                overflow: "hidden",
                transition: "height 0.5s ease-in-out"
            });
        }
        $el.toggleClass(hiddenClass, to === 0);
        return $el;
    }
    function setOpenHeight($el) {
        var hasHeight = false;
        if (!supportTransition) return;
        if ($el.attr("style")) {
            var styles = $el.attr("style").split(";");
            for (var i in styles) {
                if (styles[i].trim().indexOf("height") === 0) {
                    hasHeight = true;
                }
            }
            if (hasHeight) {
                return;
            }
        }
        $el.css({
            height: getOpenHeight($el)
        });
    }
    function getOpenHeight($el) {
        if ($el.data("openHeight") !== undefined && !hasResized && !hasContentChanged) {
            return $el.data("openHeight");
        }
        $("body").append($('<div id="toggle-tmp-height" class="skycom-container"></div>').append($el.clone().attr("style", "").removeClass(hiddenClass + " transition ")));
        $("#toggle-tmp-height > div").append('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        $("#toggle-tmp-height > div").prepend('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        var openHeight = $("#toggle-tmp-height > div").height() - 2;
        $el.data("openHeight", openHeight);
        $("#toggle-tmp-height").remove();
        $(".toggle-clearfix-div").remove();
        return openHeight;
    }
    function updateText($elClicked) {
        var $spans = $elClicked.find("span");
        var $textElement = $spans.length > 0 ? $spans.first() : $elClicked;
        var oldText = $textElement.text();
        $textElement.text($elClicked.attr("data-toggle-text"));
        $elClicked.attr("data-toggle-text", oldText).attr("data-tracking-label", oldText);
    }
    function show($elToToggle) {
        var openHeight = getOpenHeight($elToToggle);
        animate($elToToggle, openHeight);
    }
    function hide($elToToggle) {
        setOpenHeight($elToToggle);
        animate($elToToggle, 0);
    }
    function updateToggledElements(state, $elementToToggle) {
        if (state == "shown") {
            elementsToToggle[$elementToToggle.selector] = {
                state: state,
                $elementToToggle: $elementToToggle
            };
        } else {
            delete elementsToToggle[$elementToToggle.selector];
        }
    }
    function toggle(options) {
        var $elClicked = options.$elClicked, $elementToToggle = options.$container || $($elClicked.attr("data-toggle")), action = options.action, state = $elClicked && $elClicked.attr("data-toggle-state");
        hasContentChanged = options.contentChanged !== undefined ? options.contentChanged : false;
        if (state === "shown" || action == "hide") {
            hide($elementToToggle);
            state = "hidden";
        } else {
            show($elementToToggle);
            state = "shown";
        }
        updateToggledElements(state, $elementToToggle);
        if (!$elClicked) {
            $elClicked = $('[data-toggle="#' + $elementToToggle.attr("id") + '"]');
        }
        if ($elClicked && state !== $elClicked.attr("data-toggle-state")) {
            updateText($elClicked, state);
            $elClicked.attr("data-toggle-state", state);
        }
    }
    event.on(window, "resizeend", function() {
        hasResized = true;
        var item, i;
        for (i in elementsToToggle) {
            item = elementsToToggle[i];
            if (item.state === "shown") {
                var openHeight = getOpenHeight(item.$elementToToggle);
                animate(item.$elementToToggle, openHeight);
            }
        }
        hasResized = false;
    });
    return toggle;
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/toggle", [ "utils/detect", "utils/event" ], function(detect, event) {
        toolkit.toggle = toolkit.toggle(detect, event);
        return toolkit.toggle;
    });
} else {
    toolkit.toggle = toolkit.toggle(toolkit.detect, toolkit.event);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.focus = function() {
    var tabKey = false;
    var focusClass = "has-focus";
    function bindEvents() {
        $(document).on("click keyup", keyUp).on("keydown", keyDown).on("focus", "a, input, button, select, *[tabindex]", addClass).on("blur", "a, input, button, select, *[tabindex]", removeClass);
    }
    function addClass(e) {
        if (tabKey) {
            $(e.currentTarget).addClass(focusClass);
        }
    }
    function removeClass(e) {
        $(e.currentTarget).removeClass(focusClass);
    }
    function keyDown(e) {
        var KeyID = window.event ? event.keyCode : e.keyCode;
        if (KeyID == 9) {
            tabKey = true;
        }
    }
    function keyUp(e) {
        var KeyID = window.event ? event.keyCode : e.keyCode;
        if (KeyID == 9) {
            tabKey = false;
        }
    }
    function apply(el) {
        $(el).addClass(focusClass);
        el.focus();
    }
    bindEvents();
    return {
        apply: apply,
        className: focusClass
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/focus", [], function() {
        toolkit.focus = toolkit.focus();
        return toolkit.focus;
    });
} else {
    toolkit.focus = toolkit.focus();
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.inPageNav = function(hash, event) {
    function InPageNav($element) {
        this.$tabContainer = $element;
        this.$tabs = $element.find("li[role=tab]");
        this.$tabTargets = $element.find("div[role=tabpanel]");
        this.$showMore = $element.find(".dropdown-tab-select .selector");
        this.$moreTabsContainer = $element.find(".dropdown-tab-select");
        this.$moreTabsLink = $element.find(".more-tabs");
        this.tabSizes = {};
        this.tabStates = [];
        this.setTabStates();
        this.bindEvents();
        this.initTabs();
    }
    InPageNav.prototype = {
        setTabStates: function() {
            var self = this;
            this.$tabs.each(function() {
                self.tabSizes[this.id] = $(this).outerWidth(true);
                var obj = $(this);
                var dropdownObj = obj.clone(true).removeClass("selected").removeAttr("aria-controls").removeAttr("aria-label").removeAttr("role").attr("aria-hidden", "true");
                var selected = obj.hasClass("selected");
                obj.addClass("selected");
                var maximumWidth = obj.outerWidth(true);
                obj.toggleClass("selected", selected);
                self.tabStates.push({
                    id: this.id,
                    obj: obj,
                    dropdownObj: dropdownObj,
                    size: maximumWidth,
                    selected: obj.hasClass("selected"),
                    dropped: false
                });
                self.$moreTabsLink.append(dropdownObj);
            });
        },
        getSelectedTab: function() {
            var selected = null;
            $.each(this.tabStates, function(i, tab) {
                if (tab.selected) {
                    selected = tab;
                    return false;
                }
            });
            return selected;
        },
        setSelectedTab: function(id) {
            var selected = null;
            $.each(this.tabStates, function(i, tab) {
                tab.selected = tab.id == id;
                if (tab.id == id) {
                    selected = tab;
                }
            });
            return selected;
        },
        getDroppedTabs: function() {
            var selected = [];
            $.each(this.tabStates, function(i, tab) {
                if (tab.dropped) {
                    selected.push(tab);
                }
            });
            return selected;
        },
        setDroppedTabs: function() {
            var dropDownIconWidth = this.$moreTabsContainer.show().outerWidth(true) || 44;
            var containerWidth = this.$tabContainer.outerWidth(true) - dropDownIconWidth;
            var totalWidth = 0;
            if (this.getSelectedTab()) {
                totalWidth += this.$tabs.filter("#" + this.getSelectedTab().id).outerWidth(true);
            }
            $.each(this.tabStates, function(i, n) {
                if (!n.selected) {
                    totalWidth += n.size;
                    n.dropped = totalWidth > containerWidth;
                }
            });
        },
        bindEvents: function() {
            var self = this;
            hash.register(this.getHashList(), this.changeTab.bind(self));
            this.$tabs.on("click", function() {
                self.changeTab($(this).find("a").attr("href"));
            });
            this.$moreTabsContainer.find("li").on("click", function() {
                self.changeTab($(this).find("a").attr("href"));
            });
            this.$tabs.find("a").on("focus", function() {
                var target = $(this).closest("li");
                if (target.hasClass("dropped")) {
                    self.dropTabsDuringInteraction(target.attr("id"));
                }
                target.addClass("given-focus");
            }).on("blur", function() {
                $(this).closest("li").removeClass("given-focus");
                self.$tabs.filter(".dropped-during-interaction").removeClass("dropped-during-interaction");
                if (self.$tabs.filter(".selected.dropped").length) {
                    self.dropTabsDuringInteraction(self.$tabs.filter(".selected.dropped").attr("id"));
                }
            });
            this.$showMore.on("click", function(e) {
                e.preventDefault();
                self.toggleShowMore();
            });
            $("body").on("click", this.hideMore.bind(self));
            event.on(window, "resizeend", this.initTabs.bind(self));
        },
        initTabs: function() {
            this.setDroppedTabs();
            this.setTabVisibility();
            this.setDropdownVisibility();
        },
        getHashList: function() {
            var arrHash = [], hash;
            this.$tabs.each(function() {
                hash = this.getAttribute("aria-controls");
                if (hash) {
                    arrHash.push(hash);
                }
            });
            return arrHash;
        },
        changeTab: function(controlId) {
            controlId = controlId.replace(/^#!{0,1}/, "");
            var $thisTab = $("#" + controlId.replace("-tab-contents", "") + "-tab");
            var $thisTabTarget = $("#" + controlId);
            this.$tabs.filter(".dropped-during-interaction").removeClass("dropped-during-interaction");
            this.$tabTargets.add(this.$tabs).removeClass("selected");
            this.setSelectedTab(controlId + "-tab");
            $thisTab.add($thisTabTarget).addClass("selected");
            if ($thisTab.hasClass("dropped")) {
                this.setDroppedTabs();
                this.setTabVisibility();
            }
        },
        hideMore: function(e) {
            if ($(e.target).closest(this.$showMore).length) {
                return;
            }
            this.toggleShowMore("hide");
        },
        toggleShowMore: function(type) {
            var action = this.$moreTabsLink.hasClass("dropdown-tab-selected") || type === "hide" ? "remove" : "add";
            this.$showMore.add(this.$moreTabsLink)[action + "Class"]("dropdown-tab-selected");
        },
        setTabVisibility: function() {
            $.each(this.tabStates, function(i, tab) {
                if (tab.dropped && !tab.selected) {
                    tab.obj.addClass("dropped");
                    tab.dropdownObj.removeClass("dropped");
                } else {
                    tab.obj.removeClass("dropped");
                    tab.dropdownObj.addClass("dropped");
                }
            });
        },
        setDropdownVisibility: function() {
            if (this.getDroppedTabs().length) {
                this.$moreTabsContainer.show();
            } else {
                this.$moreTabsContainer.hide();
            }
        },
        dropTabsDuringInteraction: function(id) {
            var self = this;
            var widthNeeded = self.tabSizes[id];
            var widthGained = 0;
            $.each(self.tabStates, function(i, tab) {
                widthGained += tab.size;
                tab.obj.addClass("dropped-during-interaction");
                if (widthGained >= widthNeeded) {
                    return false;
                }
            });
        }
    };
    $.fn.inPageNav = function() {
        return this.each(function() {
            new InPageNav($(this));
        });
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/in-page-nav", [ "utils/hash-manager", "utils/event" ], function(hash, event) {
        toolkit.inPageNav = toolkit.inPageNav(hash, event);
        return toolkit.inPageNav;
    });
} else {
    toolkit.inPageNav = toolkit.inPageNav(toolkit.hashManager, toolkit.event);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.accordion = function(toggle) {
    function Accordion($element) {
        this.$container = $element;
        this.$headings = $element.find(".accordion-heading");
        this.bindEvents();
    }
    function rotateIcon($elClicked) {
        $elClicked.find("i").toggleClass("rotate-180");
    }
    Accordion.prototype = {
        bindEvents: function() {
            this.$headings.on("click", this.toggleContent.bind(this));
        },
        toggleContent: function(e) {
            e.preventDefault();
            var $heading = $(e.currentTarget);
            toggle({
                $elClicked: $heading
            });
            rotateIcon($heading);
        }
    };
    $.fn.accordion = function() {
        return this.each(function() {
            var accordion = new Accordion($(this));
        });
    };
    return Accordion;
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/accordion", [ "utils/toggle" ], function(toggle) {
        return toolkit.accordion(toggle);
    });
} else {
    toolkit.accordion = toolkit.accordion(toolkit.toggle);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.datePicker = function() {
    var monthNames = [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ], currentDate = {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    };
    function daysInMonth(month, year) {
        return [ null, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][month];
    }
    function firstDay(month, year) {
        var day = new Date(year, month - 1, 1).getDay();
        return day === 0 ? 7 : day - 1;
    }
    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
    function normaliseDate(date) {
        return date.toString().length < 2 ? "0" + date : date;
    }
    function DatePicker($container) {
        this.calendarDate = $.extend(currentDate);
        this.$container = $container;
        this.$day = $container.find(".day");
        this.$month = $container.find(".month");
        this.$year = $container.find(".year");
        this.addCalendarHTML();
        this.bindEvents();
    }
    DatePicker.prototype = {
        bindEvents: function() {
            var datePicker = this;
            datePicker.$calendar.on("click", ".date", datePicker.selectDate.bind(datePicker)).on("click", ".prev", datePicker.displayPreviousMonth.bind(datePicker)).on("click", ".next", datePicker.displayNextMonth.bind(datePicker));
            datePicker.$container.on("keyup", "input", datePicker.updateCalendarView.bind(datePicker)).on("focus", "input", datePicker.show.bind(datePicker)).on("keydown", "input", function(e) {
                if (e.keyCode == 9) {
                    datePicker.hide();
                }
            });
            $(document).on("keydown", function(e) {
                if (e.keyCode == 27) {
                    datePicker.hide();
                }
            }).on("click", function(e) {
                if (e.target.className != "date-picker" && !datePicker.$container.find(e.target).length) {
                    datePicker.hide();
                }
            });
        },
        show: function() {
            this.$calendar.removeClass("hidden");
        },
        hide: function() {
            this.$calendar.addClass("hidden");
        },
        addCalendarHTML: function() {
            var $calendar = $('<div class="calendar hidden" aria-hidden="true"></div>'), $header = $('<div class="header"></div>'), $prev = $('<span class="prev"><i class="skycon-arrow-left"></i></span>'), $next = $('<span class="next"><i class="skycon-arrow-right"></i></span>'), $dateDescription = $("<span data-date></span>"), $daysHeader = $('<div class="days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>'), $dayContainer = $('<div class="day-container"></div>');
            $header.append($prev).append($dateDescription).append($next);
            $calendar.append($header).append($daysHeader).append($dayContainer);
            this.$container.append($calendar);
            this.$calendar = $calendar;
            this.$dateDescription = $dateDescription;
            this.$dayContainer = $dayContainer;
            this.renderCalendar();
        },
        renderCalendar: function() {
            var datePicker = this;
            datePicker.$dateDescription.text(monthNames[datePicker.calendarDate.month] + " " + datePicker.calendarDate.year);
            datePicker.fillDays(daysInMonth(datePicker.calendarDate.month, datePicker.calendarDate.year), firstDay(datePicker.calendarDate.month, datePicker.calendarDate.year));
        },
        fillDays: function(noOfDaysInMonth, firstDay) {
            var i = 0, date = 1, datePicker = this, calendarDate = datePicker.calendarDate, daysText = [], classNames = [], isToday = false, isInputDate = false, isPastDate = false, monthIsInPast = calendarDate.month < currentDate.month && calendarDate.year <= currentDate.year || calendarDate.year < currentDate.year, monthIsNow = calendarDate.month == currentDate.month && calendarDate.year == currentDate.year, monthIsInInput = calendarDate.month == datePicker.$month.val() && calendarDate.year == datePicker.$year.val();
            for (i; i < firstDay; i++) {
                daysText.push("<span></span>");
            }
            for (date; date <= noOfDaysInMonth; date++) {
                classNames = [];
                isInputDate = date == datePicker.$day.val() && monthIsInInput;
                isPastDate = date < currentDate.day && monthIsNow || monthIsInPast;
                isToday = date == currentDate.day && monthIsNow;
                if (isInputDate) classNames.push("selected");
                if (isPastDate) classNames.push("past");
                if (isToday) classNames.push("today");
                daysText.push("<span class='date " + classNames.join(" ") + "' >" + date + "</span>");
            }
            datePicker.$dayContainer.html(daysText.join(""));
        },
        selectDate: function(e) {
            var datePicker = this;
            datePicker.$container.find(".selected").removeClass("selected");
            $(e.currentTarget).addClass("selected");
            datePicker.calendarDate.day = parseInt(e.currentTarget.textContent || e.currentTarget.innerText, 10);
            datePicker.$day.val(normaliseDate(datePicker.calendarDate.day));
            datePicker.$month.val(normaliseDate(datePicker.calendarDate.month));
            datePicker.$year.val(normaliseDate(datePicker.calendarDate.year));
            datePicker.hide();
        },
        displayPreviousMonth: function() {
            var datePicker = this;
            if (datePicker.calendarDate.month === 1) {
                datePicker.calendarDate.month = 12;
                datePicker.calendarDate.year--;
            } else {
                datePicker.calendarDate.month--;
            }
            datePicker.renderCalendar();
        },
        displayNextMonth: function() {
            var datePicker = this;
            if (datePicker.calendarDate.month === 12) {
                datePicker.calendarDate.month = 1;
                datePicker.calendarDate.year++;
            } else {
                datePicker.calendarDate.month++;
            }
            datePicker.renderCalendar();
        },
        updateCalendarView: function(e) {
            var datePicker = this;
            datePicker.calendarDate.day = parseInt(datePicker.$day.val(), 10) || currentDate.day;
            datePicker.calendarDate.month = parseInt(datePicker.$month.val(), 10) || currentDate.month;
            datePicker.calendarDate.year = parseInt(datePicker.$year.val(), 10) || currentDate.year;
            datePicker.renderCalendar();
        }
    };
    $.fn.datePicker = function() {
        return this.each(function() {
            var datePicker = new DatePicker($(this));
        });
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/date-picker", [], function() {
        return toolkit.datePicker();
    });
} else {
    toolkit.datePicker = toolkit.datePicker();
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.validation = function() {
    function isSafari() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("safari") != -1) {
            return ua.indexOf("chrome") === -1;
        }
        return false;
    }
    function getValue($el) {
        var $radiosWithSameName = null;
        return $el.is("[type=checkbox]") ? $el.is(":checked") : $el.is("[type=radio]") ? ($radiosWithSameName = $el.parents("form").find('input[name="' + $el.attr("name") + '"]')).filter(":checked").length > 0 : $el.val();
    }
    function InvalidInputHelper(input, options) {
        if (options.emptyText) {
            input.setCustomValidity(options.defaultText);
        }
        function changeOrInput() {
            if (input.value === "") {
                if (options.emptyText) {
                    input.setCustomValidity(options.emptyText);
                }
            } else {
                input.setCustomValidity("");
            }
        }
        function invalid() {
            if (input.value === "") {
                if (options.emptyText) {
                    input.setCustomValidity(options.emptyText);
                }
            } else if (options.invalidText) {
                input.setCustomValidity(options.invalidText);
            }
        }
        input.addEventListener("change", changeOrInput);
        input.addEventListener("input", changeOrInput);
        input.addEventListener("invalid", invalid);
    }
    var useCustomFormErrors = !("required" in document.createElement("input")) || !("pattern" in document.createElement("input")) || isSafari();
    var canCustomiseHTML5Message = "setCustomValidity" in document.createElement("input");
    function Validation($container) {
        this.$container = $container;
        this.$requiredInputs = $container.find("*[required]");
        this.$patternInputs = $container.find("*[pattern]");
        this.errors = [];
        this.hasError = false;
        this.customiseHTML5Messages();
        this.bindEvents();
    }
    Validation.prototype = {
        bindEvents: function() {
            var validation = this;
            if (useCustomFormErrors) {
                validation.$container.on("submit", function(e) {
                    validation.validate(e);
                });
            }
        },
        customiseHTML5Messages: function() {
            if (!canCustomiseHTML5Message) return;
            this.$container.find(".feedback[data-for]").each(function() {
                var el = document.getElementById($(this).attr("data-for"));
                new InvalidInputHelper(el, {
                    invalidText: this.textContent || this.innerText
                });
            });
        },
        addErrorMessageToInput: function($input) {
            var inputId = $input.attr("id"), $descriptor = this.$container.find("label[for=" + inputId + "]"), $feedbacks = this.$container.find(".feedback[data-for=" + inputId + "]");
            this.hasError = true;
            if ($feedbacks.length > 0) {
                $feedbacks.removeClass("hidden");
            } else {
                $feedbacks = $('<span class="form-error feedback" data-for="' + $input.attr("id") + '">' + $descriptor.text() + " is required</span>").appendTo($input.closest(".row"));
            }
            if (!$input.hasClass("form-error")) {
                $input.addClass("form-error");
                $('<i class="form-error skycon-warning"></i>').insertAfter($input);
            }
            this.errors.push($feedbacks.first());
        },
        removeErrorsFromInput: function($input) {
            var inputId = $input.attr("id"), $feedbacks = this.$container.find(".feedback[data-for=" + inputId + "]");
            if ($input.hasClass("form-error")) {
                $input.removeClass("form-error");
                $input.next(".skycon-warning").remove();
            }
            $feedbacks.addClass("hidden");
        },
        createErrorsAtTop: function() {
            var errorHtml = '<div id="feedback-list-container" class="row" aria-live="polite"><p><i class="form-error skycon-warning"></i>Please correct the highlighted fields below:</p><ul class="feedback-list">', i;
            for (i = 0; i < this.errors.length; i++) {
                errorHtml += '<li class="form-error">' + this.errors[i].text() + "</li>";
            }
            errorHtml += "</ul></div>";
            this.$container.prepend(errorHtml);
            window.location.href = window.location.href.split("#")[0] + "#feedback-list-container";
        },
        resetErrors: function() {
            this.hasError = false;
            this.errors = [];
            this.$container.find("#feedback-list-container").remove();
        },
        validateRequired: function(index, input) {
            var $input = $(input), validation = this;
            if ($input.val() === "") {
                validation.addErrorMessageToInput($input);
            } else {
                validation.removeErrorsFromInput($input);
            }
        },
        validatePattern: function(index, input) {
            var $input = $(input), validation = this, pattern = $input.attr("pattern"), re = new RegExp("^(?:" + pattern + ")$"), value = getValue($input);
            if (value && !re.test(value)) {
                validation.addErrorMessageToInput($input);
            } else {
                validation.removeErrorsFromInput($input);
            }
        },
        validate: function(e) {
            var validation = this;
            validation.resetErrors();
            this.$requiredInputs.each(this.validateRequired.bind(validation));
            this.$patternInputs.each(this.validatePattern.bind(validation));
            if (validation.hasError) {
                e.preventDefault();
                validation.createErrorsAtTop();
            }
        }
    };
    $.fn.validation = function() {
        return this.each(function() {
            var validation = new Validation($(this));
        });
    };
    return Validation;
};

if (typeof window.define === "function" && window.define.amd) {
    define("utils/validation", [], function() {
        toolkit.validation = toolkit.validation();
        return toolkit.validation;
    });
} else {
    toolkit.validation = toolkit.validation();
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.form = function(datePicker, validation) {};

if (typeof window.define === "function" && window.define.amd) {
    define("components/form", [ "components/date-picker", "utils/validation" ], function(datePicker, validation) {
        return toolkit.form(datePicker, validation);
    });
} else {
    toolkit.form = toolkit.form(toolkit.datePicker, toolkit.validation);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.lightbox = function($, keyboardFocus, hash, event, detect) {
    var scrollbarWidth, classes = {
        main: "lightbox",
        closing: "lightbox-closing",
        content: "lightbox-content",
        closeButton: "lightbox-close",
        open: "lightbox-open",
        large: "skycom-10 skycom-offset1",
        small: "skycom-5 skycom-offset3"
    }, getSrollbarWidth = function() {
        var scrollDiv = document.createElement("div");
        scrollDiv.className = "lightbox-scrollbar-measure";
        document.body.appendChild(scrollDiv);
        scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }, html = {
        waitingForAjax: '<div style="margin:0 auto;width: 150px;"><div class="spinner-blue"><p>Please wait...</p></div></div>',
        closeButton: '<a class="internal-link ' + classes.closeButton + ' skycon-close" href="#!"><span class="speak">Close</span></a>',
        container: '<div class="skycom-container lightbox-container clearfix"></div>',
        contents: '<div class="' + classes.content + '" role="dialog"></div>',
        lightboxWrapper: '<div class="' + classes.main + '"></div>'
    }, defaults = {
        size: "large",
        closeButtonColour: "white"
    };
    function disableElementTabbing(index, element) {
        var $element = $(element);
        $element.attr("data-tabindex", $element.attr("tabindex"));
        $element.attr("tabindex", -1);
    }
    function enableElementTabIndex(index, element) {
        var $element = $(element);
        if ($element.attr("data-tabindex")) {
            $element.attr("tabindex", $element.attr("data-tabindex"));
            $element.removeAttr("data-tabindex");
        } else {
            $element.removeAttr("tabindex");
        }
    }
    function disablePageTabbing() {
        $("a, input, select, textarea, button, *[tabindex]").each(disableElementTabbing);
    }
    function enablePageTabbing($container) {
        $container.find("*[tabindex]").each(enableElementTabIndex);
    }
    function focusOnLightboxLink(link) {
        if (!link) {
            return;
        }
        link.focus();
    }
    function focusOnCloseButton($lightboxLink, $closeIcon) {
        if ($lightboxLink.hasClass(keyboardFocus.className)) {
            keyboardFocus.apply($closeIcon[0]);
        } else {
            $closeIcon[0].focus();
        }
    }
    function hideBodyScrollBar() {
        $("body").css({
            overflow: "hidden",
            "padding-right": (scrollbarWidth || getSrollbarWidth()) + "px"
        });
    }
    function showBodyScrollBar() {
        $("body").removeAttr("style");
    }
    function Lightbox(lightboxLink, options) {
        this.$lightboxLink = $(lightboxLink);
        this.href = this.$lightboxLink.attr("href");
        this.options = $.extend({}, defaults, options);
        this.init();
    }
    Lightbox.prototype = {
        init: function() {
            this.isAjaxRequest = this.href.substring(0, 1) !== "#";
            var restfulHash = this.getRestfulHash();
            this.$lightboxLink.on("click", this.open.bind(this));
            hash.register(restfulHash, this.open.bind(this));
        },
        getRestfulHash: function() {
            if (this.isAjaxRequest) {
                this.restfulHash = "#!" + this.href.split("#!")[1];
            } else {
                this.restfulHash = this.href;
            }
            return this.restfulHash;
        },
        getAjaxContent: function() {
            var lightbox = this;
            var $spinner = $(html.waitingForAjax);
            lightbox.$contents.append($spinner);
            $.get(lightbox.href).done(function(data) {
                lightbox.$lightboxLink.attr("href", lightbox.restfulHash);
                lightbox.href = lightbox.restfulHash;
                hash.change(hash.cleanHash(lightbox.href));
                $spinner.remove();
                lightbox.populate(null, data);
            });
            return false;
        },
        bindEvents: function() {
            var lightbox = this;
            this.$container.on("click", function(e) {
                var $target = $(e.target);
                if ($target.hasClass(classes.closeButton)) {
                    e.preventDefault();
                    lightbox.close();
                }
                if ($target.attr("href")) {
                    return true;
                }
                if ($target.closest("." + classes.content).length) {
                    return false;
                }
                lightbox.close();
            });
            event.on(this.$container[0], "animationend", lightbox.onClose.bind(lightbox));
        },
        populate: function(e, data) {
            data = data || $("#" + hash.cleanHash(this.restfulHash.replace(/\//g, "-"))).removeClass("hidden");
            if (data.length > 0) {
                this.$container.find("." + classes.content).append(data);
            } else {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                this.getAjaxContent();
            }
        },
        create: function() {
            var $lightboxDiv = $(html.lightboxWrapper), $contents = $(html.contents), $container = $(html.container), $close = $(html.closeButton).addClass(this.options.closeButtonColour);
            this.$contents = $contents;
            $contents.attr("aria-labelledby", this.$lightboxLink.id).attr("role", "dialog").addClass(classes[this.options.size]);
            $contents.prepend($close);
            $container.append($contents);
            $lightboxDiv.append($container);
            $("body").append($lightboxDiv);
            this.$container = $lightboxDiv;
        },
        open: function(e) {
            if (!this.$container) {
                this.create();
                this.populate(e);
                this.bindEvents();
            }
            if (this.$container.hasClass(classes.open)) {
                return;
            }
            if (this.options.onShow) {
                this.options.onShow();
            }
            hideBodyScrollBar();
            this.$container.addClass(classes.open);
            focusOnCloseButton(this.$lightboxLink, this.$container.find("." + classes.closeButton));
            disablePageTabbing();
            enablePageTabbing(this.$container);
        },
        close: function() {
            var lightbox = this;
            if (this.$container.hasClass(classes.closing)) {
                return;
            }
            if (!detect.css("animation")) {
                setTimeout(lightbox.onClose.bind(lightbox), 500);
            }
            this.$container.addClass(classes.closing);
            hash.remove();
        },
        onClose: function() {
            var lightbox = this;
            if (!lightbox.$container.hasClass(classes.closing)) {
                return;
            }
            lightbox.$container.removeClass(classes.open + " " + classes.closing);
            focusOnLightboxLink(lightbox.$lightboxLink);
            showBodyScrollBar();
            enablePageTabbing($("body"));
            if (lightbox.options.onClose) {
                lightbox.options.onClose();
            }
        }
    };
    $.fn.lightbox = function(options) {
        return this.each(function() {
            var lb = new Lightbox(this, options);
        });
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/lightbox", [ "utils/focus", "utils/hash-manager", "utils/event", "utils/detect" ], function(focus, hash, event, detect) {
        return toolkit.lightbox(jQuery, focus, hash, event, detect);
    });
} else {
    toolkit.lightbox = toolkit.lightbox(jQuery, toolkit.focus, toolkit.hashManager, toolkit.event, toolkit.detect);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.share = function(detect) {
    var $document = $(document);
    function bindEvents() {
        $document.on("click keypress", ".share-popup .summary", toggleSharePopover);
    }
    function toggleSharePopover(e) {
        e.preventDefault();
        var $section = $(this).parent(), triggerEvents = "keypress " + ("ontouchend" in document.documentElement ? "touchend" : "click");
        if (e.type === "click" || e.type === "touchend" || e.type === "keypress" && e.which === 13) {
            $section.toggleClass("active");
            var $popover = $(this).parent().find(".popover");
            if (detect.elementVisibleBottom($popover[0]) === false) {
                $popover.addClass("top");
            } else {
                $popover.removeClass("top");
            }
            $document.on(triggerEvents, function hidePopover(e) {
                if (!$.contains($section[0], e.target)) {
                    $section.removeClass("active");
                    $document.off(triggerEvents, hidePopover);
                }
            });
        }
    }
    bindEvents();
    return {
        toggleSharePopover: toggleSharePopover
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/share", [ "utils/detect" ], function(detect) {
        return toolkit.share(detect);
    });
} else {
    toolkit.share = toolkit.share(toolkit.detect);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.tooltip = function(detect) {
    function bindEvents() {
        ($(".tooltip-container") || $(document)).on("mouseenter mouseleave", "[data-tooltip]", hover);
        $("[data-tooltip] .tooltip-content").on("click", preventClicksToParent);
    }
    function preventClicksToParent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function hover(event) {
        var $hoveredElement = $(this), $tooltip = $hoveredElement.find(".tooltip-content");
        clearTimeout($tooltip.attr("data-tooltip-entry-timeout"));
        clearTimeout($tooltip.attr("data-tooltip-exit-timeout"));
        if (event.type == "mouseenter") {
            if ($tooltip.text() !== "") {
                show($tooltip);
            }
        } else {
            hide($tooltip);
        }
    }
    function position($tooltip) {
        $tooltip.toggleClass("top", !detect.elementVisibleBottom($tooltip[0]));
    }
    function show($tooltip) {
        $tooltip.attr("data-tooltip-entry-timeout", setTimeout(function() {
            $tooltip.addClass("show");
            setTimeout(function() {
                $tooltip.addClass("fade");
                position($tooltip);
            }, 15);
        }, 500));
    }
    function hide($tooltip) {
        var transitionDuration = 250;
        $tooltip.attr("data-tooltip-exit-timeout", setTimeout(function() {
            $tooltip.removeClass("fade");
            setTimeout(function() {
                $tooltip.removeClass("show top");
            }, transitionDuration);
        }, 300));
    }
    bindEvents();
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/tooltip", [ "utils/detect" ], function(detect) {
        toolkit.tooltip = toolkit.tooltip(detect);
        return toolkit.tooltip;
    });
} else {
    toolkit.tooltip = toolkit.tooltip(toolkit.detect);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.video = function(window, $, event) {
    function Video($container, options) {
        if (!$container.attr("data-video-id")) {
            return;
        }
        var video = this;
        this.$container = $container;
        this.options = {
            token: options.token,
            freewheel: options.displayAdverts,
            animationSpeed: options.animationSpeed !== undefined ? options.animationSpeed : 500,
            autoplay: false,
            videoId: $container.attr("data-video-id"),
            onPlay: options.onPlay,
            closeCallback: options.closeCallback,
            $wrapperLocation: options.$wrapperLocation || this.$container
        };
        this.bindEvents();
    }
    Video.prototype = {
        bindEvents: function() {
            var video = this;
            video.$container.on("click", ".play-video", function(e) {
                video.createWrapper();
                video.play(e);
            });
        },
        bindWrapperEvents: function() {
            var video = this;
            $("body").one("keydown", video.stopOnEscape.bind(video));
            video.$wrapper.one("click touchstart", ".close", video.stop.bind(video));
            video.$player.one("ended webkitendfullscreen", video.stop.bind(video));
        },
        createWrapper: function() {
            this.options.$wrapperLocation.append('<div class="video-wrapper">' + '<a href="#!" class="close"><i class="skycon-close" aria-hidden=true></i><span class="speak">Close</span></a>' + '<div class="videocontrolcontainer"><video></video><img class="posterFrame"/></div>' + "</div>");
            this.options.$wrapperLocation.find(".posterFrame").on("error", function() {
                this.src = options.placeHolderImage;
            });
            this.options.$wrapperLocation.append('<div class="video-overlay"></div>');
            this.$player = this.options.$wrapperLocation.parent().find("video");
            this.$wrapper = this.options.$wrapperLocation.find(".video-wrapper");
            this.$wrapper.attr("id", "video-" + this.options.videoId);
            this.bindWrapperEvents();
        },
        removeWrapper: function() {
            this.$wrapper.removeClass("playing-video").remove();
            this.options.$wrapperLocation.find(".video-overlay").remove();
        },
        play: function(e) {
            if (e) {
                e.preventDefault();
            }
            var video = this;
            if (video.options.onPlay) {
                video.options.onPlay();
            }
            this.showCanvas(function() {
                video.$player.sky_html5player(video.options);
                setTimeout(function() {
                    sky.html5player.play();
                }, 1333);
            });
        },
        stopOnEscape: function(e) {
            if (e.keyCode === 27) {
                e.preventDefault();
                this.stop();
            }
        },
        stop: function(e) {
            if (e) {
                e.preventDefault();
            }
            var video = this;
            event.off(window, "resizeend", video.resizeListener);
            sky.html5player.close(this.$wrapper);
            this.hideCanvas();
        },
        showCanvas: function(callback) {
            var height, $container = this.$container, $wrapperLocation = this.options.$wrapperLocation, $overlay = $wrapperLocation.find(".video-overlay"), $wrapper = $wrapperLocation.find(".video-wrapper"), $play = $container.find(".play-video"), $close = $wrapper.find(".close"), animationSpeed = this.options.animationSpeed === 0 ? 0 : this.options.animationSpeed || 500, video = this;
            this.originalHeight = $container.height();
            $wrapper.addClass("playing-video");
            $overlay.fadeIn(animationSpeed, function() {
                $play.fadeOut(animationSpeed);
                $close.addClass("active");
                height = video.calculateHeight();
                $container.animate({
                    height: height
                }, animationSpeed, function() {
                    video.resizeListener = video.resizeContainer.bind(video);
                    event.on(window, "resizeend", video.resizeListener);
                    $wrapper.show();
                    $overlay.fadeOut(animationSpeed);
                    callback();
                });
            });
        },
        calculateHeight: function() {
            return Math.round(this.$container.width() / 16 * 9);
        },
        resizeContainer: function() {
            this.$container.animate({
                height: this.calculateHeight()
            }, 250);
        },
        hideCanvas: function() {
            var video = this, $container = this.$container, $wrapperLocation = this.options.$wrapperLocation, $overlay = $wrapperLocation.find(".video-overlay"), $wrapper = $wrapperLocation.find(".video-wrapper"), $play = $container.find(".play-video"), $close = $wrapper.find(".close"), animationSpeed = this.options.animationSpeed === 0 ? 0 : this.options.animationSpeed || 500, originalHeight = this.originalHeight;
            $overlay.fadeIn(animationSpeed, function() {
                $close.removeClass("active");
                $container.animate({
                    height: originalHeight
                }, animationSpeed, function() {
                    $container.css({
                        height: "auto"
                    });
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
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/video", [ "utils/event" ], function(event) {
        return toolkit.video(window, jQuery, event);
    });
} else {
    toolkit.video = toolkit.video(window, jQuery, toolkit.event);
}

if (typeof toolkit === "undefined") toolkit = {};

toolkit.carousel = function(video, detect) {
    var has3d = detect.css("support3D");
    var hasTransform = detect.css("transform");
    function Carousel(element, options) {
        this.options = options;
        this.$viewport = element;
        this.$slideContainer = element.find(".skycom-carousel-container");
        this.$slides = this.$slideContainer.find(".slide");
        this.currentIndex = 0;
        this.slideCount = this.$slides.length;
        this.timerId = false;
        this.touchReset();
        this.bindEvents();
        this.initialiseVideos();
    }
    Carousel.prototype = {
        unbindTouchEvents: function() {
            this.$slideContainer.off("touchstart touchmove touchend touchcancel");
        },
        bindTouchEvents: function() {
            this.$slideContainer.on("touchstart", this.touchstart.bind(this)).on("touchmove", this.touchmove.bind(this)).on("touchend", this.touchend.bind(this)).on("touchcancel", this.touchReset.bind(this));
        },
        bindEvents: function() {
            this.bindTouchEvents();
            this.$slideContainer.on("click", "a", this.pause.bind(this));
            this.$slideContainer.on("click", "figure", function(e) {
                if (e.target.parentNode.className.indexOf("play-video") >= 0 || e.target.className.indexOf("play-video") >= 0) {
                    return;
                }
                document.location = $(this).closest(".slide").find("figcaption a").attr("href");
            });
            this.$slideContainer.on("mouseenter mouseleave", ".slide", function(e) {
                $(this).find("figcaption a").toggleClass("hover", e.type === "mouseenter");
            });
        },
        unbindEvents: function() {
            this.unbindTouchEvents();
            this.$slideContainer.off("click", "a");
            this.$slideContainer.off("click", "figure");
        },
        setOffset: function(percent, animate) {
            var $container = this.$slideContainer.removeClass("animate");
            if (animate) $container.addClass("animate");
            if (has3d) {
                $container.css("transform", "translate3d(" + percent + "%,0,0) scale3d(1,1,1)");
            } else if (hasTransform) {
                $container.css("transform", "translate(" + percent + "%,0)");
            } else if (animate) {
                $container.animate({
                    left: percent * 2 + "%"
                }, 600);
            } else {
                $container.css({
                    left: percent * 2 + "%"
                });
            }
            return this;
        },
        toggleTermsContent: function() {
            this.pause();
            var termsHidden = this.$viewport.next(".terms-content").find(".terms").length === 0;
            this[termsHidden ? "showTermsContent" : "hideTermsContent"]();
        },
        showTermsContent: function() {
            this.$viewport.next(".terms-content").find(".terms").remove();
            var $terms = $(this.$slides[this.currentIndex]).find(".terms");
            if ($terms.length) {
                this.$viewport.next(".terms-content").append($terms.clone(true).removeClass("speak").attr("aria-hidden", "true")).fadeIn(200);
            }
        },
        hideTermsContent: function() {
            this.$viewport.next(".terms-content").fadeOut(200, function() {
                $(this).find(".terms").remove();
            });
        },
        showTermsLink: function(slideIndex) {
            this.hideTermsLink();
            var $terms = $(this.$slides[slideIndex]).find(".terms");
            if ($terms.length) {
                this.$viewport.find(".terms-link").removeClass("hidden").fadeIn(200);
            }
        },
        hideTermsLink: function() {
            this.$viewport.find(".terms-link").fadeOut(200);
            this.hideTermsContent();
        },
        initialiseVideos: function() {
            var carousel = this;
            this.$slides.video({
                $wrapperLocation: carousel.$viewport,
                token: "8D5B12D4-E1E6-48E8-AF24-F7B13050EE85",
                displayAdverts: false,
                onPlay: function() {
                    carousel.pause();
                    carousel.$viewport.find(".actions, .indicators, .terms-link").fadeOut(500);
                },
                closeCallback: function() {
                    carousel.$viewport.find(".actions, .indicators, .terms-link").fadeIn(500);
                }
            });
        },
        moveSlide: function(opts) {
            var self = this, $slides = this.$slides, cssFloat, indexToShow;
            indexToShow = opts.index >= this.slideCount ? 0 : opts.index < 0 ? this.slideCount - 1 : opts.index;
            cssFloat = opts.index > this.currentIndex && !opts.reverse ? "left" : "right";
            $slides.filter(":not(:eq(" + this.currentIndex + "))").hide();
            $slides.eq(this.currentIndex).css("float", cssFloat);
            $slides.eq(indexToShow).show().css("float", cssFloat == "left" ? "right" : "left");
            this.setOffset(opts.start, false);
            if (typeof opts.end !== "undefined") {
                setTimeout(function() {
                    self.setOffset(opts.end, true);
                    self.showTermsLink(indexToShow);
                    self.$viewport.trigger("change", indexToShow);
                }, 20);
                this.currentIndex = indexToShow;
                if (typeof opts.callback == "function") opts.callback(indexToShow);
            }
            return indexToShow;
        },
        "goto": function(slideIndex, pause, callback) {
            if (pause !== false) this.pause();
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
            this.$viewport.find(".indicators, .actions").css("display", "block");
            return this;
        },
        previous: function() {
            this.goto(this.currentIndex - 1);
            this.$viewport.find(".indicators, .actions").css("display", "block");
            return this;
        },
        play: function(callback, delay) {
            var self = this, interval = this.options.interval;
            self.timerId = setTimeout(function() {
                self.next(false);
                self.timerId = setTimeout(function loop() {
                    self.next(false, function() {
                        self.timerId = setTimeout(loop, interval);
                    });
                }, interval);
            }, delay || this.options.onPlayDelay);
            this.$viewport.trigger("playing");
            if (typeof callback == "function") callback();
            return this;
        },
        pause: function(callback) {
            clearTimeout(this.timerId);
            this.$viewport.trigger("paused");
            if (typeof callback == "function") callback();
            return this;
        },
        touchstart: function(e) {
            var touch = e.originalEvent.touches[0];
            this.pause();
            this.swipe.start = {
                x: touch.pageX,
                y: touch.pageY
            };
        },
        touchmove: function(e) {
            var swipe = this.swipe, touch = e.originalEvent.touches[0], xDifference = touch.pageX - swipe.start.x, yDifference = touch.pageY - swipe.start.y, scrollingCarousel = Math.abs(xDifference) > Math.abs(yDifference), slideIndex = xDifference < 0 ? this.currentIndex + 1 : this.currentIndex - 1, positionAsPercentage;
            if (!swipe.start || scrollingCarousel === false) return;
            e.preventDefault();
            positionAsPercentage = xDifference / this.$slideContainer.outerWidth(true) * 100;
            if (xDifference > 0) positionAsPercentage -= 50;
            this.swipe.positionAsPercentage = positionAsPercentage;
            this.moveSlide({
                index: slideIndex,
                start: positionAsPercentage
            });
        },
        touchend: function(e) {
            if (!this.swipe.start) return;
            var swipe = this.swipe, position = swipe.positionAsPercentage, touch = e.originalEvent.changedTouches[0], xDifference = touch.pageX - swipe.start.x, direction = null, threshold = 75;
            if (Math.abs(xDifference) > threshold) {
                direction = xDifference < 0 ? "left" : "right";
            }
            if (direction === "left") {
                this.moveSlide({
                    index: this.currentIndex + 1,
                    start: position,
                    end: -50
                });
                this.$viewport.find(".next").trigger("toolkit.track");
            } else if (direction === "right") {
                this.moveSlide({
                    index: this.currentIndex - 1,
                    start: position,
                    end: 0
                });
                this.$viewport.find(".previous").trigger("toolkit.track");
            } else if (position !== 0) {
                var start = xDifference > 0 ? position + 50 : position, index = this.currentIndex, end = 0, reverse;
                if (start < 0) {
                    this.currentIndex = index + 1 >= this.slideCount ? 0 : index + 1;
                } else {
                    this.currentIndex -= 1;
                    end = -50;
                    start -= 50;
                }
                reverse = this.currentIndex === 0 && index === this.slideCount - 1;
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
    $.fn.skycom_carousel = function(params) {
        var options = $.extend(true, {
            actions: [ {
                id: "play",
                label: "Play Carousel",
                icon: "carousel-play"
            }, {
                id: "pause",
                label: "Pause Carousel",
                icon: "carousel-pause"
            }, {
                id: "previous",
                label: "Previous",
                icon: "chevron-left",
                speak: true
            }, {
                id: "next",
                label: "Next",
                icon: "chevron",
                speak: true
            } ],
            autoplay: true,
            startSlideIndex: 0,
            onPlayDelay: 500,
            interval: 6e3
        }, params);
        var markup = {
            actions: function($element, options) {
                var html = "", id, label, i, extraClass, icon, action, circle, actions = options.actions, onclick = options.onclick;
                if (options.count <= 1) return this;
                for (i = 0; i < actions.length; i++) {
                    action = actions[i];
                    id = action.id;
                    extraClass = id == "next" || id == "previous" ? " hidden-touch " : "";
                    icon = "skycon-" + action.icon;
                    label = action.speak ? '<span class="speak">' + action.label + "</span>" : action.label;
                    html += '<a href="#" class="skycom-internal supportive ' + extraClass + id + '" >';
                    html += '<span class="semi-circle"><i class="' + icon + '" aria-hidden="true"></i></span>' + label;
                    html += "</a>";
                }
                $element.find(".skycom-carousel-container").before('<div class="actions">' + html + "</div>");
                $element.find("> .actions > *").each(function(index) {
                    $(this).attr("data-action", actions[index].id).on("click", function(e) {
                        onclick(actions[index].id);
                        e.preventDefault();
                    });
                });
                return this;
            },
            indicators: function($element, options) {
                var $indicators, i, count = options.count, onclick = options.onclick, html = '<div class="indicators"><div class="container">', className = ' class="active"';
                if (count > 1) {
                    for (i = count; i--; ) {
                        html += "<span" + className + ' data-tracking data-tracking-label="indicator"></span>';
                        className = "";
                    }
                }
                $indicators = $(html + "</div></div>").on("click", "span", function(e) {
                    onclick($(e.currentTarget).index());
                });
                $element.append($indicators);
                return this;
            },
            terms: function($element) {
                var $termsLink = $('<a href="#!" class="terms-link carousel-content cushioned hidden black internal-link supportive" aria-hidden="true">Terms and Conditions</a>');
                var $termsContent = $('<div class="terms-content carousel-content cushioned"></div>').hide();
                if ($element.find(".terms").length) {
                    $element.append($termsLink);
                    $element.after($termsContent);
                    $element.addClass("has-terms");
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
                }).terms($this).actions($this, {
                    count: carousel.slideCount,
                    actions: options.actions,
                    onclick: function(action) {
                        carousel[action]();
                    }
                });
            };
            createMarkup(carousel);
            $this.on("click", ".terms-link", function(e) {
                carousel.toggleTermsContent();
            }).on("change", function(e, index) {
                index = index || 0;
                $this.find(".indicators .container > *").removeClass("active").eq(index).addClass("active");
                carousel.$slides.removeClass("active").find("a").attr("tabindex", -1);
                carousel.$slides.eq(index).addClass("active").find("a").removeAttr("tabindex");
            }).on("playing", function() {
                $this.removeClass("paused").addClass("playing");
            }).on("paused", function() {
                $this.removeClass("playing").addClass("paused");
            }).on("pause", function() {
                carousel.pause();
            }).on("play", function() {
                carousel.play();
            }).on("goto", function(e, slideIndex) {
                carousel.goto(slideIndex, true);
            }).on("refresh", function(e, slideIndex) {
                carousel.$slideContainer = carousel.$viewport.find(".skycom-carousel-container");
                carousel.$slides = carousel.$slideContainer.find(">");
                carousel.slideCount = carousel.$slides.length;
                $this.find(".indicators").remove();
                $this.find(".actions").remove();
                $this.find(".video-overlay").remove();
                slideIndex = parseInt(slideIndex, 10);
                slideIndex = isNaN(slideIndex) || slideIndex < 0 ? 0 : slideIndex;
                slideIndex = slideIndex > carousel.slideCount - 1 ? carousel.slideCount - 1 : slideIndex;
                carousel.goto(slideIndex, true);
                carousel.unbindEvents();
                carousel.bindEvents();
                createMarkup(carousel);
            }).on("keyup", function(e) {
                switch (e.keyCode) {
                  case 9:
                    carousel.pause();
                    break;

                  case 37:
                    carousel.previous();
                    break;

                  case 39:
                    carousel.next();
                    break;
                }
            }).find(".toggle-terms").on("click", function(e) {
                carousel.$viewport.toggleClass("showing-tandcs");
            });
            if (carousel.slideCount > 1) {
                carousel[options.autoplay === true ? "play" : "pause"](false, options.interval);
                carousel.goto(options.startSlideIndex, false);
                carousel.showTermsLink(0);
                $this.trigger("change");
            } else {
                carousel.showTermsLink(0);
                carousel.unbindTouchEvents();
            }
        });
    };
};

if (typeof window.define === "function" && window.define.amd) {
    define("components/carousel", [ "components/video", "utils/detect" ], function(video, detect) {
        return toolkit.carousel(video, detect);
    });
} else {
    toolkit.carousel = toolkit.carousel(toolkit.video, toolkit.detect);
}

if (typeof window.define === "function" && window.define.amd) {
    define("toolkit", [ "utils/polyfill", "utils/detect", "utils/skycons", "utils/hash-manager", "utils/popup", "utils/toggle", "utils/focus", "utils/event", "components/in-page-nav", "components/accordion", "components/form", "components/lightbox", "components/share", "components/tooltip", "components/video", "components/carousel" ], function(polyfill, detect, skycons, hashManager, popup, toggle, focus, validation, event, inPageNav, accordion, datePicker, lightbox, share, tooltip, video, carousel) {
        return {
            polyfill: polyfill,
            detect: detect,
            skycons: skycons,
            hashManager: hashManager,
            popup: popup,
            toggle: toggle,
            focus: focus,
            validation: validation,
            event: event,
            inPageNav: inPageNav,
            accordion: accordion,
            datePicker: datePicker,
            lightbox: lightbox,
            share: share,
            tooltip: tooltip,
            video: video,
            carousel: carousel
        };
    });
}

