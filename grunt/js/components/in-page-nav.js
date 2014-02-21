/**
 purpose:
 to automatically hook into the bootstrap html and shows/hides tabs.
 Works based registering the tabs 'hash' with the changeTab function.
 no onclick events needed.
**/
if (typeof toolkit==='undefined') toolkit={};
toolkit.inPageNav = (function(hash, event) {
//    todo: accessibility check when moving tabs about - perhaps dont have 2 separate lists.
//    todo: move 'more' link to outside the ul

    function InPageNav($element){
        this.$tabContainer = $element;
        this.$tabList = $element.find('ul.tabs');
        this.$tabs = $element.find('li[role=tab]');
        this.$tabTargets = $element.find('div[role=tabpanel]');
        this.$showMore = $element.find('.dropdown-tab-select .selector');
        this.$moreTabsContainer = $element.find('.dropdown-tab-select');
        this.$moreTabsLink = $element.find('.more-tabs');
        this.numberOfTabsToShow = 0;

        this.tabSizes = {};

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

            this.$tabs.find('a').on('focus', function() {
                var target = $(this).closest('li');

                if (target.hasClass('dropped')) {
                    var widthNeeded = self.tabSizes[target.attr('id')];
                    var widthGained = 0;

                    $.each(self.tabSizes,function(i,n) {
                        widthGained += n;

                        self.$tabs.filter('#'+i).addClass('dropped-during-interaction');

                        if (widthGained >= widthNeeded)  {
                            return false;
                        }
                    });
                }
                target.addClass('given-focus');

            }).on('blur', function() {
                $(this).closest('li').removeClass('given-focus');
                self.$tabs.filter('.dropped-during-interaction').removeClass('dropped-during-interaction');
            });

            this.$showMore.on('click', function(e){
                e.preventDefault();
                self.toggleShowMore();
            });
            $('body').on('click', this.hideMore.bind(self));
            event.on(window,'resizeend',  this.initTabs.bind(self));
        },

        getHashList: function() {
            var arrHash = [], hash;
            this.$tabs.each(function(){
                hash=this.getAttribute('aria-controls');
                if(hash) {
                    arrHash.push(hash);
                }
            });
            return arrHash;
        },

        saveTabOrder: function(){
            var self = this;
            this.$tabs.each(function(i){

                self.tabSizes[this.id] = $(this).outerWidth(true);

                $(this).attr('data-position', i);
            });

            console.log(this.tabSizes);
        },

        initTabs: function(){
            this.numberOfTabsToShow = this.getNumberOfTabsToShow();
            this.replicateTabsForDropdown();

            this.setTabVisibility();

//            if (!this.$tabTargets.filter('.selected').length){
//                this.changeTab(this.$tabTargets.first()[0].id);
//            }
        },

        changeTab: function(controlId){
            controlId = controlId.replace('#!','');
            var $thisTab = $("#" + controlId.replace('-tab-contents','') + "-tab"),
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

        replicateTabsForDropdown: function() {
          this.$moreTabsLink.append(this.$tabs.clone(true));
          this.$moreTabsContainer.show();
        },

        setTabVisibility: function() {
          this.$tabList.find('li:gt('+this.numberOfTabsToShow+')').addClass('dropped');
          this.$moreTabsLink.find('li:lt('+(this.numberOfTabsToShow+1)+')').addClass('dropped');
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
            new InPageNav($(this));
        });
    };

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/in-page-nav', ['utils/hash-manager','utils/event'], function(hash, event) {
        toolkit.inPageNav = toolkit.inPageNav(hash, event);
        return toolkit.inPageNav;
    });
} else {
    toolkit.inPageNav = toolkit.inPageNav(toolkit.hashManager, toolkit.event);
}