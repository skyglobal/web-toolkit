function toolTipSpec(tooltip) {

    var describeSpec = 'Tooltip shows and disappears';

          describe(describeSpec, function () {

            it('Tooltip shows on mouse over', function (done) {
                $('#tooltip').trigger('mouseenter');
                expect($('#content1234').is(":visible")).to.equal(true);
                expect($('#content1234').attr('class')).to.be.equal('tltp','tltp class not added to tooltip content');
                done();
            });

            it('Tooltip disappears on mouse leave with a minimum visible time', function (done) {
                $('#tooltip').trigger('mouseleave');
                setTimeout(function() {
                    expect($('#content1234').is(":visible")).to.equal(false);
                    done();
                }, 1900);
            });

        });

    return describeSpec;
}

if (window.define) {
    define('specs/toolTipSpec', ['components/tooltip'], function (tooltip) {
            return toolTipSpec(tooltip);
        }
    );
}