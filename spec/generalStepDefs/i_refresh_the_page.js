describe('I refresh the page', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'I refresh the page';
    });

    it('should match "I refresh the page"', function() {
      verifyStepMatch('I refresh the page');
    });
  });

  describe('execution', function() {
    beforeEach(function() {
      sinon.stub(browser, 'refresh');
    });

    afterEach(function() {
      browser.refresh.restore();
    });

    it('should refresh the page', function() {
      return executeStep('I refresh the page', function() {
        expect(browser.refresh).to.have.been.calledOnce;
      });
    });
  });
});
