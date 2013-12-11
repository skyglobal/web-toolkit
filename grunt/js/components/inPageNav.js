/**
 purpose:
 to automatically hook into the bootstrap html and shows/hides tabs.
 Works based registering the tabs 'hash' with the changeTab function.
 no onclick events needed.
**/
if (typeof toolkit==='undefined') toolkit={};
toolkit.inPageNav = (function(hash) {
//    todo: accessibility check when moving tabs about - perhaps dont have 2 separate lists.
//    todo: move 'more' link to outside the ul

    function InPageNav($element){
        this.$tabContainer = $element;
        this.$tabs = $element.find('li[role=tab]');
        this.$tabTargets = $element.find('div[role=tabpanel]');
        this.$showMore = $element.find('.dropdown-tab-select > a');
        this.$moreTabsContainer = $element.find('.dropdown-tab-select');
        this.$moreTabsLink = $element.find('.more-tabs');
        this.numberOfTabsToShow = 0;

        this.saveTabOrder();
        this.bindEvents();
        this.initTabs();
    }

    InPageNav.prototype = {
        bindEvents : function(){
            var self = this;
            hash.register(this.getHashList(), this.changeTab.bind(self));
            this.$tabs.on('click', function(e){
                self.changeTab($(this).find('a').attr('href'));
            });
            this.$showMore.on('click', function(e){
                e.preventDefault();
                self.toggleShowMore();
            });
            $('body').on('click', this.hideMore.bind(self));
            $(window).bind('skycom.resizeend',  this.initTabs.bind(self));
        },

        getHashList: function() {
            var arrHash = [];
            this.$tabs.each(function(){
                arrHash.push($(this).attr('aria-controls'));
            });
            return arrHash;
        },

        saveTabOrder: function(){
            this.$tabs.each(function(i){
                $(this).attr('data-position', i);
            });
        },

        initTabs: function(){
            this.moveTabsToList();
            this.moveTabsToDropdown();
        },

        changeTab: function(controlId){
            controlId = controlId.replace('#!','');
            var $thisTab = $("#" + controlId + "-tab"),
                $thisTabTarget = $("#" + controlId);
            this.$tabTargets.add(this.$tabs).removeClass("selected");
            $thisTab.add($thisTabTarget).addClass('selected');
            this.initTabs();
        },

        hideMore: function(e){
            if ($(e.target).closest(this.$showMore).length) { return; }
            this.toggleShowMore('hide');
        },

        toggleShowMore: function(type){
            var action = (this.$moreTabsLink.hasClass('dropdown-tab-selected') || type==='hide') ? 'remove' : 'add';
            this.$showMore.add(this.$moreTabsLink)[action + 'Class']('dropdown-tab-selected');
        },

        getNumberOfTabsToShow: function() {
            var containerWidth = this.$tabContainer.outerWidth(true) -
                    this.$moreTabsContainer.show().outerWidth(true) -
                    this.$tabs.filter('.selected').outerWidth(true),
                totalWidth = 0,
                numberOfTabs = 0;
            this.$tabs.not('.selected').attr('style','float:left').each(function () {
                totalWidth += ($(this).outerWidth(true));
                if (totalWidth > containerWidth) { return ; }
                numberOfTabs++;
            });
            this.$tabs.add(this.$moreTabsContainer).removeAttr('style');
            return numberOfTabs;
        },

        moveTabsToList: function() {
            var self = this;
            this.$tabs.each(function (i) {
                $(this).appendTo(self.$tabContainer.find('.tabs'));
            });
            sortTabs(this.$tabContainer.find('.tabs'));
            this.numberOfTabsToShow = this.getNumberOfTabsToShow();
        },

        moveTabsToDropdown: function() {
            var self = this;
            this.$tabs.not('.selected').each(function (i) {
                if(i < self.numberOfTabsToShow) { return ; }
                $(this).appendTo(self.$moreTabsLink);
                self.$moreTabsContainer.show();
            });
            sortTabs(this.$moreTabsLink);
        }
    };

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

    $.fn.inPageNav = function() {
        return this.each(function() {
            var inPageNav = new InPageNav($(this));
        });
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/inPageNav', ['utils/hashManager'], function(hash) {
        return toolkit.inPageNav(hash);
    });
} else {
    toolkit.inPageNav = toolkit.inPageNav(toolkit.hashManager);
}