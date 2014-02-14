function toggleSpec(toggle) {

    var describeSpec = 'Toggling elements visibility';

    if(!toggle) { //needed for running tests in demo page
        toggle = toolkit.toggle;
    }

    document.body.innerHTML += window.__html__['_site/_includes/utils/toggle/closed-element.html'];
    document.body.innerHTML += window.__html__['_site/_includes/utils/toggle/open-element.html'];

    $('#toggle-by-element-closed .toggle-link').on('click', function() {
        toggle({$elClicked:$(this)});
    });
    $('#toggle-by-element .toggle-link').on('click', function() {
        toggle({$elClicked:$(this)});
    });

    describe(describeSpec, function () {

        it('can toggle based on the element that was clicked on', function () {
            var container = $('#toggle-by-element .edit-container');
            var toggleLink = $("#toggle-by-element .toggle-link");

            expect(container.hasClass('toggle-hidden')).to.equal(false);

            toggle({$elClicked:toggleLink});
            expect(toggleLink.attr("data-toggle-state")).to.equal("hidden");
            expect(toggleLink.attr("data-toggle-text")).to.equal("Hide");
            expect(toggleLink.attr("data-tracking-label")).to.equal("Hide");
            expect(toggleLink.text()).to.equal("Show");
            expect(container.hasClass('toggle-hidden')).to.equal(true);

            toggle({$elClicked:toggleLink});
            expect(toggleLink.attr("data-toggle-state")).to.equal("shown");
            expect(toggleLink.attr("data-toggle-text")).to.equal("Show");
            expect(toggleLink.attr("data-tracking-label")).to.equal("Show");
            expect(toggleLink.text()).to.equal("Hide");
            expect(container.hasClass('toggle-hidden')).to.equal(false);

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
    require(['chai', 'utils/toggle'], function (chai, toggle) {
            window.chai = chai;
            window.assert = chai.assert;
            window.expect = chai.expect;
            window.to = chai.to;
            return toggleSpec(toggle);
        }
    );
}