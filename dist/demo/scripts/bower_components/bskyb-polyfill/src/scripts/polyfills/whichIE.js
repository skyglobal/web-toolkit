
module.exports = function() {

    var nav = navigator.appName,
        version = navigator.appVersion,
        ie = (nav == 'Microsoft Internet Explorer');
    if (ie) {
        var match = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
        version = match ? parseFloat(match[1]) : 0;
    }
    var ieObj = {
        name: nav,
        version: version,
        ie: ie,
        ie12: false,
        ie11: false,
        ie10: false,
        ie9: false,
        ie8: false,
        ie7: false,
        ie6: false
    };
    ieObj['ie' + parseInt(version,10)] = ie;
    window.whichIE = ieObj;

};