define(['chai', 'smoax'], function(chai) {

    function uiSetup(headElement) {
        var styles = ['vendor/mocha.css', 'main.css'];
        var body = document.getElementsByTagName('body').item(0);
        var div = document.createElement('div');
        var linkElement, i;

        for (i in styles) {
            linkElement = document.createElement('link');
            linkElement.setAttribute('rel', 'stylesheet');
            linkElement.setAttribute('href', styles[i]);
            headElement.appendChild(linkElement);
        }

        div.setAttribute('id', 'mocha');
        body.appendChild(div);

        $(body).prepend(
            $('<a href="#" id="toggleView">Toggle view</div>').click(function(e) {
                e.preventDefault();
                $('#spec-markup').toggle();
            })
        );
    }

    // PhantomJS had some problem if should is set as a global variable and was timing out
    // window.should = should

    window.chai = chai;
    window.assert = chai.assert;
    window.expect = chai.expect;
    window.to = chai.to;

    uiSetup(document.getElementsByTagName('head')[0]);
    mocha.setup('bdd');
    mocha.setup({ignoreLeaks: true}); //otherwise mocha complains about jquery and moment being globals
});