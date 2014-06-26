if (typeof demo==='undefined') demo={};
demo.menu = (function(inPageNav){

    var menuIsSticky = false;
    var offset = $('#toolkit-menu-tabs').offset().top;
    var hideSubMenuTimeout;

    function initMenu($el) {
        if ($('.more-tabs li', $el).length === 0) {
            $el.inPageNav(); // called only once using the above if condition (is indempodent)
        }
    }

    function initVisibleMenus() {
        initMenu($('#toolkit-menu-tabs .page-nav.primary'));
        initMenu($('#toolkit-menu-tabs .selected .page-nav.secondary'));
    }

    function bindEvents() {
        $(window).on('scroll', stickMenuToTop);
        $('#toolkit-menu-tabs .primary .tab').on('mouseenter activate', toggleSubMenu); // activate is from jquery's scrollspy plugin (see jquery.scrollspy.js)
//        $('#toolkit-menu-tabs').on('mouseleave', toggleSubMenu);
        $('#toolkit-menu-tabs a[href*=#]').click(smoothScroll);
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
        initMenu($el);
    }

    function showSeletcedSubMenu(){
        $el = $('#toolkit-menu-tabs .tabpanel li.selected').closest('.tabpanel');
        $el.addClass('selected');
        initMenu($el);
    }

    function smoothScroll() {
        var href = $.attr(this, 'href');
        href = href.replace(/[#!]/g, "");
//        var menuHeight = href.indexOf('--') === -1 ? 60 : 100; // note: the height of the navigation menu at this time
        var menuHeight = ($('#toolkit-menu-tabs').outerHeight() || 90) + 5;
        $('html, body').animate({
            scrollTop: $('#' + href).offset().top - menuHeight
        }, 500, function () {
            var $href = $('#' + href);
            $href.attr('id', ''); // diffuse it for the href change
            window.location.hash = href;
            $href.attr('id', href);
        });
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

    $(stickMenuToTop); // run on page load

    $(initVisibleMenus);

    bindEvents();

});

if (typeof window.define === "function" && window.define.amd){
    define(['components/in-page-nav'], function(inPageNav) {
        return demo.menu(inPageNav);
    });
} else {
    demo.menu = demo.menu(toolkit.inPageNav);
}
