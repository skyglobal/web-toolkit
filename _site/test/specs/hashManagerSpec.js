function hashManagerSpec(hash) {

    var describeSpec = 'Hash Utility';

    if (!hash){ //needed for running test in demo page
        hash = toolkit.hashManager;
    }

    describe(describeSpec, function () {

        it('cleans up any occurence of the # character in the hash', function () {
            expect(hash.cleanHash('#news')).to.equal('news');
            expect(hash.cleanHash('#sports')).to.equal('sports');
        });

        it('also cleans up any occurence of the ! character in the hash', function () {
            expect(hash.cleanHash('#!news')).to.equal('news');
            expect(hash.cleanHash('#!sports')).to.equal('sports');
        });

        it('Will execute an assigned function when the documents hash changes', function (done) {
            var count = 0,
                callback = function () {
                    count++;
                    expect(count).to.equal(1);
                    done();
                };
            hash.register(['unregistered-hash-link'], callback);

            try {
                hash.register(['unregistered-hash-link'], callback);
                expect('Error should have been thrown').to.equal(false);
            } catch (e) {
                expect(e.message).to.equal('hashManager: hash (unregistered-hash-link) already exists');
            }

            location.hash = 'unregistered-hash-link';
        });

        it('can change the documents location with .changeHash()', function () {
            hash.change('newHash');
            expect(location.hash).to.equal('#!newHash');
            hash.change('my-this-is-wonderful');
            expect(location.hash).to.equal('#!my-this-is-wonderful');
        });

    });

    return describeSpec;
}

if (window.define) {
    define('specs/hashManagerSpec', ['utils/hashManager'], function (hash) {
        return hashManagerSpec(hash);
    });
}