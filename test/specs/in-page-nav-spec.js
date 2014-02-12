function inPageNavSpec(hash, tabs) {

    var describeSpec = 'Responsive tabs';


    addScript('components','in-page-nav','sleek-nav');
    var fixtures = {
        'demo-inpage-nav-tabs': document.getElementById('demo-inpage-nav-tabs').outerHTML
    };

    describe(describeSpec, function () {

        it('change tab look when changing tabs', function () {
            $('#first-tab').click();
            expect($('#first-tab').hasClass('selected')).to.equal(true);
            expect($('#fourth-tab').hasClass('selected')).to.equal(false);
            $('#fourth-tab').click();
            expect($('#fourth-tab').hasClass('selected')).to.equal(true);
            expect($('#first-tab').hasClass('selected')).to.equal(false);
        });
        it('will only have one tab selected at a time', function () {
            $('#first-tab').click();
            expect($('#demo-inpage-nav-tabs .tab.selected').length).to.equal(1);
            $('#fourth-tab').click();
            expect($('#demo-inpage-nav-tabs .tab.selected').length).to.equal(1);
        });
    });

    return describeSpec;
}

if (window.define) {
    require(['chai', 'utils/hash-manager', 'components/in-page-nav'],
        function (chai, hash, tabs) {
            window.chai = chai;
            window.assert = chai.assert;
            window.expect = chai.expect;
            window.to = chai.to;
            return inPageNavSpec(hash, tabs);
        }
    );
}