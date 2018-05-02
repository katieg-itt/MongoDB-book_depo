module.exports = {
  'Can Add Book' : function (client) {
    client
      .url('https://warm-waters-74555.herokuapp.com/')
      .waitForElementVisible('body', 1000)
      .assert.visible('#book_Depository .book-title a.modal-trigger')
      .click('#book_Depository .book-title a.modal-trigger')
      .pause(1000)
      .assert.visible('#addbook')
      .assert.containsText('#addbook h4', 'Add New Book')
      .end();
  }
};