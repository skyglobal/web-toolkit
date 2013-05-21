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
        verifyOutputId: 'bootstrap-tracking-verify'
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

    function track(e){
        var s = omniture.s,
            refHref = (document.referrer),
            docHref = (document.location.href).split('?'),
            linkDetails = getTrackingProperties(e);
        s.eVar9 = docHref[0];
        s.prop9 = "D=v9";
        s.prop15 = linkDetails;
        s.eVar7 = "D=c15";
        s.eVar36 = refHref;
        s.prop36 = "D=v36";
        s.linkTrackVars = omniture.vmap['samId'] + ',' +
                          omniture.vmap['linkDetails'] + ',' +
                          omniture.vmap['refDomain'] +
                          omniture.vmap['url'] +
                          ',events';
        s.linkTrackEvents = s.events = omniture.eventMap['linkClick'];

        if (vars.verifying){
            e.preventDefault();
            $('#' + vars.verifyOutputId).html(linkDetails);
            console.log(linkDetails);
        }

        s.trackLink(this,'o','Link Click');
    }

    function verify(on){
        if (on || on === undefined){
            vars.verifying = true;
            $('body').append('<div id="' + vars.verifyOutputId + '"></div>');
        } else {
            vars.verifying = false;
            $('body').remove('#' + vars.verifyOutputId);
        }
    }

    function getTrackingProperties(e){
        function getText($el){
            return $el.attr('data-tracking-label') || $el.attr('alt') || $el.attr('value') || $el.text();
        }

        var $el = $(e.currentTarget),
            textClicked = getText($el),
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id'))),
            theme = $el.attr('data-tracking-theme'),
            other = $el.parents('*[data-tracking-other]').attr('data-tracking-other'),
            pod =  $el.parents('*[data-tracking-pod]').attr('data-tracking-pod'),
            module = $el.parents('*[data-tracking-module]').attr('data-tracking-module');

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
