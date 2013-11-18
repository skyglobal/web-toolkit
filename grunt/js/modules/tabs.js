/**
 purpose:
 to automatically hook into the bootstrap html and shows/hides tabs.
 Works based registering the tabs 'hash' with the changeTab function.
 no onclick events needed.
**/
if (typeof toolkit==='undefined') toolkit={};
toolkit.tabs = (function(hash) {
//    todo: probably needs to turn into a jquery plugin so you can have multiple instances of tabs on the same page
//    todo: accessibility check when moving tabs about - perhaps dont have 2 separate lists.
//    todo: move 'more' link to outside the ul

    var $tabContainer = $('section[data-function=tabs]'),
        $tabs = $('section[data-function=tabs] li[role=tab]'),
        $tabTargets = $('section[data-function=tabs] div[role=tabpanel]'),
        $showMore = $('section[data-function=tabs] .dropdown-tab-select > a'),
        $moreTabsContainer = $('section[data-function=tabs] .dropdown-tab-select'),
        $moreTabsLink = $('section[data-function=tabs] .more-tabs');

    var numberOfTabsToShow;

    function bindEvents() {
        hash.register(getHashList(), changeTab);
        $tabs.on('click', function(e){
            changeTab($(this).find('a').attr('href'));
        });
        $showMore.on('click', toggleShowMore);
        $('body').on('click', hideMore);
        $(window).bind('skycom.resizeend',  initTabs);
    }

    function getHashList() {
        var arrHash = [];
        $tabs.each(function(){
            arrHash.push($(this).attr('aria-controls'));    
        });
        return arrHash;
    }

    function saveTabOrder(){
        $tabs.each(function(i){
            $(this).attr('data-position', i);
        });
    }

    function initTabs(){
        moveTabsToList();
        moveTabsToDropdown();
    }

    function changeTab(controlId){
        controlId = controlId.replace('#!','');
        var $thisTab = $("#" + controlId + "-tab"),
            $thisTabTarget = $("#" + controlId);
        $tabTargets.add($tabs).removeClass("selected");
        $thisTab.add($thisTabTarget).addClass('selected');
        initTabs();
    }

    function hideMore(e){
        if ($(e.target).closest($showMore).length) { return; }
        toggleShowMore('hide');
    }
    function toggleShowMore(type){
        var action = ($moreTabsLink.hasClass('dropdown-tab-selected') || type==='hide') ? 'remove' : 'add';
        $showMore.add($moreTabsLink)[action + 'Class']('dropdown-tab-selected');
    }

    function getNumberOfTabsToShow() {
        var containerWidth = $tabContainer.outerWidth(true) -
                $moreTabsContainer.show().outerWidth(true) -
                $tabs.filter('.selected').outerWidth(true) - 10,
            totalWidth = 0,
            numberOfTabs = 0;
        $tabs.not('.selected').attr('style','float:left').each(function () {
            totalWidth += ($(this).outerWidth(true));
            if (totalWidth > containerWidth) { return ; }
            numberOfTabs++;
        });
        $tabs.add($moreTabsContainer).removeAttr('style');
        return numberOfTabs;
    }

    function moveTabsToList() {
        $tabs.each(function (i) {
            $(this).appendTo($tabContainer.find('.tabs'));
        });
        sortTabs($tabContainer.find('.tabs'));
        numberOfTabsToShow = getNumberOfTabsToShow();
    }

    function moveTabsToDropdown() {
        $tabs.not('.selected').each(function (i) {
            if(i < numberOfTabsToShow) { return ; }
            $(this).appendTo($moreTabsLink);
        });
        sortTabs($moreTabsLink);
        $moreTabsContainer.show();
    }

    function sortTabs($el) {
        var list = [];
        $el.find('li').each(function () {
            list.push($(this).attr('data-position'));
        });
        list.sort();
        $.each(list, function () {
            $el.find('li[data-position="'+this+'"]').appendTo($el);
        });
    }

    saveTabOrder();
    bindEvents();
    initTabs();

    return {
        getHashList: getHashList,
        changeTab: changeTab,
        moveTabsToDropdown:moveTabsToDropdown
    };

}(toolkit.hashmanager));

if (typeof window.define === "function" && window.define.amd) {
    define('modules/tabs', ['utils/hashmanager'], function(hash) {
        return toolkit.tabs;
    });
}