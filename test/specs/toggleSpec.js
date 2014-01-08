function toggleSpec(toggle) {

    var describeSpec = 'Toggling elements visibility';

    if(!toggle) { //needed for running tests in demo page
        toggle = toolkit.toggle;
    }

    describe(describeSpec, function () {

        it('can toggle based on the element that was clicked on', function (done) {
            var container = $('#toggle-by-element .edit-container');
            var toggleLink = $("#toggle-by-element .toggle-link");

            expect(container.hasClass('toggle-hidden')).to.equal(false);

            toggle({$elClicked:toggleLink});
            expect(toggleLink.attr("data-toggle-state")).to.equal("hidden");
            expect(toggleLink.attr("data-toggle-text")).to.equal("Hide");
            expect(toggleLink.attr("data-tracking-label")).to.equal("Hide");
            expect(toggleLink.text()).to.equal("Show");
            expect(container.hasClass('toggle-hidden')).to.equal(true);
            setTimeout(function() {
                expect(container.height()).to.equal(0);
                toggle({$elClicked:toggleLink});
                setTimeout(function () {
                    expect(toggleLink.attr("data-toggle-state")).to.equal("shown");
                    expect(toggleLink.attr("data-toggle-text")).to.equal("Show");
                    expect(toggleLink.attr("data-tracking-label")).to.equal("Show");
                    expect(toggleLink.text()).to.equal("Hide");
                    expect(container.hasClass('toggle-hidden')).to.equal(false);
                    expect(container.height()).to.equal(40);
                    done();
                }, 600);
            }, 600);



        });

        it("when passing a specific toggle action i.e. hide or show", function () {
            var container = $('#toggle-by-element .edit-container');
            var toggleLink = $("#toggle-by-element .toggle-link");

            toggle({$container:container, action:'hide'});
            expect(toggleLink.text()).to.equal("Show");

            toggle({$container:container, action:'show'});
            expect(toggleLink.text()).to.equal("Hide");

        });

    });

    return describeSpec;
}

if (window.define) {
    define('specs/toggleSpec', ['utils/toggle'], function (toggle) {
            return toggleSpec(toggle);
        }
    );
}