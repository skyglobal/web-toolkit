function inPageNavSpec(hash, tabs){

    require(['utils/hashmanager', 'components/inPageNav'],function(hash, tabs){

        $('.tabs-container').inPageNav();

        describe('Test responsive tabs', function() {

            it('check change tab removes class and adds classes for the correct controlID', function(){
                expect($('#first-tab').hasClass('selected')).to.equal(true);
                $('#first-tab').click();
                expect($('#first-tab').hasClass('selected')).to.equal(true);
                expect($('#second-tab').hasClass('selected')).to.equal(false);
                $('#fourth-tab').click();
                expect($('#first-tab').hasClass('selected')).to.equal(false);
                expect($('#third-tab').hasClass('selected')).to.equal(false);
                expect($('#fourth-tab').hasClass('selected')).to.equal(true);
            });

        });
        mocha.run();
    });

}

if (window.define) {
    define('specs/inPageNavSpec', ['utils/hashmanager', 'components/inPageNav'], function (hash, tabs) {
        return inPageNavSpec(hash, tabs);
    })
}
