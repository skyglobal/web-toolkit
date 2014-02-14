function hashManagerSpec(hashManager) {

    var describeSpec = 'Hash Utility';

    if (!hashManager){ //needed for running test in demo page
        hashManager = toolkit.hashManager;
    }

    document.body.innerHTML += window.__html__['utils/hash-manager/default.html'];

    function myHashCallback() {
        $('#currentHash').text(location.hash);
    }

    hashManager.register(['hash', 'anotherHash', 'wildcard/*'], myHashCallback);

    describe(describeSpec, function () {

        it('cleans up any occurence of the # character in the hash', function () {
            expect(hashManager.cleanHash('#news')).to.equal('news');
            expect(hashManager.cleanHash('#sports')).to.equal('sports');
        });

        it('also cleans up any occurence of the ! character in the hash', function () {
            expect(hashManager.cleanHash('#!news')).to.equal('news');
            expect(hashManager.cleanHash('#!sports')).to.equal('sports');
        });

        it('Will execute an assigned function when the documents hash changes', function (done) {
            var count = 0,
                callback = function () {
                    count++;
                    expect(count).to.equal(1);
                    done();
                };
            hashManager.register(['unregistered-hash-link'], callback);

            try {
                hashManager.register(['unregistered-hash-link'], callback);
                expect('Error should have been thrown').to.equal(false);
            } catch (e) {
                expect(e.message).to.equal('hashManager: hash (unregistered-hash-link) already exists');
            }
            location.hash = 'unregistered-hash-link';
        });

        it('Will execute an assigned function when the documents current hash is registered later', function(done){
            hashManager.change('page-load-hash');
            var count = 0,
                callback = function () {
                    count++;
                };
            setTimeout(function() {
                hashManager.register(['page-load-hash'], callback);
                setTimeout(function() {
                    hashManager.register(['something'], callback);
                    setTimeout(function() {
                        expect(count).to.equal(1);
                        done();
                    }, 5);
                }, 5);
            }, 5);
        });

        it('can register a single hash (string), or multiple (array)', function (done) {
            hashManager.change('');
            var count = 0,
                callback = function () {
                    count++;
                };
            setTimeout(function() {
                hashManager.register('single-hash', callback);
                hashManager.register(['array-hash-1','array-hash-2'], callback);
                expect(count).to.equal(0);
                setTimeout(function(){
                    hashManager.change('single-hash');
                    setTimeout(function() {
                        expect(count).to.equal(1);
                        expect(location.hash).to.equal('#!single-hash');
                        hashManager.change('array-hash-2');
                        setTimeout(function() {
                            expect(count).to.equal(2);
                            expect(location.hash).to.equal('#!array-hash-2');
                            hashManager.change('array-hash-1');
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
            hashManager.change('newHash');
            expect(location.hash).to.equal('#!newHash');
            hashManager.change('my-this-is-wonderful');
            expect(location.hash).to.equal('#!my-this-is-wonderful');
        });

        describe(' Can Register Wildcards (\'/*\')', function () {

            it('so multiple unknown hashes execute the same functions', function(done) {
                hashManager.change('');
                var count= 0,
                    callback = function (hash) {
                        count++;
                    };
                setTimeout(function(){
                    hashManager.register(['test-wildcard/*'], callback);
                    hashManager.change('test-wildcard/first');
                    setTimeout(function(){
                        expect(count).to.equal(1);
                        expect(location.hash).to.equal('#!test-wildcard/first');
                        hashManager.change('test-wildcard/second');
                        setTimeout(function(){
                            expect(count).to.equal(2);
                            expect(location.hash).to.equal('#!test-wildcard/second');
                            hashManager.change('test-wildcard');
                            setTimeout(function(){
                                expect(count).to.equal(3);
                                expect(location.hash).to.equal('#!test-wildcard');
                                hashManager.change('test-wild');
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
                hashManager.change('');
                var count1= 0,count2= 0,
                    callback1 = function (hash) {
                        count1++;
                    },
                    callback2 = function (hash) {
                        count2++;
                    };
                setTimeout(function(){
                    hashManager.register(['test-prioritisation/*'], callback1);
                    hashManager.register(['test-prioritisation/exact'], callback2);
                    hashManager.change('test-prioritisation/exact');
                    setTimeout(function(){
                        expect(count2).to.equal(1);
                        expect(count1).to.equal(0);
                        expect(location.hash).to.equal('#!test-prioritisation/exact');
                        hashManager.change('test-prioritisation/unknown');
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
                hashManager.register(['my-main-hash-man'], callback1);
                hashManager.register(['my-main-hash-manager'], callback2);
                expect(count1).to.equal(0);
                hashManager.change('my-main-hash-man');
                setTimeout(function(){
                    expect(count1).to.equal(1);
                    expect(count2).to.equal(0);
                    hashManager.change('my-main-hash-manager');
                    setTimeout(function(){
                        expect(count1).to.equal(1);
                        expect(count2).to.equal(1);
                        done();
                    },5);
                },5);
            });

            it('Will execute an assigned wildcard function when documents current hash is registered later', function (done) {
                hashManager.change('page-load/hash');
                var count = 0,
                    callback = function () {
                        count++;
                    };
                setTimeout(function() {
                    hashManager.register(['page-load/*'], callback);
                    setTimeout(function() {
                        hashManager.register(['something/else'], callback);
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
    require(['chai', 'utils/hash-manager'], function (chai, hashManager) {
        window.chai = chai;
        window.assert = chai.assert;
        window.expect = chai.expect;
        window.to = chai.to;
        return hashManagerSpec(hashManager);
    });
}