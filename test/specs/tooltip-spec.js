function tooltipSpec(tooltip) {

    var describeSpec = 'Tooltip shows and disappears';

    document.body.innerHTML += window.__html__['_site/_includes/components/tooltip/default.html'];

    describe(describeSpec, function () {

    it('Tooltip shows on mouse over', function (done) {
        $('#demo-tooltip').trigger('mouseenter');
        setTimeout(function() {
            expect($('#demo-tooltip .tooltip-content').is(":visible")).to.equal(true);
            expect($('#demo-tooltip .tooltip-content').css('display')).to.equal('block');
            done();
        }, 600);
    });

    it('Tooltip disappears on mouse leave with a minimum visible time', function (done) {
        $('#demo-tooltip').trigger('mouseleave');
        setTimeout(function() {
            expect($('#demo-tooltip .tooltip-content').is(":visible")).to.equal(false);
            done();
        }, 600);
    });

    });

    return describeSpec;
}

if (window.define) {
    require(['chai', 'components/tooltip'], function (chai, tooltip) {

            window.chai = chai;
            window.assert = chai.assert;
            window.expect = chai.expect;
            window.to = chai.to;

            return tooltipSpec(tooltip);
        }
    );
}