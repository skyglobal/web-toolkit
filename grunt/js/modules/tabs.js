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
        tabTargets: $('section[data-function=tabs] div[role=tabpanel]'),
        showMore: $('section[data-function=tabs] ul[role=tablist] .dropdown-tab-select a'),
        dropdownTab: $('section[data-function=tabs] ul[role=tablist] .dropdown-tab-select ul.dropdown-tab-info')
    };
    var vars = {
        rememberState : $el.tabContainer.attr('data-remember-state')==='true',
        hasSwitchedOut: false,
        sortDropdown: [],
        sortTabs: []
    };

    function bindEvents() {
        if (vars.rememberState){
            hash.register(getHashList(), changeTab);
            $el.showMore.on('click', function(e){
                e.preventDefault();
                showMore($(this));
            });
            $('body').on('click', function (e) {
                if (!$(e.target).closest($el.showMore).length) {
                    $($el.showMore).parent("div").children("ul").removeClass('dropdown-tab-selected');
                    $($el.showMore).removeClass('dropdown-tab-selected');
                }
            }); 
            $el.tabs.on('click', function (e) {
                if($(e.target).parents('.dropdown-tab-info').length) {
                    console.log(e.target);
                }
            });
            $(document).ready(function () {
                changeTabList();
                showAndHideDots();
            });
            $(window).bind('skycom.resizeend', function () {
                changeTabList();
                showAndHideDots();
            });
        } else {
            $el.tabs.on('click', function(e){
                e.preventDefault(); 
                changeTab($(this).find('a').attr('href'));
            });
            $el.showMore.on('click', function(e){
                e.preventDefault();
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
        $this = $("#" + controlId + "-tab");
        if($this.parents().is("ul.dropdown-tab-info")) {
            if (vars.hasSwitchedOut) {
                $($("ul.tabs").children("li").first()).appendTo('.dropdown-tab-info');
                $this.insertBefore($('ul.tabs').children("li").first());
                sortDropdown();
                vars.hasSwitchedOut = true;
            }
            else{
                console.log("dropdown-tab-info");
                $($("ul.tabs").children("li").last()).prependTo('.dropdown-tab-info');
                $this.insertBefore($('ul.tabs').children("li").first());
                sortDropdown();
                vars.hasSwitchedOut = true;
            }
        } else {
            if (vars.hasSwitchedOut) {
                $($("ul.tabs").children("li").first()).appendTo('.dropdown-tab-info');
                $('.dropdown-tab-info').children("li").first().insertAfter($('ul.tabs').children("li").last());
                sortDropdown();
                vars.hasSwitchedOut = false;
                }
            }
        
    }

    function showMore(showMoreID){
        if ($(showMoreID).parent("div").children("ul").hasClass('dropdown-tab-selected')) {
            $($el.showMore).removeClass('dropdown-tab-selected');
            $(showMoreID).parent("div").children("ul").removeClass('dropdown-tab-selected');
        } else {
            $($el.showMore).addClass('dropdown-tab-selected');
            $(showMoreID).parent("div").children("ul").addClass('dropdown-tab-selected');
        }
    }

    function showAndHideDots() {
        $('.dropdown-tab-info').each(function () {
            if(!$(this).children('li').length) {
                $(this).parent('div').hide();
            }
        });
    }

    function getNumberOfTabs() {
        $containerWidth = $el.tabContainer.width();
        totalWidth = 0;
        numberOfTabs = 0;
        $('.tabs [id$=-tab]').each(function () {
            totalWidth += ($(this).find('a span').innerWidth() + 30);
            // if $totalWidth is more than $containerWidth then break out
            if(totalWidth < $containerWidth) {
                numberOfTabs++;
            } else if (totalWidth > $containerWidth) {
                return numberOfTabs;
            }
        });
        return numberOfTabs;
    }

    function getNumberOfTabsClicked(e) {

    }

    function moveTabsToDropdown(numberOfTabs) {
        i = 0;
        $('.tabs').children('li').each(function () {
            // this moves any lis which should not be in the main tab
            if(i >= numberOfTabs) {
                $(this).appendTo('.dropdown-tab-info');
                sortDropdown();
                $('.dropdown-tab-select').show(); 
            } else {
                i++;
            }
        });
    }


    function changeTabList() {

        //get width of li elements up to limit
        numberOfTabs = getNumberOfTabs();
        
        //do another loop to start at the numberOfTabs allowed index, and move any after into the dropdown
        moveTabsToDropdown(numberOfTabs);

        // remove any li's which can fit
        if (numberOfTabs >= ($('.tabs').children('li').length + 1)) {
            $('.dropdown-tab-info li').first().insertBefore('.tabs div.dropdown-tab-select');
            return false;
        }
    }

    function sortDropdown() {
        vars.sortDropdown = [];
        $('.dropdown-tab-info li').each(function () {
             vars.sortDropdown.push($(this).attr('data-value'));
        });
        vars.sortDropdown.sort();
        $.each(vars.sortDropdown, function () {
            $('.dropdown-tab-info li[data-value="'+this+'"').appendTo('.dropdown-tab-info');
        });
    }

    function sortTabs() {
        vars.sortTabs = [];
        $('.dropdown-tab-info li').each(function () {
             vars.sortTabs.push($(this).attr('data-value'));
        });
        vars.sortTabs.sort();
        $.each(vars.sortTabs, function () {
            $('.dropdown-tab-info li[data-value="'+this+'"').appendTo('.dropdown-tab-info');
        });
    }

    function init() {
        bindEvents();
    }

    return {
        init: init,   
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