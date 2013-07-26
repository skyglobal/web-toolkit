/**
 purpose:
 to automatically hook into the bootstrap html and shows/hides tabs.
 Works based registering the tabs 'hash' with the changeTab function.
 no onclick events needed.
**/
if (typeof toolkit==='undefined') toolkit={};
toolkit.tabs = (function(hash) {

    var $el = {
        tabContainer: $('section[data-function=tabs]'),
        tabs: $('section[data-function=tabs] li[role=tab]'),
        tabTargets: $('section[data-function=tabs] div[role=tabpanel]')
    };
    var vars = {
        rememberState : $el.tabContainer.attr('data-remember-state')==='true'
    };

    function bindEvents() {
        if (vars.rememberState){
            hash.register(getHashList(), changeTab);
        } else {
            $el.tabs.on('click', function(e){
                e.preventDefault();
                changeTab($(this).find('a').attr('href'));
            });
        }
    }

    function getHashList() {
        var arrHash = [];
        $el.tabs.each(function(){
            arrHash.push($(this).attr('aria-controls'));
        });
        return arrHash;
    }

    function changeTab(controlId){
        $el.tabTargets.add($el.tabs).removeClass("selected");
        $('#' + controlId + '-tab').add($("#" + controlId))
            .addClass('selected');
    }

    bindEvents();

    return {
        getHashList: getHashList,
        changeTab: changeTab
    };

}(toolkit.hashmanager));


if (typeof window.define === "function" && window.define.amd) {
    define('modules/tabs', ['utils/hashmanager'], function() {
        return toolkit.tabs;
    });
}