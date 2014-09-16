describe('global (non-AMD) toolkit', function () {

    it('should not throw an error', function () {
        expect(toolkit).to.not.equal(undefined);
        expect(toolkit.detect).to.not.equal(undefined);
    });

});
