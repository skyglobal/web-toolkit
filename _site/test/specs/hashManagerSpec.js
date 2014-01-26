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

        it('Will execute an assigned function when the documents current hash is registered later', function(done){
            hash.change('page-load-hash');
            var count = 0,
                callback = function () {
                    count++;
                };
            setTimeout(function() {
                hash.register(['page-load-hash'], callback);
                setTimeout(function() {
                    hash.register(['something'], callback);
                    setTimeout(function() {
                        expect(count).to.equal(1);
                        done();
                    }, 5);
                }, 5);
            }, 5);
        });

        it('can register a single hash (string), or multiple (array)', function (done) {
            hash.change('');
            var count = 0,
                callback = function () {
                    count++;
                };
            setTimeout(function() {
                hash.register('single-hash', callback);
                hash.register(['array-hash-1','array-hash-2'], callback);
                expect(count).to.equal(0);
                setTimeout(function(){
                    hash.change('single-hash');
                    setTimeout(function() {
                        expect(count).to.equal(1);
                        expect(location.hash).to.equal('#!single-hash');
                        hash.change('array-hash-2');
                        setTimeout(function() {
                            expect(count).to.equal(2);
                            expect(location.hash).to.equal('#!array-hash-2');
                            hash.change('array-hash-1');
                            setTimeout(function() {
                                expect(count).to.equal(3);
                                expect(location.hash).to.equal('#!array-hash-1');
                                done();
                            },5);
                        },5);
                    },5);
                },5);
            },5);

        });

        it('can change the documents location with .changeHash()', function () {
            hash.change('newHash');
            expect(location.hash).to.equal('#!newHash');
            hash.change('my-this-is-wonderful');
            expect(location.hash).to.equal('#!my-this-is-wonderful');
        });

        describe(' Can Register Wildcards (\'/*\')', function () {

            it('so multiple unknown hashes execute the same functions', function(done) {
                hash.change('');
                var count= 0,
                    callback = function (hash) {
                        count++;
                    };
                setTimeout(function(){
                    hash.register(['test-wildcard/*'], callback);
                    hash.change('test-wildcard/first');
                    setTimeout(function(){
                        expect(count).to.equal(1);
                        expect(location.hash).to.equal('#!test-wildcard/first');
                        hash.change('test-wildcard/second');
                        setTimeout(function(){
                            expect(count).to.equal(2);
                            expect(location.hash).to.equal('#!test-wildcard/second');
                            hash.change('test-wildcard');
                            setTimeout(function(){
                                expect(count).to.equal(3);
                                expect(location.hash).to.equal('#!test-wildcard');
                                hash.change('test-wild');
                                setTimeout(function(){
                                    expect(count).to.equal(3);
                                    expect(location.hash).to.equal('#!test-wild');
                                    done();
                                },5);
                            },5);
                        },5);
                    },5);
                },5);
            });

            it('prioritises exact hashes over wildcard hashes', function(done) {
                hash.change('');
                var count1= 0,count2= 0,
                    callback1 = function (hash) {
                        count1++;
                    },
                    callback2 = function (hash) {
                        count2++;
                    };
                setTimeout(function(){
                    hash.register(['test-prioritisation/*'], callback1);
                    hash.register(['test-prioritisation/exact'], callback2);
                    hash.change('test-prioritisation/exact');
                    setTimeout(function(){
                        expect(count2).to.equal(1);
                        expect(count1).to.equal(0);
                        expect(location.hash).to.equal('#!test-prioritisation/exact');
                        hash.change('test-prioritisation/unknown');
                        setTimeout(function(){
                            expect(count2).to.equal(1);
                            expect(count1).to.equal(1);
                            expect(location.hash).to.equal('#!test-prioritisation/unknown');
                            done();
                        },5);
                    },5);
                },5);
            });

            it('two similar hash\'s (\'pete\' and \'peter\') still execute two different function', function(done) {
                var count1= 0,
                    count2= 0,
                    callback1 = function (hash) {
                        count1++;
                    },
                    callback2 = function (hash) {
                        count2++;
                    };
                hash.register(['my-main-hash-man'], callback1);
                hash.register(['my-main-hash-manager'], callback2);
                expect(count1).to.equal(0);
                hash.change('my-main-hash-man');
                setTimeout(function(){
                    expect(count1).to.equal(1);
                    expect(count2).to.equal(0);
                    hash.change('my-main-hash-manager');
                    setTimeout(function(){
                        expect(count1).to.equal(1);
                        expect(count2).to.equal(1);
                        done();
                    },5);
                },5);
            });

            it('Will execute an assigned wildcard function when documents current hash is registered later', function (done) {
                hash.change('page-load/hash');
                var count = 0,
                    callback = function () {
                        count++;
                    };
                setTimeout(function() {
                    hash.register(['page-load/*'], callback);
                    setTimeout(function() {
                        hash.register(['something/else'], callback);
                        setTimeout(function() {
                            expect(count).to.equal(1);
                            done();
                        }, 5);
                    }, 5);
                }, 5);
            });
        });
    });

    return describeSpec;
}

if (window.define) {
    define('specs/hashManagerSpec', ['utils/hashManager'], function (hash) {
        return hashManagerSpec(hash);
    });
}