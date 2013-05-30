/*
    purpose:
    to add automatic tracking the anchors page.
    elements with 'data-tracking' will also be tracked.
    to init the tracking bootstrap['tracking'].init(config) is needed.
    config options are:
        {
            site: "sky/portal/skycom",
            section: "home/BETA/NON_SKY",
            headline: "",
            contentType: "home",
            contentId: "",
            account: "bskybhp,bskybnetworkglobal",
            mpaccount: "bskybhp,bskybmpprod"
        }
    link tracking arrangement (all elements are pipe-delimited):
        module-name i.e. carousel or weather
        pod-name i.e. slide1, controls or monday
        sub-content-other(s) i.e. a sub menu area or related-links. delimited by : if more than one
        editorial-theme i.e. 'sky-atlantic' to group similar pods together that may be spread out during the page or day
        context : to be used when clicking the text does not make it clear what is being actioned
        text clicked
*/
if (!window.bootstrap) bootstrap = {};
bootstrap['tracking'] = (function(omniture){

    var vars = {
        verifying: false,
        verifyOutputId: 'bootstrap-tracking-verify',
        siteName: safeString($('#skycom-nav li.selected a').text())
    };

    function init(pageConfig){
        setPageConfig(pageConfig);
        bindEvents(pageConfig.container);
    }

    function setPageConfig(config){
        omniture.pageView ( config, "false" );
    }
    function resetPageConfig(config){
        omniture.pageView ( config, "true" );
    }

    function bindEvents(container){
        var $container = (container) ? $(container) : $('body');
        $container.find('input[type=submit], button, a, *[data-track]').on('click', track);
    }

    function logTracking(type, prop, val){
        if (!vars.verifying){ return; }
        if (type=='start'){
            val.preventDefault();
            console.group(prop);
            $('#' + vars.verifyOutputId).html();
        } else if (type=='end'){
            console.groupEnd();
        } else {
            console.log(prop +': ', val);
            $('#' + vars.verifyOutputId).append('<div class="' + prop + '">' + prop +': ' + val + '</div>');
        }
    }

    function addTrackVars(prop, val){
        var map = 'D=' + omniture.vmap[prop][1].replace('eVar','v').replace('prop','c');
        omniture.s[omniture.vmap[prop][0]] = map;
        omniture.s[omniture.vmap[prop][1]] = val;
        omniture.s.linkTrackVars += ',' + omniture.vmap[prop];
        logTracking('prop',prop, val)
    }

    function track(e){
        logTracking('start','tracking event', e);
        var refDomain = (document.referrer),
            url = (document.location.href).split('?')[0],
            $el = $(e.currentTarget),
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id'))),
            events = omniture.eventMap['linkClick'];

        omniture.s.linkTrackVars = 'events'
        addTrackVars('siteName', vars.siteName);
        addTrackVars('linkDetails', getTrackingProperties($el));
        addTrackVars('refDomain', refDomain);
        addTrackVars('url', url);
        addTrackVars('samId', '');

        if ($el.attr('data-tracking-search')){
            addTrackVars('searchType', $el.attr('data-tracking-search'));
            addTrackVars('searchTerms', context);
            events += ',' + omniture.eventMap['search'];
        }

        logTracking('prop','events', events);
        omniture.s.linkTrackEvents = omniture.s.events = events;

        logTracking('end');
        omniture.s.trackLink(this,'o','Link Click');
    }

    function verify(on){
        if (on || on === undefined){
            vars.verifying = true;
            $('body').append('<div id="' + vars.verifyOutputId + '"></div>');
        } else {
            vars.verifying = false;
            $('#' + vars.verifyOutputId).remove();
        }
    }

    function getText($el){
        return $el.attr('data-tracking-label') || $el.attr('alt') || $el.attr('value') || $el.text() || $el.attr('name');
    }

    function getTrackingProperties($el){
        var textClicked = getText($el),
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id'))),
            theme =  $el.attr('data-tracking-theme') || $el.parents('*[data-tracking-theme]').attr('data-tracking-theme'),
            other = $el.parents('*[data-tracking-other]').attr('data-tracking-other'),
            pod =  $el.parents('*[data-tracking-pod]').attr('data-tracking-pod'),
            module = $el.parents('*[data-tracking-module]').attr('data-tracking-module');

        if (vars.verifying){
            console.groupCollapsed('linkDetails');
            console.log('module: ', module);
            console.log('pod: ', pod);
            console.log('other: ', other);
            console.log('context: ', context);
            console.log('theme: ', theme);
            console.log('textClicked: ', textClicked);
            console.groupEnd();
        }

        return [
            safeString(module),
            safeString(pod),
            safeString(other),
            safeString(context),
            safeString(theme),
            safeString(textClicked)
        ].join('|');
    }

    function safeString(str){
        if (typeof str === 'undefined') { return ''; }
        return str.trim().replace(/ /g,'-').replace(/[&,\+,:]/g,'').toLowerCase();
    }

    return {
        init: init,
        verify: verify,
        resetPageConfig: resetPageConfig
    };

}(bootstrap['omniture']));

//do this after each bootstrap function temporarily
window.bootstrap['tracking'] = bootstrap['tracking'];
if (typeof window.define === "function" && window.define.amd) {
    window.define("tracking", [], function() {
        return window.bootstrap['tracking'];
    });
}
