function hashManagerSpec(hash){

        describe('Hash Utility', function(){

            it('The window hash will change when calling changeHash', function() {
                hash.change('newHash')
                expect(location.hash).to.equal('#!newHash');
                hash.change('my-this-is-wonderful')
                expect(location.hash).to.equal('#!my-this-is-wonderful');
            });

            it('A hash can be registered to execute a function (async). once.', function(done) {
                var count = 0,
                    callback = function(){
                        count++;
                        expect(count).to.equal(1);
                        done();
                    };
                hash.register(['hash'], callback);

                location.hash = 'hash';

                try {
                    hash.register(['hash'], callback);
                    expect('Error should have been thrown').to.equal(false);
                } catch(e){
                    expect(e.message).to.equal('hashManager: hash (hash) already exists');
                }
            });

        });

        describe('The Hash Manager', function() {

            it('cleans up any occurence of the # character in the hash', function() {
                expect(hash.cleanHash('#news')).to.equal('news');
                expect(hash.cleanHash('#sports')).to.equal('sports');
            });

            it('also cleans up any occurence of the ! character in the hash', function() {
                expect(hash.cleanHash('#!news')).to.equal('news');
                expect(hash.cleanHash('#!sports')).to.equal('sports');
            });
        });

        mocha.run();

}

if (window.define) {
    define('specs/hashManagerSpec', ['utils/hashManager'], function (hash) {
        return hashManagerSpec(hash);
    })
}
