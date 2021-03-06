var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then, setWorldConstructor}) {
  Given(/^.*(covered by .*)$/, function (arg1) {});

  Given('I (am on)(go to) the "{captureString}" page', function(pageName) {
    if (this.pageObjectMap[pageName] == null) {
      throw new Error("Could not find page with name '" + pageName + "' in the PageObjectMap, did you remember to add it?");
    }
    this.currentPage = new this.pageObjectMap[pageName];
    this.currentPage.get();
    return this.currentPage.waitForLoaded();
  });

  Given('I (have)(change to)(resize to)(rotate to) a {int}x{int} screen size', function(width, height) {
    return browser.manage().window().setSize(parseInt(width, 10), parseInt(height, 10));
  });

  When('I navigate/click backwards/back in my browser', function() {
    return browser.navigate().back();
  });

  When('I type "{captureString}" in(to) the "{elementName}"{elementType}', function(text, name, type) {
    var field = name + type;
    this.elementHelper.waitForDisplayedByName(field, this);
    this.currentPage[field].clear();
    return this.currentPage[field].sendKeys(text);
  });

  When('I click the "{elementName}"{elementType}', function(name, type) {
    var element = name + type;
    this.elementHelper.waitForDisplayedByName(element, this);
    return this.currentPage[element].click();
  });

  When('I refresh the page', function() {
    return browser.refresh();
  });

  When('I select "{captureString}" in the "{elementName}"{elementType}', function(optionText, name, type) {
    var list = name + type;
    this.elementHelper.waitForDisplayedByName(list, this);
    return this.currentPage[list].element(protractor.By.cssContainingText('option', optionText)).click();
  });

  Then('the title {shouldToBoolean} equal "{captureString}"', function(expectation, text) {
    if (expectation) {
      return this.expect(browser.getTitle()).to.eventually.equal(text);
    } else {
      return this.expect(browser.getTitle()).not.to.eventually.equal(text);
    }
  });

  Then('the "{elementName}"{elementType} {shouldToBoolean} be active', function(name, type, expectation) {
    var element = name + type;
    browser.wait(() => { return this.currentPage[element].isPresent(); }, 5000);
    return this.expect(this.elementHelper.hasClass(this.currentPage[element], 'active')).to.eventually.equal(expectation);
  });

  Then('the "{elementName}"{elementType} {shouldToBoolean} be present', function(name, type, expectation) {
    var element = name + type;

    if (expectation) {
      browser.wait(() => {
        return this.currentPage[element].isPresent();
      },
        5000
      ).catch( (err) => {
        if (err.name !== 'TimeoutError') {
          throw err;
        }
      });
    }

    return this.expect(this.currentPage[element].isPresent()).to.eventually.equal(expectation);
  });

  Then('I (should be on)(reach)(am taken to) the "{captureString}" page', function(pageName) {
    this.currentPage = new this.pageObjectMap[pageName];
    return this.currentPage.waitForLoaded();
  });

  Then('(the )"{elementName}"{elementType} {shouldToBoolean} have/contain the text "{captureString}"', function(name, type, expectation, text) {
    this.element = this.currentPage[name + type];
    browser.wait(() => { return this.element.isPresent(); }, 5000);

    var elementText = this.element.getTagName().then((tagName) => {
      if (tagName === "input") {
        return this.element.getAttribute('value');
      } else {
        return this.element.getText();
      };
    });

    if (expectation) {
      return this.expect(elementText).to.eventually.contain(text);
    } else {
      return this.expect(elementText).not.to.eventually.contain(text);
    }
  });

  Then('"{captureString}" {shouldToBoolean} appear in the "{elementName}"{elementType}', function(option, expectation, name, type) {
    this.list = this.currentPage[name + type];
    browser.wait(() => { return this.list.isPresent(); }, 5000);

    var optionsText = this.list.all(By.tagName('option')).map(function(element, index) {
      return element.getText();
    });

    if (expectation) {
      return this.expect(optionsText).to.eventually.contain(option);
    } else {
      return this.expect(optionsText).not.to.eventually.contain(option);
    }
  });

  Then('the "{elementName}"{elementType} {shouldToBoolean} be displayed', function(name, type, expectation) {
    var element = name + type;
    if (expectation) {
      this.elementHelper.waitForDisplayedByName(element, this).catch((err) => {
        if (err.name !== 'TimeoutError') {
          throw err;
        }
      })
    }

    return isDisplayed = this.currentPage[name + type].isDisplayed().then((isDisplayed) => {
      this.expect(isDisplayed).to.equal(expectation);
    }, (err) => {
      if (err.name === 'NoSuchElementError') {
        this.expect(false).to.equal(expectation);
      } else {
        throw err;
      }
    });
  });

  Then('(the )"{elementName}"{elementType} {shouldToBoolean} have/contain the placeholder text "{captureString}"', function(name, type, expectation, text) {
    var element = this.currentPage[name + type];
    browser.wait(() => { return element.isPresent(); }, 5000);

    if (expectation) {
      return this.expect(element.getAttribute('placeholder')).to.eventually.contain(text);
    } else {
      return this.expect(element.getAttribute('placeholder')).not.to.eventually.contain(text);
    }
  });

  Then('the "{elementName}"{elementType} {shouldToBoolean} be enabled', function(name, type, expectation) {
    var element = this.currentPage[name + type];
    browser.wait(() => { return element.isPresent(); }, 5000);
    return this.expect(element.isEnabled()).to.eventually.equal(expectation);
  });

  Then('"{captureString}" {shouldToBoolean} be selected/displayed in the "{elementName}"{elementType}', function(text, expectation, name, type) {
    var list = this.currentPage[name + type];
    browser.wait(() => { return list.isPresent(); }, 5000);

    var option = list.element(By.cssContainingText('option', text));
    return this.expect(option.isSelected()).to.eventually.equal(expectation);
  });

  Then('the "{elementName}"{elementType} {shouldToBoolean} be checked', function(name, type, expectation) {
    var checkbox = this.currentPage[name + type];
    browser.wait(() => { return checkbox.isPresent(); }, 5000);
    return this.expect(this.currentPage[name + type].isSelected()).to.eventually.equal(expectation);
  });
});

module.exports = function() {};
