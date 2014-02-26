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
    demo.menu = demo.menu();
}
