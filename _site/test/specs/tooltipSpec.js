function tooltipSpec(tooltip) {

    var describeSpec = 'Tooltip shows and disappears';

          describe(describeSpec, function () {

            it('Tooltip shows on mouse over', function (done) {
                $('#demo-tooltip').trigger('mouseenter');
                setTimeout(function() {
                    expect($('#demo-tooltip .tltp').is(":visible")).to.equal(true);
                    expect($('#demo-tooltip .tltp').css('display')).to.equal('block');
                    done();
                }, 900);
            });

            it('Tooltip disappears on mouse leave with a minimum visible time', function (done) {
                $('#demo-tooltip').trigger('mouseleave');
                setTimeout(function() {
                    expect($('#demo-tooltip .tltp').is(":visible")).to.equal(false);
                    done();
                }, 400);
            });

        });

    return describeSpec;
}

if (window.define) {
    define('specs/tooltipSpec', ['components/tooltip'], function (tooltip) {
            return tooltipSpec(tooltip);
        }
    );
}