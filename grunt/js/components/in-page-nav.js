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

        this.getTabSizes();
        this.bindEvents();
        this.initTabs();
    }

    InPageNav.prototype = {
        getTabSizes: function(){
            var self = this;
            this.$tabs.each(function(){
                self.tabSizes[this.id] = $(this).outerWidth(true);
            });
        },

        bindEvents: function(){

            var self = this;
            hash.register(this.getHashList(), this.changeTab.bind(self));

            this.$tabs.find('a').on('focus', function() {
                var target = $(this).closest('li');

                if (target.hasClass('dropped')) {
                    self.dropTabsDuringInteraction(target.attr('id'));
                }
                target.addClass('given-focus');

            }).on('blur', function() {
                $(this).closest('li').removeClass('given-focus');
                self.$tabs.filter('.dropped-during-interaction').removeClass('dropped-during-interaction');

                if(self.$tabs.filter('.selected.dropped').length) {
                    self.dropTabsDuringInteraction(self.$tabs.filter('.selected.dropped').attr('id'));
                }
            });

            this.$showMore.on('click', function(e){
                e.preventDefault();
                self.toggleShowMore();
            });

            $('body').on('click', this.hideMore.bind(self));

            event.on(window,'resizeend', this.initTabs.bind(self));
        },

        initTabs: function(){
            this.numberOfTabsToShow = this.getNumberOfTabsToShow();

            console.log(this.$tabs.length);
            console.log(this.numberOfTabsToShow);

            if(this.$tabs.length > this.numberOfTabsToShow) {
                this.replicateTabsForDropdown();
                this.setTabVisibility();
            }

            if (!this.$tabTargets.filter('.selected').length){
                this.changeTab(this.$tabTargets.first()[0].id);
            }
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

        changeTab: function(controlId){
            controlId = controlId.replace('#!','');

            var $thisTab = $("#" + controlId.replace('-tab-contents','') + "-tab");
            var $thisTabTarget = $("#" + controlId);

            this.$tabs.filter('.dropped-during-interaction').removeClass('dropped-during-interaction');
            this.$tabTargets.add(this.$tabs).removeClass("selected");

            $thisTab.add($thisTabTarget).addClass('selected');

            if ($thisTab.hasClass('dropped')) {
                this.numberOfTabsToShow = this.getNumberOfTabsToShow();
                this.setTabVisibility();
            }
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
                    this.$tabs.filter('.selected').outerWidth(true);
            var totalWidth = 0;
            var numberOfTabs = 0;

            $.each(this.tabSizes,function(i,n) {
                totalWidth += n;

                if (totalWidth > containerWidth) {
                    return false;
                }

                numberOfTabs++;
            });

            this.$tabs.add(this.$moreTabsContainer).removeAttr('style');

            return numberOfTabs;
        },

        replicateTabsForDropdown: function() {
          this.$moreTabsLink.empty().append(this.$tabs.clone(true));
          this.$moreTabsContainer.show();
        },

        setTabVisibility: function() {
          this.$tabs.filter('.dropped').removeClass('dropped');

          this.$tabs.filter(':gt('+(this.numberOfTabsToShow-1)+')').addClass('dropped');
          this.$moreTabsLink.find('li:lt('+(this.numberOfTabsToShow)+')').addClass('dropped');
        },

        dropTabsDuringInteraction: function(id) {
            var self = this;
            var widthNeeded = self.tabSizes[id];
            var widthGained = 0;

            $.each(self.tabSizes,function(i,n) {
                widthGained += n;

                self.$tabs.filter('#'+i).addClass('dropped-during-interaction');

                if (widthGained >= widthNeeded)  {
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

});

if (typeof window.define === "function" && window.define.amd) {
    define('components/in-page-nav', ['utils/hash-manager','utils/event'], function(hash, event) {
        toolkit.inPageNav = toolkit.inPageNav(hash, event);
        return toolkit.inPageNav;
    });
} else {
    toolkit.inPageNav = toolkit.inPageNav(toolkit.hashManager, toolkit.event);
}