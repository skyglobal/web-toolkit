if (typeof skytoolkit==='undefined') skytoolkit={};

skytoolkit['tracking'] = function(omniture){

    var vars = {
        verifying: false,
        verifyOutputId: 'bootstrap-tracking-verify',
        siteName: safeString($('#skycom-nav li.selected > a').text()),
        events:[],
        loadEvents:[],
        variables:{}
    };

    function setPageConfig(config){
        //addCustomPageTrackingEvents();
        omniture.pageView ( config, "false" );
    }
    function resetPageConfig(config){
        addCustomPageTrackingEvents();
        omniture.pageView ( config, "true" );
    }

    function bindEvents(selector, evnt){
        selector = selector || 'input[type=submit], button, a, *[data-track]';
        evnt = evnt || 'click';
        $('body').find(selector).on(evnt, track);
    }

    function logTracking(type, prop, val){
        if (!vars.verifying){ return; }
        if (type=='start'){
            val.preventDefault();
            console.group(prop);
            $('#' + vars.verifyOutputId).html('');
        } else if (type=='end'){
            console.groupEnd();
        } else {
            console.log(prop +': ', val);
            $('#' + vars.verifyOutputId).append('<div class="' + prop + '">' + prop +': ' + val + '</div>');
        }
    }

    function addCustomTrackingEvents($el){
      var customEvent = $el.attr('data-tracking-custom-event');
      if (!customEvent) return;
      var event;
      for (event in vars.events){
        addTrackingEvents(vars.events[event]);
      }
    }

    function addCustomPageTrackingEvents(){
      var i;
      for (i in vars.loadEvents){
        addTrackingEvents(vars.loadEvents[i]); 
      }
    }

    function addCustomTrackingVars($el){
      var customVariable = $el.attr('data-tracking-custom-variable');
      var value = getText($(vars.variables[customVariable]));
      if (!customVariable) return;
      addTrackingVars(customVariable,value);
    }

    function addTrackingEvents(prop){
        if (omniture.s.events.length>0) omniture.s.events += ',';
        omniture.s.events += omniture.eventMap[prop];
        omniture.s.linkTrackEvents = omniture.s.events;
        logTracking('events', prop);
    }

    function addTrackingVars(prop, val){
        if(val){
          if (omniture.vmap[prop].length==1){
            omniture.s[omniture.vmap[prop][0]] = val;
          } else {
            var map = 'D=' + omniture.vmap[prop][1].replace('eVar','v').replace('prop','c');
            omniture.s[omniture.vmap[prop][0]] = map;
            omniture.s[omniture.vmap[prop][1]] = val;
          }
        }
        omniture.s.linkTrackVars += ',' + omniture.vmap[prop];
        logTracking('prop',prop, val);
    }

    function track(e){
        resetOmniture();
        logTracking('start','tracking event', e);
        var refDomain = document.referrer,
            url = document.location.href.split('?')[0],
            $el = $(e.currentTarget),
            context;

        addTrackingEvents('linkClick');
        addTrackingVars('events')
        addTrackingVars('siteName', vars.siteName);
        addTrackingVars('linkDetails', getTrackingProperties($el));
        addTrackingVars('refDomain', refDomain);
        addTrackingVars('url', url);

        addCustomTrackingVars($el);
        addCustomTrackingEvents($el);

        if ($el.attr('data-tracking-search')){
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id')));
            addTrackingVars('searchType', $el.attr('data-tracking-search'));
            addTrackingVars('searchTerms', context);
            addTrackingEvents('search');
        }

        logTracking('end');
        omniture.s.trackLink(this,'o','Link Click');
    }

    function resetOmniture(){
      omniture.s.linkTrackVars = '';
      omniture.s.events = '';
      omniture.s.linkTrackEvents = '';
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

    function addCustomEvents(events) {
      if (!events) return;
        var i=0,len=events.length, event;
        for(i;i<len;i++){
          event=events[i];
          for (name in event) { 
            objEvent = event[name]
            omniture.eventMap[name] = 'event' + objEvent.event;
            vars.events.push(name);
            if (objEvent.onPageLoad) { 
              vars.loadEvents.push(name); 
            }
          } 
        }
    }

    function addCustomVariables(customVars) {
      if (!customVars) return;
        var i=0,len=customVars.length, 
            value, evar;
        for(i;i<len;i++){
          value = [];
          for (name in customVars[i]) { 
            evar = customVars[i][name] 
            if (evar.var) value.push('eVar' + evar.var);
            if (evar.prop) value.push('prop' + evar.prop);
            omniture.vmap[name] = value;
            vars.variables[name] = evar.valueSelector;
          }
        }
    }

    return function(config){
        addCustomEvents(config.customEvents);
        addCustomVariables(config.customVariables);
        setPageConfig(config);
        bindEvents();
        skytoolkit['tracking'] = {
            verify: verify,
            resetPageConfig: resetPageConfig,
            bind: bindEvents
        };
    }

};

if (typeof window.define === "function" && window.define.amd) {
    window.define("modules/tracking", ['utils/omniture'], function(omniture) {
        skytoolkit['tracking'] = skytoolkit['tracking'](omniture);
        return skytoolkit['tracking'];
    });
} else {
    window.skytoolkit['tracking'] = skytoolkit['tracking'](skytoolkit['omniture']);
}
