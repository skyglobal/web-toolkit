/*
 returns toggle(); function
 this should be passed:
 $elClicked: the element clicked that caused the toggle.
 If this is used, this element could have data-toggle which is the selector of what needs to be toggled.
 If this is used, this element could have data-toggle-state which is either 'hidden' or 'shown'.
 $container: The element to be toggled. Use this if $elClicked and 'data-' attributes have not been used.
 action:      The state to toggle to - 'show' or 'hide'. Use this if $elClicked and 'data-' attributes have not been used.


 */

if (typeof toolkit==='undefined') toolkit={};
toolkit.toggle = (function(detect, event) {

    var hasResized = false,
        hasContentChanged = false,
        elementsToToggle = {},
        hiddenClass = 'toggle-hidden',
        supportTransition = detect.css('transition');

    function animate($el, to) {
        if (supportTransition) {
            $el.css({'height':to, overflow:'hidden', 'transition': 'height 0.5s ease-in-out'});
        }
        $el.toggleClass(hiddenClass, (to === 0));
        return $el;
    }

    function setOpenHeight($el){
        var hasHeight = false;
        if(!supportTransition) return;
        if ($el.attr('style')){
            var styles = ($el.attr('style').split(';'));
            for (var i in styles){
                if (styles[i].trim().indexOf('height')===0){
                    hasHeight = true;
                }
            }
            if (hasHeight){ return; }
        }
        $el.css({'height':getOpenHeight($el)});
    }

    function getOpenHeight($el) {
        if ($el.data('openHeight') !== undefined && !hasResized && !hasContentChanged) {
            return $el.data('openHeight');
        }

        $el.parent()
            .append($('<div id="toggle-tmp-height"></div>')
            .append($el.clone().attr('style', '').removeClass(hiddenClass + ' transition ')));
        $('#toggle-tmp-height > div').append('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        $('#toggle-tmp-height > div').prepend('<div class="toggle-clearfix-div clearfix clear" style="padding:1px"></div> ');
        
        var openHeight  = $('#toggle-tmp-height > div').height() - 2;

        if($el.find('img').length > 0){
            var originalHeightWithImages = $el.find('.accordion-content').outerHeight() - 2;
            if(openHeight < originalHeightWithImages){
                openHeight = originalHeightWithImages;
            }
        }

        $el.data('openHeight', openHeight);

        $('#toggle-tmp-height').remove();
        $('.toggle-clearfix-div').remove();

        return openHeight;
    }

    function containsSafeHtmlTags(text){
        var allTags = /<\w+>.+?<\/\w+>|<.+\/?>/;
        var $text = $(text);
        if(($text.html().match(allTags) || []).length === $text.find('strong','b','i','em').length) {
            return true;
        } else {
            return false;
        }
    }

    function updateText($elClicked) {
        if (!$elClicked.attr('data-toggle-text')) {
            return;
        }

        var $spans =  $elClicked.find('span');
        var $textElement = $spans.length > 0 ? $spans.first() : $elClicked;

        var oldText = containsSafeHtmlTags($textElement) ? $textElement.html() : $textElement.text();
        
        if(containsSafeHtmlTags($textElement) === true){ 
            $textElement.html($elClicked.attr('data-toggle-text'));
        } else { 
            $textElement.text($elClicked.attr('data-toggle-text'));
        }
        
        $textElement.html($elClicked.attr('data-toggle-text'));
        $elClicked
            .attr('data-toggle-text', oldText)
            .attr('data-tracking-label', oldText);
    }

    function show($elToToggle) {
        var openHeight = getOpenHeight($elToToggle);
        animate($elToToggle, openHeight);
    }

    function hide($elToToggle) {
        setOpenHeight($elToToggle);
        animate($elToToggle, 0);
    }

    function updateToggledElements(state, $elementToToggle) {
        if (state == 'shown') {
            elementsToToggle[$elementToToggle.selector] = {state:state, $elementToToggle:$elementToToggle};
        } else {
            delete elementsToToggle[$elementToToggle.selector];
        }
    }

    function toggle(options) {
        var $elClicked = options.$elClicked,
            $elementToToggle = options.$container || $($elClicked.attr('data-toggle')),
            action = options.action,
            state = $elClicked && $elClicked.attr('data-toggle-state');
        hasContentChanged = (options.contentChanged !== undefined) ? options.contentChanged : false;
        if (state === 'shown' || action == 'hide') {
            hide($elementToToggle);
            state = 'hidden';
        } else {
            show($elementToToggle);
            state = 'shown';
        }
        updateToggledElements(state, $elementToToggle);
        if (!$elClicked) {
            $elClicked = $('[data-toggle="#' + $elementToToggle.attr('id') + '"]');
        }
        if ($elClicked && state !== $elClicked.attr('data-toggle-state')) {
            updateText($elClicked, state);
            $elClicked.attr('data-toggle-state', state);
        }

    }

    event.on(window,'resizeend', function () {
        hasResized = true;
        var item, i;
        for (i in elementsToToggle) {
            item = elementsToToggle[i];
            if (item.state === 'shown') {
                var openHeight = getOpenHeight(item.$elementToToggle);
                animate(item.$elementToToggle, openHeight);
            }
        }
        hasResized = false;
    });

    return toggle;

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/toggle', ['bower_components/bskyb-core/dist/scripts/core.requirejs'], function(core) {
        toolkit.toggle = toolkit.toggle(core.detect, core.event);
        return toolkit.toggle;
    });
} else {
    toolkit.toggle = toolkit.toggle(skyComponents.detect, skyComponents.event);
}
