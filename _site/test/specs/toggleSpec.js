define( 'specs/toggleSpec',
    ['utils/toggle'],
    function(toggle){

        describe('Toggling elements visibility', function () {

            it('can toggle based on the element that was clicked on', function () {
                var container = $('#toggle-by-element .edit-container');
                var toggleLink = $("#toggle-by-element .toggle-link");

                expect(container.hasClass('toggle-hidden')).to.be.false;

                toggle({$elClicked:toggleLink});
                expect(toggleLink.attr("data-toggle-state")).to.equal("hidden");
                expect(toggleLink.attr("data-toggle-text")).to.equal("Hide");
                expect(toggleLink.attr("data-tracking-label")).to.equal("Hide");
                expect(toggleLink.text()).to.equal("Show");
                expect(container.hasClass('toggle-hidden')).to.be.true;

                toggle({$elClicked:toggleLink});
                expect(toggleLink.attr("data-toggle-state")).to.equal("shown");
                expect(toggleLink.attr("data-toggle-text")).to.equal("Show");
                expect(toggleLink.attr("data-tracking-label")).to.equal("Show");
                expect(toggleLink.text()).to.equal("Hide");
                expect(container.hasClass('toggle-hidden')).to.be.false;

            });


            it('can toggle by passing the id of the container and state to toggle to', function () {

                var container = $('#toggle-by-container .edit-container');
                var toggleLink = $("#toggle-by-container .toggle-link");

                expect(container.hasClass('toggle-hidden')).to.be.false;

                toggle({$container:container, action:'hide'});
                expect(toggleLink.attr("data-toggle-state")).to.equal("hidden");
                expect(toggleLink.attr("data-toggle-text")).to.equal("Hide");
                expect(toggleLink.attr("data-tracking-label")).to.equal("Hide");
                expect(toggleLink.text()).to.equal("Show");
                expect(container.hasClass('toggle-hidden')).to.be.true;

                toggle({$container:container, action:'show'});
                expect(container.hasClass('toggle-hidden')).to.be.false;
                expect(toggleLink.attr("data-toggle-state")).to.equal("shown");
                expect(toggleLink.attr("data-toggle-text")).to.equal("Show");
                expect(toggleLink.attr("data-tracking-label")).to.equal("Show");
                expect(toggleLink.text()).to.equal("Hide");

            });

            it("only changes the text inside a span if a span exists", function () {
                var container = $('#toggle-by-container .edit-container');
                var toggleLink = $("#toggle-by-container .toggle-link");
                toggle({$container:container, action:'hide'});
                expect(toggleLink.text()).to.equal("Show");
//                expect(toggleLink.find('i').hasClass('rotate-180')).to.be.true;
                toggle({$container:container, action:'show'});
                expect(toggleLink.text()).to.equal("Hide");
                expect(toggleLink.find('i').length).to.equal(1);
//                expect(toggleLink.find('i').hasClass('rotate-180')).to.be.false;
            });

            it('doesnt do anything if the container is already toggled to the state you are trying to change to', function () {

                var container = $('#toggle-already-done .edit-container');
                var toggleLink = $("#toggle-already-done .toggle-link");

                expect(container.hasClass('toggle-hidden')).to.be.false;
                expect(toggleLink.attr("data-toggle-state")).to.equal("shown");
                expect(toggleLink.attr("data-toggle-text")).to.equal("Show");
                expect(toggleLink.attr("data-tracking-label")).to.equal("Show");
                expect(toggleLink.text()).to.equal("Hide");

                toggle({$container:container, action:'show'});
                expect(container.hasClass('toggle-hidden')).to.be.false;
                expect(toggleLink.attr("data-toggle-state")).to.equal("shown");
                expect(toggleLink.attr("data-toggle-text")).to.equal("Show");
                expect(toggleLink.attr("data-tracking-label")).to.equal("Show");
                expect(toggleLink.text()).to.equal("Hide");

            });

        });
});