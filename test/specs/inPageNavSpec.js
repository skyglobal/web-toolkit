function inPageNavSpec(hash, tabs) {

    var describeSpec = 'Responsive tabs';

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
    define('specs/inPageNavSpec', ['utils/hashManager', 'components/inPageNav'],
        function (hash, tabs) {
            return inPageNavSpec(hash, tabs);
        }
    );
}