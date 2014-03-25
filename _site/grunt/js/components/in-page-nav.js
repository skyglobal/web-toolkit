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
        this.$tabs = $element.find('li[role=tab]');
        this.$tabTargets = $element.find('div[role=tabpanel]');
        this.$showMore = $element.find('.dropdown-tab-select .selector');
        this.$moreTabsContainer = $element.find('.dropdown-tab-select');
        this.$moreTabsLink = $element.find('.more-tabs');

        this.tabSizes = {};
        this.tabStates = [];

        this.setTabStates();
        this.bindEvents();
        this.initTabs();
    }

    InPageNav.prototype = {
        setTabStates: function(){
            var self = this;
            this.$tabs.each(function(){
                self.tabSizes[this.id] = $(this).outerWidth(true);

                var obj = $(this);
                var dropdownObj = obj.clone(true)
                    .removeClass('selected')
                    .removeAttr('aria-controls')
                    .removeAttr('aria-label')
                    .removeAttr('role')
                    .attr('aria-hidden','true');

                self.tabStates.push({
                  id: this.id,
                  obj: obj,
                  dropdownObj: dropdownObj,
                  size: obj.outerWidth(true),
                  selected: obj.hasClass('selected'),
                  dropped: false
                });

                self.$moreTabsLink.append(dropdownObj);
            });
        },

        getSelectedTab: function() {
            var selected = null;

            $.each(this.tabStates,function(i,tab) {
                if (tab.selected) {
                    selected = tab;
                    return false;
                }
            });

            return selected;
        },

        setSelectedTab: function(id) {
            var selected = null;

            $.each(this.tabStates,function(i,tab) {
                tab.selected = tab.id == id;
                if (tab.id == id) {
                    selected = tab;
                }
            });

            return selected;
        },

        getDroppedTabs: function() {
            var selected = [];

            $.each(this.tabStates,function(i,tab) {
                if (tab.dropped) {
                    selected.push(tab);
                }
            });

            return selected;
        },

        setDroppedTabs: function() {
            var dropDownIconWidth = this.$moreTabsContainer.show().outerWidth(true) || 44;
            var containerWidth = this.$tabContainer.outerWidth(true) - dropDownIconWidth - 2;
            var totalWidth = 0;

            if (this.getSelectedTab()) {
                totalWidth += this.$tabs.filter('#'+this.getSelectedTab().id).outerWidth(true);
            }

            $.each(this.tabStates,function(i,n) {
                if (!n.selected) {
                    totalWidth += n.size;
                    n.dropped = (totalWidth > containerWidth);
                }
            });
        },

        bindEvents: function(){
            var self = this;
            hash.register(this.getHashList(), this.changeTab.bind(self));

            this.$tabs.on('click', function(){
                self.changeTab($(this).find('a').attr('href'));
            });

            this.$moreTabsContainer.find('li').on('click', function(){
                self.changeTab($(this).find('a').attr('href'));
            });

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
            this.setDroppedTabs();
            this.setTabVisibility();
            this.setDropdownVisibility();
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
            controlId = controlId.replace(/^#!{0,1}/,'');

            var $thisTab = $("#" + controlId.replace('-tab-contents','') + "-tab");
            var $thisTabTarget = $("#" + controlId);

            this.$tabs.filter('.dropped-during-interaction').removeClass('dropped-during-interaction');
            this.$tabTargets.add(this.$tabs).removeClass("selected");

            this.setSelectedTab(controlId+'-tab');

            $thisTab.add($thisTabTarget).addClass('selected');

            if ($thisTab.hasClass('dropped')) {
                this.setDroppedTabs();
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

        setTabVisibility: function() {
            $.each(this.tabStates,function(i,tab) {
                if (tab.dropped && !tab.selected) {
                    tab.obj.addClass('dropped');
                    tab.dropdownObj.removeClass('dropped');
                } else {
                    tab.obj.removeClass('dropped');
                    tab.dropdownObj.addClass('dropped');
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

            $.each(self.tabStates,function(i,tab) {
                widthGained += tab.size;

                tab.obj.addClass('dropped-during-interaction');

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