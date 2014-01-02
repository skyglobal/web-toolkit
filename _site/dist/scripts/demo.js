
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
        hash: null,
        fallback: {
            callback: null,
            undo: null
        }
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
        } else if (fn === 'callback' && vars.fallback.callback) {
            vars.fallback.callback(hash);
        } else if (fn === 'undo' && vars.fallback.undo) {
            vars.fallback.undo(hash);
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

    function registerFallback(callback, undo){
        vars.fallback.callback = callback;
        vars.fallback.undo = undo;
    }

    function cleanHash(hash) {
        return hash.replace(/[#!]/g, '');
    }

    bindEvents();

    return {
        register: register,
        registerFallback: registerFallback,
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
/*global jQuery:false */
if (typeof toolkit==='undefined') toolkit={};
toolkit.lightbox = (function ($, keyboardFocus, hash) {
    
	var classes = {
            main: 'lightbox',
            closing: 'lightbox-closing',
            content: 'lightbox-content',
            closeButton: 'lightbox-close',
            open: 'lightbox-open'
        },
        scrollbarWidth = function() {
            var scrollDiv = document.createElement("div"),
                scrollbarWidth;
            scrollDiv.className = "lightbox-scrollbar-measure";
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        }();

	function disableElementTabbing(index, element) {
		var $element = $(element);
		$element.attr('data-tabindex', $element.attr('tabindex'));
		$element.attr('tabindex', -1);
	}
    function enableElementTabIndex(index, element) {
        var $element = $(element);
        if ($element.attr('data-tabindex')) {
            $element.attr('tabindex', $element.attr('data-tabindex'));
            $element.removeAttr('data-tabindex');
        } else {
            $element.removeAttr('tabindex');
        }
    }

    function disablePageTabbing(){
        $('a, input, select, textarea, button, *[tabindex]').each(disableElementTabbing);
    }
    function enablePageTabbing($container){
        $container.find('*[tabindex]').each(enableElementTabIndex);
    }

    function focusOnLightboxLink(link){
        if (!link) { return; }
        link.focus();
    }
    function focusOnCloseButton($lightboxLink, $closeIcon){
        if ($lightboxLink.hasClass(keyboardFocus.className)) {
            keyboardFocus.apply($closeIcon[0]);
        }else{
            $closeIcon[0].focus();
        }
    }

    function hideBodyScrollBar(){
        $('body').css( {
            'overflow':		'hidden',
            'padding-right': scrollbarWidth + 'px'
        });
    }
    function showBodyScrollBar(){
        $('body').removeAttr('style');
    }

    function Lightbox(id, $lightboxLink, options){
        var $element = $('#' + id.replace('lightbox/',''));

        this.id = id;
        this.$container = ($element.hasClass(classes.main)) ? $element : $element.closest('.' + classes.main);
        this.$contents = (this.$container.length) ? this.$container.find('.' + classes.content) : $element ;
        this.$closeIcon = this.$container.find('.' + classes.closeButton);
        this.$lightboxLink = $lightboxLink;

        if (!this.$container.length){
            this.create();
            this.bindEvents();
        }
        if (options){
            this.onShow = options.onShow;
            this.onClose = options.onClose;
        }
    }

	Lightbox.prototype = {
		bindEvents: function() {
            hash.register([this.id],this.open.bind(this) );

            this.$lightboxLink.on("click", this.open.bind(this));
            this.$container.on("click", this.close.bind(this));
			this.$closeIcon.on("click", this.close.bind(this));
			this.$contents.on("click", function(e) { return false; });
		},

        create: function(){
            var $contents = this.$contents,
                $parent = this.$contents.parent(),
                $lightboxDiv = $('<div class="' + classes.main + '"></div>'),
                $container = $('<div class="skycom-container lightbox-container clearfix"></div>'),
                $close = $('<a class="internal-link ' + classes.closeButton + ' skycon-close" href="#!"><span class="speak">Close</span></a>');

            $contents.addClass(classes.content + ' skycom-10 skycom-offset1').attr('role','dialog');
            $contents.prepend($close);

            $container.append($contents);
            $lightboxDiv.append($container);
            $parent.append($lightboxDiv);

            this.$container = $lightboxDiv;
            this.$closeIcon = $close;
        },

		open: function() {
            if (this.$container.hasClass(classes.open)) { return ; }
            if (this.onShow){
                this.onShow();
            }
            hideBodyScrollBar();

			this.$container.addClass(classes.open);

            focusOnCloseButton(this.$lightboxLink, this.$closeIcon);
            disablePageTabbing();
            enablePageTabbing(this.$container);
		},

		close: function(event) {
            var lightbox = this;
			event.preventDefault();
            if (this.$container.hasClass(classes.closing)) { return ; }

            this.$container.addClass(classes.closing);
            hash.remove();

            window.setTimeout(function() {
                lightbox.$container.removeClass(classes.open + ' ' + classes.closing);
                focusOnLightboxLink(lightbox.$lightboxLink);
                showBodyScrollBar();
                enablePageTabbing($('body'));
                if (lightbox.onClose){
                    lightbox.onClose();
                }
            }, 500);
		}
	};

	$.fn.lightbox = function(options) {
		return this.each(function() {
			var lb = new Lightbox($(this).attr('href').replace('#!',''),$(this), options);
		});
	};

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/lightbox', ['utils/focus', 'utils/hashManager'], function(focus, hash) {
        
        return toolkit.lightbox(jQuery, focus, hash);
    });
} else {
    toolkit.lightbox = toolkit.lightbox(jQuery, toolkit.focus, toolkit.hashManager);
};
if (typeof demo==='undefined') demo={};
demo.displayCode = (function(lightbox){

    function addStyledCode(name, ext, code){
        var $code = $(code.replace(/{{ site.version }}/g,$('#current-version').text()));
        if (ext.indexOf('js')>-1){
            $code = $.parseHTML($code);
        }
        $(document.getElementById(name + ext + '-table')).append($code);
    }
    function addRow(name, ext, lineNumber, code){
        var tableBody = document.getElementById(name + ext + '-table'),
            tr = document.createElement('tr'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td'),
            txt2 = document.createTextNode(lineNumber),
            txt3 = document.createTextNode(code);

        td2.className = 'codekolom';
        td3.className = 'bredecode';
        td2.appendChild(txt2);
        td3.appendChild(txt3);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tableBody.appendChild(tr);
    }

    function DisplayCode(options){
        this.header = options.header;
        this.feature = options.feature;
        this.dir = options.dir;
        this.fileNames = options.fileNames;
        this.styled = options.styled;
        this.$lightboxLink = $('a[href*="#!lightbox/code-' + this.feature + '"]');

        if (!$('#code-' + this.feature).length){
            this.getCode();
        }
    }

    DisplayCode.prototype.getCode = function(){
        this.fileCount = 0;
        this.filesReceived = 0;
        this.getFile(this.dir, 'notes', 'html', true);
        for (var i in this.fileNames){
            this.getFile(this.dir, this.fileNames[i], 'html');
            this.getFile(this.dir, this.fileNames[i], 'notes.html', true);
            this.getFile(this.dir, this.fileNames[i], 'js');
            this.getFile(this.dir, this.fileNames[i], 'require.js');
        }
    };

    DisplayCode.prototype.getFile = function(dir, featureFile, ext, styled){
        this.fileCount++;
        var self = this;
        var dfd = $.ajax({
            crossDomain: true,
            cache: false,
            dataType: 'html',
            url: dir + '/' + featureFile + '.' + ext
        });
        dfd.always(function(data){
            self.filesReceived++;
            self[self.feature + '-' + featureFile + ext] = (typeof data === 'string') ? data : '';
            self.addToPage(featureFile, ext, styled);
        });
    };

    DisplayCode.prototype.addToPage = function(featureFile, ext, styled){
        this.$container = this.$lightboxLink.parent().parent().find('.code-container');
        this.$tabList = this.$container.find('.tabs');

        this.addContainer();
        this.addTab(featureFile,ext, styled);
        this.show(featureFile,ext, styled);
        if (this.fileCount === this.filesReceived){
            $('#code-' + this.feature).inPageNav();
            this.$lightboxLink.lightbox();
        }
    };

    DisplayCode.prototype.addContainer = function(){
        if (this.$container.length){ return ; }

        this.$container = $('<div class="code-container clearfix tabs-container page-nav" data-function="tabs" id="code-' + this.feature + '"><h3 class="code-h3">' + this.header + '</h3><div id="' + this.feature + '-noteshtml-table" class="feature-notes"></div></div>');
        this.$tabList = $('<ul class="tabs clearfix" role="tablist" ><div class="dropdown-tab-select"><a href="#!" aria-controls="dropdown" aria-label="more tabs" class="medium">&hellip;</a><ul class="more-tabs"></ul></div></ul>');
        this.$container.append(this.$tabList);
        this.$lightboxLink.parent().parent().append(this.$container);
    };

    DisplayCode.prototype.createTable = function(featureFile, ext, styled){
        var id = this.feature + '-' + featureFile + ext + '-table';
        if (this.styled || styled){
            return $('<div id="' + id + '" class="styled ' + ext + '"></div> ');
        } else {
            return $('<table class=' + ext + '><thead><tr><th colspan="3">' + ext.toUpperCase() + '</th></tr></thead><tbody id="' + id + '"></tbody></table> ');
        }

    };

    DisplayCode.prototype.addTab = function(featureFile, styled){
        var tabName =  this.feature + '-' + featureFile;
        if (this.$container.find('#' + tabName + '-tab').length){ return ; }
        if(featureFile==='notes'){ return; }

        var $tabListItem = $('<li id="' + tabName + '-tab" aria-controls="' + tabName + '-tab-contents" role="tab" class="tab"><a href="#!' + tabName + '-tab-contents" class="skycom-ellipsis internal-link"><span>' + (featureFile ? featureFile : 'default') + '</span></a></li>');
        this.$tabList.prepend($tabListItem);

        var $tab = $('<div class="tabpanel" id="' + tabName + '-tab-contents" class="tabpanel selected" aria-labeledby="' + tabName + '-tab" role="tabpanel"></div>');
        var $tabContents = $('<section class="tabcontents clearfix"></section>');
        $tabContents.append(this.createTable(featureFile, 'notes.html', styled))
            .append(this.createTable(featureFile, 'html'))
            .append(this.createTable(featureFile, 'require.js'))
            .append(this.createTable(featureFile, 'js'));

        $tab.append($tabContents);
        this.$container.append($tab);

    };

    DisplayCode.prototype.show = function(featureFile, ext, styled){
        var id = this.feature + '-' + featureFile;
        if (this.styled || styled){
            addStyledCode(id, ext, this[id + ext]);
        } else {
            var code = (this[id + ext]) ? this[id + ext].split('\n') : '' ;
            for (var i in code){
                var line = code[i];
                addRow(id, ext, parseInt(i,10) + 1, line);
            }
        }
    };

    return DisplayCode;

});

if (typeof window.define === "function" && window.define.amd) {
    define('demo/displayCode', ['components/lightbox'],function(lightbox) {
        return demo.displayCode(lightbox);
    });
} else {
    demo.displayCode = demo.displayCode(toolkit.lightbox);
};
if (typeof demo==='undefined') demo={};
demo.menu = (function(){

    var menuIsSticky = false;
    var offset = $('#toolkit-menu-tabs').offset().top;
    var hideSubMenuTimeout;

    function bindEvents() {
        $(window).on('scroll', stickMenuToTop);
        $('#toolkit-menu-tabs [role=tablist] li').on('mouseenter mouseleave', toggleSubMenu);
        $('#toolkit-menu-tabs .tabpanel').on('mouseenter mouseleave', toggleSubMenu);
    }

    function toggleSubMenu(e){

        if (e.type==='mouseleave'){
            hideSubMenuTimeout = setTimeout(function(){
                hideAllSubMenus();
                showSeletcedSubMenu();
            },250);
        } else {
            clearTimeout(hideSubMenuTimeout);
            showHoveredSubMenu($('#' + $(this).attr('aria-controls')));
        }
    }

    function hideAllSubMenus(){
        $('#toolkit-menu-tabs .tabpanel').removeClass('selected');
    }

    function showHoveredSubMenu($el){
        if (!$el.length){ return; }
        hideAllSubMenus();
        $el.addClass('selected');
    }

    function showSeletcedSubMenu(){
        $('#toolkit-menu-tabs .tabpanel li.selected').closest('.tabpanel').addClass('selected');
    }

    function stickMenuToTop(){
//        todo: if position:sticky is not supported
        var top = window.scrollY;
        if (menuIsSticky && top<offset){
            menuIsSticky = false;
            $('#toolkit-menu-tabs').removeClass('stick');
            $('h1.demo-header').removeAttr('style');
        } else if (!menuIsSticky && top>offset) {
            menuIsSticky = true;
            $('#toolkit-menu-tabs').addClass('stick');
            $('h1.demo-header').attr('style','padding-bottom:' + $('#toolkit-menu-tabs').height() + 'px');
        }
    }

    bindEvents();

});

if (typeof window.define === "function" && window.define.amd){
    define('demo/menu', [], function() {
        return demo.menu();
    });
} else {
    demo.menu();
}
;
if (typeof demo==='undefined') demo={};
demo.tests = (function(hashManager, lightbox){

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
                showLightbox($('#' +  spec + '-lightbox'));
            })
        };
        document.head.appendChild(script);
    }

    function updateTestsResults($runTestLink, $mocha){
        var findFailure = $mocha.find('.failures em').text();

        if(findFailure === '0'){
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
        showLightbox($('#' +  spec + '-lightbox'));
        $close.add($(lightboxDiv)).on('click', function(e){
            hideLightbox(e, $('#' +  spec + '-lightbox'));
        });
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
        window.toolkit.hashManager.register(hashes, runTest); //todo: this should be just 'hashManager'
    }

    registerTests();

});

if (typeof window.define === "function" && window.define.amd){
    define('demo/tests', ['utils/hashManager', 'components/lightbox'], function(hash, lightbox) {
        return demo.tests(hash, lightbox);
    });
} else {
    demo.tests(toolkit.hash, toolkit.lightbox);
}
;
if (typeof demo==='undefined') demo={};
demo.skycons = (function() {


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

    sortSkyconsTable();

});

if (typeof window.define === "function" && window.define.amd){
    define('demo/skycons',  [],function() {
        return demo.skycons();
    });
} else {
    demo.skycons();
}
;
if (typeof demo==='undefined') demo={};
demo.main = (function(DisplayCode) {

    function bindEvents() {
        $(document).on('click','.toggler', toggle);
        $(document).on('click','.code-download', showCode);
        $('.sky-form').on('submit', checkDiff);
    }

    function checkDiff(e) {
        e.preventDefault();
        var newRouteDir,
            oldVersion = $('#version').val(),
            newVersion = $('#current-version').text(),
            route = 'http://web-toolkit.global.sky.com',
            routeDir = newRouteDir = '_site/_includes';
        if (location.hostname.indexOf('local')===0){
            route = 'http://'+location.host;
            newRouteDir = '../_includes';
        }
        if (oldVersion.split('.').length<3 || (oldVersion.split('.')[0]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.0.0' or higher");
        }
        if (parseFloat(oldVersion,10)===1 || (oldVersion.split('.')[0]==='0')){
            oldVersion = '0.6.9';//get lowest version available
        }
        window.toolkit.diff({
            oldRoute: route + '/' + oldVersion + '/' + routeDir,
            newRoute: route + '/' + newVersion + '/' + newRouteDir
        });
    }

    function showCode(e){
        var styled = false;
        var feature = $(this).attr('href').replace('#!lightbox/code-','');
        var version = $('#current-version').text(),
            host = 'http://web-toolkit.global.sky.com',
            dir = '_site/_includes';
        if (location.hostname.indexOf('local')===0){
            host = 'http://' + location.host;
            dir = '../_includes';
        }
        var featureFiles, codeBase, route;
        if ($(this).attr('data-docs')){
            featureFiles = $(this).attr('data-docs');
            codeBase = feature;
            route = host + '/' + version + '/' + dir + '/' + codeBase;
            styled = true;
        } else {
            featureFiles = $('a[href*="#' + feature + '"]').attr('data-diff-demos');
            codeBase = $('a[href*="#' + feature + '"]').attr('data-diff');
            route = host + '/' + version + '/' + dir + '/' + codeBase;
        }
        new DisplayCode({
            header: $(this).parent().text().replace($(this).text(),'').trim(),
            feature: feature,
            dir: route,
            fileNames: featureFiles.split(','),
            styled: styled
        });
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

    bindEvents();

});

if (typeof window.define === "function" && window.define.amd){
    define('demo', ['demo/displayCode',
        'demo/menu',
        'demo/tests',
        'demo/skycons'], function(displayCode, menu, tests, skycons) {
        return demo.main(displayCode, menu, tests, skycons);
    });
} else {
    demo.main(demo.displayCode, demo.menu, demo.tests, demo.skycons);
}
;